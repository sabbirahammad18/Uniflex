const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const sourceSvgPath = process.argv[2] || "/home/tanvir-rana/Downloads/Uniplex Limited Customer Plan.svg";
const plotsJsonPath = path.join(repoRoot, "src/data/plots_label_based.json");
const outputPath = path.join(repoRoot, "src/data/full_map_plot_paths.json");

const PLOT_LAYER_PATTERN = /\b(?:\d+\s*K\s*Plot|Commercial Plot|Apartment|Corner Shop|Reserve Land)\b/i;
const MIN_PATH_WIDTH = 6;
const MIN_PATH_HEIGHT = 6;
const GRID_CELL_SIZE = 40;

const plotsDataset = JSON.parse(fs.readFileSync(plotsJsonPath, "utf8"));
const sourceSvg = fs.readFileSync(sourceSvgPath, "utf8");

const normalizeText = (value) => String(value ?? "").trim().toLowerCase();

const getAttr = (tag, name) => {
  const match = tag.match(new RegExp(`${name}="([^"]*)"`));
  return match?.[1] || "";
};

const parseMatrix = (transform) => {
  const match = transform.match(/matrix\(([^)]+)\)/);
  if (!match) {
    return [1, 0, 0, 1, 0, 0];
  }

  const values = match[1].split(/[ ,]+/).filter(Boolean).map(Number);
  return values.length === 6 && values.every(Number.isFinite) ? values : [1, 0, 0, 1, 0, 0];
};

const transformPoint = (x, y, matrix) => [
  matrix[0] * x + matrix[2] * y + matrix[4],
  matrix[1] * x + matrix[3] * y + matrix[5],
];

const tokenizePath = (d) => d.match(/[a-zA-Z]|[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g) || [];

const getPathBounds = (d, matrix) => {
  const tokens = tokenizePath(d);
  let index = 0;
  let command = "";
  let currentX = 0;
  let currentY = 0;
  let startX = 0;
  let startY = 0;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  const isCommand = (token) => /^[a-zA-Z]$/.test(token);
  const readNumber = () => Number(tokens[index++]);
  const recordPoint = (x, y) => {
    const [tx, ty] = transformPoint(x, y, matrix);
    minX = Math.min(minX, tx);
    minY = Math.min(minY, ty);
    maxX = Math.max(maxX, tx);
    maxY = Math.max(maxY, ty);
  };

  while (index < tokens.length) {
    if (isCommand(tokens[index])) {
      command = tokens[index++];
    }

    if (!command) {
      break;
    }

    const isRelative = command === command.toLowerCase();
    const upperCommand = command.toUpperCase();

    try {
      if (upperCommand === "M") {
        let firstPoint = true;
        while (index < tokens.length && !isCommand(tokens[index])) {
          let x = readNumber();
          let y = readNumber();
          if (isRelative) {
            x += currentX;
            y += currentY;
          }
          currentX = x;
          currentY = y;
          if (firstPoint) {
            startX = currentX;
            startY = currentY;
            firstPoint = false;
          }
          recordPoint(currentX, currentY);
        }
      } else if (upperCommand === "L") {
        while (index < tokens.length && !isCommand(tokens[index])) {
          let x = readNumber();
          let y = readNumber();
          if (isRelative) {
            x += currentX;
            y += currentY;
          }
          currentX = x;
          currentY = y;
          recordPoint(currentX, currentY);
        }
      } else if (upperCommand === "H") {
        while (index < tokens.length && !isCommand(tokens[index])) {
          let x = readNumber();
          if (isRelative) {
            x += currentX;
          }
          currentX = x;
          recordPoint(currentX, currentY);
        }
      } else if (upperCommand === "V") {
        while (index < tokens.length && !isCommand(tokens[index])) {
          let y = readNumber();
          if (isRelative) {
            y += currentY;
          }
          currentY = y;
          recordPoint(currentX, currentY);
        }
      } else if (upperCommand === "C") {
        while (index < tokens.length && !isCommand(tokens[index])) {
          let x1 = readNumber();
          let y1 = readNumber();
          let x2 = readNumber();
          let y2 = readNumber();
          let x = readNumber();
          let y = readNumber();
          if (isRelative) {
            x1 += currentX;
            y1 += currentY;
            x2 += currentX;
            y2 += currentY;
            x += currentX;
            y += currentY;
          }
          recordPoint(x1, y1);
          recordPoint(x2, y2);
          currentX = x;
          currentY = y;
          recordPoint(currentX, currentY);
        }
      } else if (upperCommand === "S") {
        while (index < tokens.length && !isCommand(tokens[index])) {
          let x2 = readNumber();
          let y2 = readNumber();
          let x = readNumber();
          let y = readNumber();
          if (isRelative) {
            x2 += currentX;
            y2 += currentY;
            x += currentX;
            y += currentY;
          }
          recordPoint(x2, y2);
          currentX = x;
          currentY = y;
          recordPoint(currentX, currentY);
        }
      } else if (upperCommand === "Q") {
        while (index < tokens.length && !isCommand(tokens[index])) {
          let x1 = readNumber();
          let y1 = readNumber();
          let x = readNumber();
          let y = readNumber();
          if (isRelative) {
            x1 += currentX;
            y1 += currentY;
            x += currentX;
            y += currentY;
          }
          recordPoint(x1, y1);
          currentX = x;
          currentY = y;
          recordPoint(currentX, currentY);
        }
      } else if (upperCommand === "T") {
        while (index < tokens.length && !isCommand(tokens[index])) {
          let x = readNumber();
          let y = readNumber();
          if (isRelative) {
            x += currentX;
            y += currentY;
          }
          currentX = x;
          currentY = y;
          recordPoint(currentX, currentY);
        }
      } else if (upperCommand === "A") {
        while (index < tokens.length && !isCommand(tokens[index])) {
          readNumber();
          readNumber();
          readNumber();
          readNumber();
          readNumber();
          let x = readNumber();
          let y = readNumber();
          if (isRelative) {
            x += currentX;
            y += currentY;
          }
          currentX = x;
          currentY = y;
          recordPoint(currentX, currentY);
        }
      } else if (upperCommand === "Z") {
        currentX = startX;
        currentY = startY;
        recordPoint(currentX, currentY);
      } else {
        break;
      }
    } catch {
      break;
    }
  }

  if (!Number.isFinite(minX)) {
    return null;
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
    cx: (minX + maxX) / 2,
    cy: (minY + maxY) / 2,
  };
};

const sizeKeyForPlot = (plot) => {
  const value = normalizeText(plot.category || plot.size);
  if (value.includes("3")) return "3";
  if (value.includes("5")) return "5";
  if (value.includes("10")) return "10";
  if (value.includes("15")) return "15";
  if (value.includes("20")) return "20";
  if (value.includes("apartment")) return "apartment";
  return "other";
};

const sizeKeyForLayer = (layer) => {
  const value = normalizeText(layer);
  if (value.includes("3 k")) return "3";
  if (value.includes("5 k")) return "5";
  if (value.includes("10 k")) return "10";
  if (value.includes("15 k")) return "15";
  if (value.includes("20 k")) return "20";
  if (value.includes("apartment")) return "apartment";
  return "other";
};

const tokens = sourceSvg.match(/<g\b[^>]*>|<\/g>|<path\b[^>]*>/g) || [];
const layerStack = [];
const sourcePaths = [];

for (const token of tokens) {
  if (token.startsWith("<g")) {
    const label = token.match(/inkscape:label="([^"]+)"/)?.[1] || null;
    layerStack.push(label);
    continue;
  }

  if (token.startsWith("</g")) {
    layerStack.pop();
    continue;
  }

  const layer = [...layerStack].reverse().find(Boolean) || "";
  if (!PLOT_LAYER_PATTERN.test(layer)) {
    continue;
  }

  const d = getAttr(token, "d");
  const transform = getAttr(token, "transform");
  const bounds = getPathBounds(d, parseMatrix(transform));

  if (!bounds || bounds.width < MIN_PATH_WIDTH || bounds.height < MIN_PATH_HEIGHT) {
    continue;
  }

  sourcePaths.push({
    id: `source-plot-path-${sourcePaths.length + 1}`,
    layer,
    sizeKey: sizeKeyForLayer(layer),
    d,
    transform,
    bounds,
  });
}

