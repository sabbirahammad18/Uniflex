import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import {
  TransformComponent,
  TransformWrapper,
  type ReactZoomPanPinchContentRef,
  type ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import plotsDataset from "../../data/plots_label_based.json";
import PlotDetailsModal from "./PlotDetailsModal";
import PlotSearch from "./PlotSearch";
import "./UniplexMap.css";

type PlotStatus = "available" | "booked" | "hold" | "sold" | "unknown";

type LivePlotStatus = {
  plot_no?: string | number | null;
  plotNo?: string | number | null;
  plot_number?: string | number | null;
  plotNumber?: string | number | null;
  status?: string | null;
  price?: string | number | null;
  sector?: string | null;
  block?: string | null;
  road?: string | null;
  size?: string | number | null;
  category?: string | null;
};

type RawPlot = {
  id?: string;
  plot_no?: string | number | null;
  size?: string | number | null;
  status?: string | null;
  category?: string | null;
  center?: unknown;
  bbox?: unknown;
  sector?: string | null;
  block?: string | null;
  road?: string | null;
  price?: string | number | null;
};

export type MapPlot = RawPlot & {
  uid: string;
  plot_no: string;
  size: string | number | null;
  category: string;
  status: PlotStatus;
  statusColor: string;
  sector: string | null;
  block: string | null;
  road: string | null;
  price: string | number | null;
  centerX: number;
  centerY: number;
  searchText: string;
};

type PlotDataset = {
  meta?: {
    width?: number;
    height?: number;
  };
  plots?: RawPlot[];
};

type SearchResults = {
  count: number;
  items: MapPlot[];
};

type StatusCounts = Record<PlotStatus, number>;

type UniplexMapProps = {
  apiUrl?: string;
  className?: string;
  initialStatuses?: LivePlotStatus[];
};

type PointerStart = {
  x: number;
  y: number;
  time: number;
};

type MapPoint = {
  x: number;
  y: number;
  scale: number;
};

type TransformControls = Pick<ReactZoomPanPinchRef | ReactZoomPanPinchContentRef, "setTransform">;

type Tile = {
  key: string;
  src: string;
  left: number;
  top: number;
  width: number;
  height: number;
};

type TransformState = {
  scale: number;
  positionX: number;
  positionY: number;
};

const typedDataset = plotsDataset as PlotDataset;
const MAP_WIDTH = Number(typedDataset.meta?.width) || 2880;
const MAP_HEIGHT = Number(typedDataset.meta?.height) || 2160;
const MAP_RENDER_WIDTH = 24000;
const MAP_RENDER_HEIGHT = 18000;
const MAP_RENDER_SCALE = MAP_RENDER_WIDTH / MAP_WIDTH;
const MIN_ZOOM_SCALE = 0.012;
const MAX_ZOOM_SCALE = 1;
const TILE_SIZE = 512;
const TILE_MAX_LEVEL = 6;
const TILE_PATH = "/map-tiles";
const MAX_SEARCH_RESULTS = 80;
const GRID_CELL_SIZE = 48;

const STATUS_COLORS: Record<PlotStatus, string> = {
  available: "#0f9d58",
  booked: "#d92d20",
  hold: "#f59e0b",
  sold: "#64748b",
  unknown: "#2563eb",
};

const MAP_STAGE_STYLE: CSSProperties = {
  width: MAP_RENDER_WIDTH,
  height: MAP_RENDER_HEIGHT,
};

const normalizeText = (value: unknown): string => String(value ?? "").trim().toLowerCase();

const normalizePlotNo = (value: unknown): string => String(value ?? "").trim();

const normalizeStatus = (value: unknown): PlotStatus => {
  const status = normalizeText(value).replace(/[\s-]+/g, "_");

  if (status.includes("available")) return "available";
  if (status.includes("book")) return "booked";
  if (status.includes("hold")) return "hold";
  if (status.includes("sold")) return "sold";

  return "unknown";
};

const getLivePlotNo = (row: LivePlotStatus): string =>
  normalizePlotNo(row.plot_no ?? row.plotNo ?? row.plot_number ?? row.plotNumber);

const isValidCenter = (center: unknown): center is [number | string, number | string] =>
  Array.isArray(center) && Number.isFinite(Number(center[0])) && Number.isFinite(Number(center[1]));

const getCellKey = (x: number, y: number): string => `${x}:${y}`;

const buildSearchText = (plot: Omit<MapPlot, "searchText">): string =>
  [
    plot.plot_no,
    plot.size,
    plot.category,
    plot.status,
    plot.sector,
    plot.block,
    plot.road,
    plot.price,
  ]
    .map(normalizeText)
    .filter(Boolean)
    .join(" ");

const makeEmptyStatusCounts = (): StatusCounts => ({
  available: 0,
  booked: 0,
  hold: 0,
  sold: 0,
  unknown: 0,
});

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

const getTileLevel = (scale: number): number => {
  const dpr = typeof window === "undefined" ? 1 : Math.min(window.devicePixelRatio || 1, 2);
  const idealDownsample = 1 / Math.max(scale * dpr, 0.001);
  const downsamplePower = Math.max(0, Math.round(Math.log2(idealDownsample)));

  return clamp(TILE_MAX_LEVEL - downsamplePower, 0, TILE_MAX_LEVEL);
};

export default function UniplexMap({
  apiUrl = "/api/plots/map-status",
  className = "",
  initialStatuses = [],
}: UniplexMapProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);
  const transformFrameRef = useRef(0);
  const pointerStartRef = useRef<PointerStart | null>(null);

  const [apiStatuses, setApiStatuses] = useState<LivePlotStatus[] | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PlotStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedPlotId, setSelectedPlotId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [transformState, setTransformState] = useState<TransformState>({
    scale: MIN_ZOOM_SCALE,
    positionX: 0,
    positionY: 0,
  });

  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    if (!apiUrl) {
      return undefined;
    }

    const controller = new AbortController();

    fetch(apiUrl, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Plot status request failed with ${response.status}`);
        }

        return response.json();
      })
      .then((rows: unknown) => {
        if (Array.isArray(rows)) {
          setApiStatuses(rows as LivePlotStatus[]);
        }
      })
      .catch((error: Error) => {
        if (error.name !== "AbortError") {
          setApiStatuses(null);
        }
      });

    return () => controller.abort();
  }, [apiUrl]);

  useEffect(() => {
    if (!viewportRef.current) {
      return undefined;
    }

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setViewportSize({ width, height });
    });

    observer.observe(viewportRef.current);
    return () => observer.disconnect();
  }, []);

  const liveStatuses = apiStatuses ?? initialStatuses;

  const liveStatusByPlotNo = useMemo(() => {
    const rowsByPlotNo = new Map<string, LivePlotStatus>();

    liveStatuses.forEach((row) => {
      const plotNo = getLivePlotNo(row);
      if (plotNo) {
        rowsByPlotNo.set(plotNo, row);
      }
    });

    return rowsByPlotNo;
  }, [liveStatuses]);

  const plots = useMemo<MapPlot[]>(() => {
    const rawPlots = Array.isArray(typedDataset.plots) ? typedDataset.plots : [];

    return rawPlots
      .filter((plot): plot is RawPlot & { center: [number | string, number | string] } => isValidCenter(plot.center))
      .map((plot, index) => {
        const plotNo = normalizePlotNo(plot.plot_no);
        const liveRow = liveStatusByPlotNo.get(plotNo);
        const status = normalizeStatus(liveRow?.status ?? plot.status);
        const mergedPlot: Omit<MapPlot, "searchText"> = {
          ...plot,
          uid: plot.id || `${plotNo}-${index}`,
          plot_no: plotNo,
          size: liveRow?.size ?? plot.size ?? null,
          category: String(liveRow?.category ?? plot.category ?? "uncategorized"),
          status,
          statusColor: STATUS_COLORS[status],
          sector: liveRow?.sector ?? plot.sector ?? null,
          block: liveRow?.block ?? plot.block ?? null,
          road: liveRow?.road ?? plot.road ?? null,
          price: liveRow?.price ?? plot.price ?? null,
          centerX: Number(plot.center[0]),
          centerY: Number(plot.center[1]),
        };

        return {
          ...mergedPlot,
          searchText: buildSearchText(mergedPlot),
        };
      });
  }, [liveStatusByPlotNo]);

  const selectedPlot = useMemo(
    () => plots.find((plot) => plot.uid === selectedPlotId) || null,
    [plots, selectedPlotId],
  );

  const categories = useMemo(() => {
    const categorySet = new Set<string>();

    plots.forEach((plot) => {
      if (plot.category) {
        categorySet.add(plot.category);
      }
    });

    return Array.from(categorySet).sort((a, b) => a.localeCompare(b));
  }, [plots]);

  const statusCounts = useMemo(
    () =>
      plots.reduce<StatusCounts>((counts, plot) => {
        counts[plot.status] += 1;
        return counts;
      }, makeEmptyStatusCounts()),
    [plots],
  );

  const plotGrid = useMemo(() => {
    const cells = new Map<string, MapPlot[]>();

    plots.forEach((plot) => {
      const gridX = Math.floor(plot.centerX / GRID_CELL_SIZE);
      const gridY = Math.floor(plot.centerY / GRID_CELL_SIZE);
      const key = getCellKey(gridX, gridY);
      const cell = cells.get(key);

      if (cell) {
        cell.push(plot);
      } else {
        cells.set(key, [plot]);
      }
    });

    return cells;
  }, [plots]);

  const searchResults = useMemo<SearchResults>(() => {
    const tokens = normalizeText(deferredQuery).split(/\s+/).filter(Boolean);
    const hasSearch = tokens.length > 0 || statusFilter !== "all" || categoryFilter !== "all";

    if (!hasSearch) {
      return { count: 0, items: [] };
    }

    const items: MapPlot[] = [];
    let count = 0;

    for (const plot of plots) {
      if (statusFilter !== "all" && plot.status !== statusFilter) {
        continue;
      }

      if (categoryFilter !== "all" && plot.category !== categoryFilter) {
        continue;
      }

      if (tokens.length && !tokens.every((token) => plot.searchText.includes(token))) {
        continue;
      }

      count += 1;

      if (items.length < MAX_SEARCH_RESULTS) {
        items.push(plot);
      }
    }

    return { count, items };
  }, [categoryFilter, deferredQuery, plots, statusFilter]);

  const visibleTiles = useMemo<Tile[]>(() => {
    if (!viewportSize.width || !viewportSize.height || transformState.scale <= 0) {
      return [];
    }

    const level = getTileLevel(transformState.scale);
    const downsample = 2 ** (TILE_MAX_LEVEL - level);
    const levelWidth = Math.ceil(MAP_RENDER_WIDTH / downsample);
    const levelHeight = Math.ceil(MAP_RENDER_HEIGHT / downsample);
    const maxTileX = Math.ceil(levelWidth / TILE_SIZE) - 1;
    const maxTileY = Math.ceil(levelHeight / TILE_SIZE) - 1;
    const tileWorldSize = TILE_SIZE * downsample;
    const visibleLeft = clamp(-transformState.positionX / transformState.scale, 0, MAP_RENDER_WIDTH);
    const visibleTop = clamp(-transformState.positionY / transformState.scale, 0, MAP_RENDER_HEIGHT);
    const visibleRight = clamp((viewportSize.width - transformState.positionX) / transformState.scale, 0, MAP_RENDER_WIDTH);
    const visibleBottom = clamp((viewportSize.height - transformState.positionY) / transformState.scale, 0, MAP_RENDER_HEIGHT);
    const minTileX = clamp(Math.floor(visibleLeft / tileWorldSize) - 1, 0, maxTileX);
    const maxVisibleTileX = clamp(Math.floor(visibleRight / tileWorldSize) + 1, 0, maxTileX);
    const minTileY = clamp(Math.floor(visibleTop / tileWorldSize) - 1, 0, maxTileY);
    const maxVisibleTileY = clamp(Math.floor(visibleBottom / tileWorldSize) + 1, 0, maxTileY);
    const tiles: Tile[] = [];

    for (let tileX = minTileX; tileX <= maxVisibleTileX; tileX += 1) {
      for (let tileY = minTileY; tileY <= maxVisibleTileY; tileY += 1) {
        const levelTileLeft = tileX * TILE_SIZE;
        const levelTileTop = tileY * TILE_SIZE;
        const tileWidth = Math.min(TILE_SIZE, levelWidth - levelTileLeft);
        const tileHeight = Math.min(TILE_SIZE, levelHeight - levelTileTop);

        if (tileWidth <= 0 || tileHeight <= 0) {
          continue;
        }

        tiles.push({
          key: `${level}-${tileX}-${tileY}`,
          src: `${TILE_PATH}/${level}/${tileX}/${tileY}.webp`,
          left: tileX * tileWorldSize,
          top: tileY * tileWorldSize,
          width: tileWidth * downsample,
          height: tileHeight * downsample,
        });
      }
    }

    return tiles;
  }, [transformState.positionX, transformState.positionY, transformState.scale, viewportSize.height, viewportSize.width]);

  const getFitTransform = useCallback(() => {
    const viewport = viewportRef.current;
    const rect = viewport?.getBoundingClientRect();
    const width = rect?.width || viewportSize.width || 1;
    const height = rect?.height || viewportSize.height || 1;
    const scale = Math.min(width / MAP_RENDER_WIDTH, height / MAP_RENDER_HEIGHT);

    return {
      scale,
      positionX: (width - MAP_RENDER_WIDTH * scale) / 2,
      positionY: (height - MAP_RENDER_HEIGHT * scale) / 2,
    };
  }, [viewportSize.height, viewportSize.width]);

  const fitMap = useCallback(
    (controls: TransformControls, animationTime = 180) => {
      const nextTransform = getFitTransform();
      controls.setTransform(nextTransform.positionX, nextTransform.positionY, nextTransform.scale, animationTime, "easeOut");
      setTransformState(nextTransform);
    },
    [getFitTransform],
  );

  const handleInit = useCallback(
    (controls: ReactZoomPanPinchRef) => {
      transformRef.current = controls;
      window.requestAnimationFrame(() => fitMap(controls, 0));
    },
    [fitMap],
  );

  const handleTransform = useCallback((controls: ReactZoomPanPinchRef) => {
    transformRef.current = controls;

    if (transformFrameRef.current) {
      window.cancelAnimationFrame(transformFrameRef.current);
    }

    transformFrameRef.current = window.requestAnimationFrame(() => {
      setTransformState({
        scale: controls.state.scale,
        positionX: controls.state.positionX,
        positionY: controls.state.positionY,
      });
    });
  }, []);

  useEffect(
    () => () => {
      if (transformFrameRef.current) {
        window.cancelAnimationFrame(transformFrameRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (!transformRef.current || !viewportSize.width || !viewportSize.height || selectedPlotId) {
      return;
    }

    fitMap(transformRef.current, 0);
  }, [fitMap, selectedPlotId, viewportSize.height, viewportSize.width]);

  const findPlotAtPoint = useCallback(
    (x: number, y: number, scale: number): MapPlot | null => {
      const hitRadius = Math.max(10, Math.min(150, 28 / Math.max(scale, 0.05)));
      const radiusSquared = hitRadius * hitRadius;
      const minCellX = Math.floor((x - hitRadius) / GRID_CELL_SIZE);
      const maxCellX = Math.floor((x + hitRadius) / GRID_CELL_SIZE);
      const minCellY = Math.floor((y - hitRadius) / GRID_CELL_SIZE);
      const maxCellY = Math.floor((y + hitRadius) / GRID_CELL_SIZE);
      let nearestPlot: MapPlot | null = null;
      let nearestDistance = radiusSquared;

      for (let gridX = minCellX; gridX <= maxCellX; gridX += 1) {
        for (let gridY = minCellY; gridY <= maxCellY; gridY += 1) {
          const cell = plotGrid.get(getCellKey(gridX, gridY));
          if (!cell) {
            continue;
          }

          for (const plot of cell) {
            const deltaX = plot.centerX - x;
            const deltaY = plot.centerY - y;
            const distance = deltaX * deltaX + deltaY * deltaY;

            if (distance <= nearestDistance) {
              nearestDistance = distance;
              nearestPlot = plot;
            }
          }
        }
      }

      return nearestPlot;
    },
    [plotGrid],
  );

  const getMapPointFromEvent = useCallback((event: ReactPointerEvent<HTMLCanvasElement>): MapPoint | null => {
    const canvas = canvasRef.current;
    const rect = canvas?.getBoundingClientRect();

    if (!rect || rect.width === 0 || rect.height === 0) {
      return null;
    }

    return {
      x: ((event.clientX - rect.left) / rect.width) * MAP_WIDTH,
      y: ((event.clientY - rect.top) / rect.height) * MAP_HEIGHT,
      scale: rect.width / MAP_WIDTH,
    };
  }, []);

  const zoomAtPoint = useCallback((zoomFactor: number, pointerX: number, pointerY: number, animationTime = 0) => {
    const controls = transformRef.current;
    if (!controls) {
      return;
    }

    const { scale, positionX, positionY } = controls.state;
    const nextScale = Math.min(MAX_ZOOM_SCALE, Math.max(MIN_ZOOM_SCALE, scale * zoomFactor));

    if (nextScale === scale) {
      return;
    }

    const scaleRatio = nextScale / scale;
    const nextPositionX = pointerX - (pointerX - positionX) * scaleRatio;
    const nextPositionY = pointerY - (pointerY - positionY) * scaleRatio;

    controls.setTransform(nextPositionX, nextPositionY, nextScale, animationTime, "easeOut");
  }, []);

  const zoomAtCenter = useCallback(
    (zoomFactor: number) => {
      const rect = viewportRef.current?.getBoundingClientRect();
      if (!rect) {
        return;
      }

      zoomAtPoint(zoomFactor, rect.width / 2, rect.height / 2, 150);
    },
    [zoomAtPoint],
  );

  const handleWheelZoom = useCallback((event: ReactWheelEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement | null)?.closest(".uniplex-search")) {
      return;
    }

    const viewport = viewportRef.current;
    const rect = viewport?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const pointerX = event.clientX - rect.left;
    const pointerY = event.clientY - rect.top;
    const wheelIntensity = event.ctrlKey ? 0.001 : 0.0013;
    const zoomFactor = Math.exp(-event.deltaY * wheelIntensity);

    zoomAtPoint(zoomFactor, pointerX, pointerY, 0);
  }, [zoomAtPoint]);

  const zoomToPlot = useCallback((plot: MapPlot, openDetails = true) => {
    const controls = transformRef.current;
    const viewport = viewportRef.current;
    const rect = viewport?.getBoundingClientRect();

    if (!controls || !rect) {
      setSelectedPlotId(plot.uid);
      setIsDetailsOpen(openDetails);
      return;
    }

    const fitScale = Math.min(rect.width / MAP_RENDER_WIDTH, rect.height / MAP_RENDER_HEIGHT);
    const targetScale = Math.min(1.15, Math.max(0.42, fitScale * 16));
    const positionX = rect.width / 2 - plot.centerX * MAP_RENDER_SCALE * targetScale;
    const positionY = rect.height * 0.48 - plot.centerY * MAP_RENDER_SCALE * targetScale;

    setSelectedPlotId(plot.uid);
    setIsDetailsOpen(openDetails);
    controls.setTransform(positionX, positionY, targetScale, 260, "easeOut");
  }, []);

  const handlePointerDown = useCallback((event: ReactPointerEvent<HTMLCanvasElement>) => {
    pointerStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      time: Date.now(),
    };
  }, []);

  const handlePointerUp = useCallback(
    (event: ReactPointerEvent<HTMLCanvasElement>) => {
      const pointerStart = pointerStartRef.current;
      pointerStartRef.current = null;

      if (!pointerStart) {
        return;
      }

      const moved = Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y);
      const elapsed = Date.now() - pointerStart.time;

      if (moved > 10 || elapsed > 800) {
        return;
      }

      const point = getMapPointFromEvent(event);
      if (!point) {
        return;
      }

      const plot = findPlotAtPoint(point.x, point.y, point.scale);
      if (plot) {
        setSelectedPlotId(plot.uid);
        setIsDetailsOpen(true);
      }
    },
    [findPlotAtPoint, getMapPointFromEvent],
  );

  const closeDetails = useCallback(() => {
    setIsDetailsOpen(false);
  }, []);

  return (
    <section className={`uniplex-map ${className}`} aria-label="Interactive real estate plot map">
      <div className="uniplex-map__viewport" ref={viewportRef} onWheel={handleWheelZoom}>
        <TransformWrapper
          minScale={MIN_ZOOM_SCALE}
          maxScale={MAX_ZOOM_SCALE}
          centerOnInit
          limitToBounds={false}
          smooth
          wheel={{ disabled: true }}
          pinch={{ step: 5 }}
          doubleClick={{ disabled: true }}
          zoomAnimation={{ animationTime: 140, size: 0.08, animationType: "easeOut" }}
          velocityAnimation={{
            sensitivityMouse: 0.7,
            sensitivityTouch: 1,
            maxStrengthMouse: 12,
            maxStrengthTouch: 22,
            animationTime: 180,
            maxAnimationTime: 420,
            animationType: "easeOut",
          }}
          autoAlignment={{ disabled: true }}
          panning={{ velocityDisabled: false }}
          onInit={handleInit}
          onTransform={handleTransform}
        >
          {({ resetTransform }) => (
            <>
              <button
                className={`uniplex-search-toggle${isSearchOpen ? " uniplex-search-toggle--active" : ""}`}
                type="button"
                aria-label={isSearchOpen ? "Close plot search" : "Open plot search"}
                aria-expanded={isSearchOpen}
                onClick={() => setIsSearchOpen((isOpen) => !isOpen)}
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  {isSearchOpen ? "close" : "manage_search"}
                </span>
              </button>

              {isSearchOpen ? (
                <PlotSearch
                  query={query}
                  onQueryChange={setQuery}
                  statusFilter={statusFilter}
                  onStatusFilterChange={setStatusFilter}
                  categoryFilter={categoryFilter}
                  onCategoryFilterChange={setCategoryFilter}
                  categories={categories}
                  results={searchResults.items}
                  resultCount={searchResults.count}
                  totalPlots={plots.length}
                  statusCounts={statusCounts}
                  onClose={() => setIsSearchOpen(false)}
                  onResultClick={(plot) => {
                    zoomToPlot(plot, true);
                    setIsSearchOpen(false);
                  }}
                />
              ) : null}

              <div className="uniplex-map-controls" aria-label="Map controls">
                <button type="button" aria-label="Zoom in" onClick={() => zoomAtCenter(1.32)}>
                  +
                </button>
                <button type="button" aria-label="Zoom out" onClick={() => zoomAtCenter(1 / 1.32)}>
                  -
                </button>
                <button
                  type="button"
                  aria-label="Reset map"
                  onClick={() => {
                    resetTransform(0);
                    setSelectedPlotId(null);
                    setIsDetailsOpen(false);
                    if (transformRef.current) {
                      fitMap(transformRef.current);
                    }
                  }}
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    center_focus_strong
                  </span>
                </button>
              </div>

              <TransformComponent
                wrapperClass="uniplex-transform-wrapper"
                contentClass="uniplex-transform-content"
                wrapperStyle={{ width: "100%", height: "100%" }}
                contentStyle={MAP_STAGE_STYLE}
              >
                <div className="uniplex-map__stage" style={MAP_STAGE_STYLE}>
                  <div className="uniplex-map__tiles" aria-hidden="true">
                    {visibleTiles.map((tile) => (
                      <img
                        className="uniplex-map__tile"
                        key={tile.key}
                        src={tile.src}
                        alt=""
                        draggable="false"
                        decoding="async"
                        style={{
                          left: tile.left,
                          top: tile.top,
                          width: tile.width,
                          height: tile.height,
                        }}
                      />
                    ))}
                  </div>
                  <canvas
                    ref={canvasRef}
                    className="uniplex-map__markers"
                    aria-label="Plot markers"
                    width={MAP_WIDTH}
                    height={MAP_HEIGHT}
                    onPointerDown={handlePointerDown}
                    onPointerUp={handlePointerUp}
                  />
                </div>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>

      <PlotDetailsModal plot={isDetailsOpen ? selectedPlot : null} onClose={closeDetails} />
    </section>
  );
}