const pathGrid = new Map();
const addToGrid = (key, value) => {
  const existing = pathGrid.get(key);
  if (existing) {
    existing.push(value);
  } else {
    pathGrid.set(key, [value]);
  }
};

for (const sourcePath of sourcePaths) {
  const minCellX = Math.floor((sourcePath.bounds.minX - 4) / GRID_CELL_SIZE);
  const maxCellX = Math.floor((sourcePath.bounds.maxX + 4) / GRID_CELL_SIZE);
  const minCellY = Math.floor((sourcePath.bounds.minY - 4) / GRID_CELL_SIZE);
  const maxCellY = Math.floor((sourcePath.bounds.maxY + 4) / GRID_CELL_SIZE);

  for (let x = minCellX; x <= maxCellX; x += 1) {
    for (let y = minCellY; y <= maxCellY; y += 1) {
      addToGrid(`${x}:${y}`, sourcePath);
    }
  }
}

const usedPathIds = new Set();
const compactPlots = [];
let matchedPathCount = 0;
let fallbackPathCount = 0;
const plotBounds = {
  minX: Infinity,
  minY: Infinity,
  maxX: -Infinity,
  maxY: -Infinity,
};

const recordBounds = (bounds) => {
  plotBounds.minX = Math.min(plotBounds.minX, bounds.minX);
  plotBounds.minY = Math.min(plotBounds.minY, bounds.minY);
  plotBounds.maxX = Math.max(plotBounds.maxX, bounds.maxX);
  plotBounds.maxY = Math.max(plotBounds.maxY, bounds.maxY);
};

for (const plot of plotsDataset.plots || []) {
  const [centerX, centerY] = Array.isArray(plot.center) ? plot.center.map(Number) : [NaN, NaN];

  if (!Number.isFinite(centerX) || !Number.isFinite(centerY)) {
    continue;
  }

  const plotSizeKey = sizeKeyForPlot(plot);
  const cellX = Math.floor(centerX / GRID_CELL_SIZE);
  const cellY = Math.floor(centerY / GRID_CELL_SIZE);
  const candidates = [];

  for (let x = cellX - 1; x <= cellX + 1; x += 1) {
    for (let y = cellY - 1; y <= cellY + 1; y += 1) {
      for (const candidate of pathGrid.get(`${x}:${y}`) || []) {
        if (!usedPathIds.has(candidate.id)) {
          candidates.push(candidate);
        }
      }
    }
  }

  let bestPath = null;
  let bestScore = Infinity;

  for (const candidate of candidates) {
    const contains =
      centerX >= candidate.bounds.minX - 3 &&
      centerX <= candidate.bounds.maxX + 3 &&
      centerY >= candidate.bounds.minY - 3 &&
      centerY <= candidate.bounds.maxY + 3;
    const outsideX = Math.max(candidate.bounds.minX - centerX, 0, centerX - candidate.bounds.maxX);
    const outsideY = Math.max(candidate.bounds.minY - centerY, 0, centerY - candidate.bounds.maxY);
    const edgeDistance = Math.hypot(outsideX, outsideY);
    const centerDistance = Math.hypot(candidate.bounds.cx - centerX, candidate.bounds.cy - centerY);
    const sizePenalty = plotSizeKey === "other" || candidate.sizeKey === plotSizeKey ? 0 : 25;
    const score = (contains ? 0 : edgeDistance * 4) + centerDistance * 0.1 + sizePenalty;

    if (score < bestScore) {
      bestScore = score;
      bestPath = candidate;
    }
  }

  if (bestPath && bestScore < 35) {
    usedPathIds.add(bestPath.id);
    matchedPathCount += 1;
    compactPlots.push({
      id: plot.id,
      plot_no: plot.plot_no ?? null,
      size: plot.size ?? null,
      status: plot.status ?? "unknown",
      category: plot.category ?? null,
      center: [centerX, centerY],
      bbox: Array.isArray(plot.bbox) ? plot.bbox : null,
      sector: plot.sector ?? null,
      block: plot.block ?? null,
      road: plot.road ?? null,
      price: plot.price ?? null,
      sourcePathId: bestPath.id,
      layer: bestPath.layer,
      d: bestPath.d,
      transform: bestPath.transform,
      bounds: bestPath.bounds,
    });
    recordBounds(bestPath.bounds);
  } else {
    const bbox = Array.isArray(plot.bbox) ? plot.bbox.map(Number) : [centerX - 5, centerY - 4, centerX + 5, centerY + 4];
    const width = Math.max(14, bbox[2] - bbox[0] + 8);
    const height = Math.max(11, bbox[3] - bbox[1] + 8);
    const bounds = {
      minX: centerX - width / 2,
      minY: centerY - height / 2,
      maxX: centerX + width / 2,
      maxY: centerY + height / 2,
      width,
      height,
      cx: centerX,
      cy: centerY,
    };

    fallbackPathCount += 1;
    compactPlots.push({
      id: plot.id,
      plot_no: plot.plot_no ?? null,
      size: plot.size ?? null,
      status: plot.status ?? "unknown",
      category: plot.category ?? null,
      center: [centerX, centerY],
      bbox: Array.isArray(plot.bbox) ? plot.bbox : null,
      sector: plot.sector ?? null,
      block: plot.block ?? null,
      road: plot.road ?? null,
      price: plot.price ?? null,
      sourcePathId: null,
      layer: "label fallback",
      d: `M${bounds.minX} ${bounds.minY}H${bounds.maxX}V${bounds.maxY}H${bounds.minX}Z`,
      transform: "",
      bounds,
    });
    recordBounds(bounds);
  }
}

const unassignedPaths = sourcePaths
  .filter((sourcePath) => !usedPathIds.has(sourcePath.id))
  .map((sourcePath) => ({
    sourcePathId: sourcePath.id,
    layer: sourcePath.layer,
    d: sourcePath.d,
    transform: sourcePath.transform,
    bounds: sourcePath.bounds,
  }));

const output = {
  meta: {
    sourceSvg: path.basename(sourceSvgPath),
    width: Number(plotsDataset.meta?.width) || 2880,
    height: Number(plotsDataset.meta?.height) || 2160,
    plotBounds,
    sourcePlotPaths: sourcePaths.length,
    matchedPlotPaths: matchedPathCount,
    fallbackPlotPaths: fallbackPathCount,
    unassignedSourcePaths: unassignedPaths.length,
    note: "Generated from plot-specific SVG layers and matched to label JSON by SVG coordinates. Road/sector/block fields are still supplied by the JSON or API, not inferred here.",
  },
  plots: compactPlots,
  unassignedPaths,
};

fs.writeFileSync(outputPath, `${JSON.stringify(output)}\n`);

console.log(
  `Generated ${output.plots.length} compact plot paths (${matchedPathCount} matched, ${fallbackPathCount} fallback) and ${unassignedPaths.length} unassigned structure paths.`,
);
