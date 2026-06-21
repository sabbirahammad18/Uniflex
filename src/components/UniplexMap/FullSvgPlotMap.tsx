import {
  useCallback,
  useDeferredValue,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ChangeEvent,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import { MdCenterFocusStrong, MdClose, MdManageSearch } from "react-icons/md";
import fullMapPaths from "../../data/full_map_plot_paths.json";
import "./FullSvgPlotMap.css";

type PlotStatus = "available" | "booked" | "sold" | "unknown";

type StatusConfig = {
  color: string;
  fill: string;
  label: string;
  border: string;
};

type Bounds = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
  cx: number;
  cy: number;
};

type FullMapPlotRecord = {
  id?: string;
  plot_uid?: string | null;
  svg_path_id?: string | null;
  plot_no?: string | number | null;
  size?: string | number | null;
  status?: string | null;
  category?: string | null;
  center: [number | string, number | string];
  bbox?: unknown;
  sector?: string | null;
  block?: string | null;
  road?: string | null;
  price?: string | number | null;
  sourcePathId?: string | null;
  layer: string;
  d: string;
  transform: string;
  bounds: Bounds;
};

type PathRecord = {
  plotId?: string;
  sourcePathId?: string;
  layer: string;
  d: string;
  transform: string;
  bounds: Bounds;
};

type FullMapPathDataset = {
  meta: {
    width: number;
    height: number;
    plotBounds: Pick<Bounds, "minX" | "minY" | "maxX" | "maxY">;
    sourcePlotPaths: number;
    matchedPlotPaths: number;
    fallbackPlotPaths: number;
    unassignedSourcePaths: number;
  };
  plots: FullMapPlotRecord[];
  unassignedPaths: PathRecord[];
};

type LivePlotStatus = {
  id?: string | number | null;
  plot_id?: string | number | null;
  plotId?: string | number | null;
  plot_uid?: string | null;
  plotUid?: string | null;
  svg_path_id?: string | null;
  svgPathId?: string | null;
  sourcePathId?: string | null;
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
  customer_name?: string | null;
  customer_phone?: string | null;
  customer_nid?: string | null;
  booking_date?: string | null;
};

type MapPlot = {
  uid: string;
  plotUid: string;
  sourceId: string;
  svgPathId: string;
  plotNo: string;
  size: string;
  category: string;
  status: PlotStatus;
  sector: string | null;
  block: string | null;
  road: string | null;
  price: string | number | null;
  customerName: string | null;
  customerPhone: string | null;
  customerNid: string | null;
  bookingDate: string | null;
  centerX: number;
  centerY: number;
  labelX: number;
  labelY: number;
  labelFontSize: number;
  sizeFontSize: number;
  pathD: string;
  pathTransform: string;
  sourceLayer: string;
  searchText: string;
  bounds: Bounds;
};

type PopoverPosition = {
  x: number;
  y: number;
};

type ViewportSize = {
  width: number;
  height: number;
};

type TransformState = {
  x: number;
  y: number;
  scale: number;
};

type DrawablePlot = MapPlot & {
  fillPath: Path2D;
};

type DrawableStructurePath = {
  sourcePathId: string;
  fillPath: Path2D;
};

type FullSvgPlotMapProps = {
  apiUrl?: string;
  className?: string;
  initialStatuses?: LivePlotStatus[];
};

const typedPathDataset = fullMapPaths as unknown as FullMapPathDataset;
const BASE_MAP_HREF = "/uniplex-customer-plan.svg";
const MAP_WIDTH = Number(typedPathDataset.meta.width) || 2880;
const MAP_HEIGHT = Number(typedPathDataset.meta.height) || 2160;
const MIN_SCALE = 0.08;
const MAX_SCALE = 24;
const ZOOM_FACTOR = 1.18;
const MAX_SEARCH_RESULTS = 80;

const STATUS_CONFIG: Record<PlotStatus, StatusConfig> = {
  available: { color: "#22c55e", fill: "rgba(34,197,94,0.20)", label: "Available", border: "#16a34a" },
  booked: { color: "#f97316", fill: "rgba(249,115,22,0.75)", label: "Booked", border: "#ea580c" },
  sold: { color: "#ef4444", fill: "rgba(239,68,68,0.80)", label: "Sold", border: "#dc2626" },
  unknown: { color: "#6b7280", fill: "rgba(107,114,128,0.45)", label: "Unknown", border: "#475569" },
};

const normalizeText = (value: unknown) => String(value ?? "").trim().toLowerCase();
const normalizeValue = (value: unknown) => String(value ?? "").trim();
const normalizeKey = (value: unknown) => normalizeValue(value).toLowerCase();
const formatOptional = (value: unknown) => normalizeValue(value) || "Not assigned";
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const normalizeStatus = (value: unknown): PlotStatus => {
  const s = normalizeText(value).replace(/[\s-]+/g, "_");
  if (s.includes("available")) return "available";
  if (s.includes("book")) return "booked";
  if (s.includes("sold")) return "sold";
  return "unknown";
};

const getLivePlotNo = (r: LivePlotStatus) => normalizeValue(r.plot_no ?? r.plotNo ?? r.plot_number ?? r.plotNumber);
const getLiveSvgPathId = (r: LivePlotStatus) => normalizeValue(r.svg_path_id ?? r.svgPathId ?? r.sourcePathId);
const getLivePlotUid = (r: LivePlotStatus) => normalizeValue(r.plot_uid ?? r.plotUid ?? r.plot_id ?? r.plotId ?? r.id);

const isCenter = (c: unknown): c is [number | string, number | string] =>
  Array.isArray(c) && Number.isFinite(Number(c[0])) && Number.isFinite(Number(c[1]));

const isBounds = (b: unknown): b is Bounds =>
  Boolean(b) &&
  typeof b === "object" &&
  Number.isFinite(Number((b as Bounds).cx)) &&
  Number.isFinite(Number((b as Bounds).cy)) &&
  Number.isFinite(Number((b as Bounds).width)) &&
  Number.isFinite(Number((b as Bounds).height));

const getFittedFontSize = (text: string, bounds: Bounds, maxSize: number, minSize: number) => {
  const len = Math.max(text.length, 1);
  const widthFit = bounds.width / (len * 0.72);
  const heightFit = bounds.height * 0.36;
  return clamp(Math.min(widthFit, heightFit, maxSize), minSize, maxSize);
};

const buildSearchText = (plot: Omit<MapPlot, "searchText" | "bounds">) =>
  [
    plot.plotNo,
    plot.size,
    plot.category,
    plot.status,
    STATUS_CONFIG[plot.status].label,
    plot.sector,
    plot.block,
    plot.road,
    plot.price,
    plot.customerName,
    plot.customerPhone,
    plot.sourceLayer,
  ]
    .map(normalizeText)
    .filter(Boolean)
    .join(" ");

const parseTransformMatrix = (transform: string): DOMMatrix => {
  const raw = normalizeValue(transform);
  const match = /^matrix\(([^)]+)\)$/i.exec(raw);
  if (!match) return new DOMMatrix();
  const parts = match[1]
    .split(/[,\s]+/)
    .map((part) => Number(part))
    .filter((part) => Number.isFinite(part));
  if (parts.length !== 6) return new DOMMatrix();
  return new DOMMatrix([parts[0], parts[1], parts[2], parts[3], parts[4], parts[5]]);
};

const createTransformedPath = (d: string, transform: string) => {
  const basePath = new Path2D(d);
  const transformedPath = new Path2D();
  transformedPath.addPath(basePath, parseTransformMatrix(transform));
  return transformedPath;
};

const getCenteredTransform = (width: number, height: number): TransformState => {
  const scale = clamp(Math.min(width / (MAP_WIDTH + 100), height / (MAP_HEIGHT + 100)), MIN_SCALE, 1.2);
  return {
    scale,
    x: (width - MAP_WIDTH * scale) / 2,
    y: (height - MAP_HEIGHT * scale) / 2,
  };
};

export default function FullSvgPlotMap({
  apiUrl,
  className = "",
  initialStatuses = [],
}: FullSvgPlotMapProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const pendingSyncFrameRef = useRef<number | null>(null);
  const baseImageRef = useRef<HTMLImageElement | null>(null);
  const transformRef = useRef<TransformState>({ x: 0, y: 0, scale: MIN_SCALE });
  const dragStateRef = useRef<{ startX: number; startY: number; originX: number; originY: number; moved: boolean } | null>(null);
  const hasCenteredInitialViewRef = useRef(false);

  const [apiStatuses, setApiStatuses] = useState<LivePlotStatus[] | null>(
    initialStatuses.length ? initialStatuses : null,
  );
  const [query, setQuery] = useState("");
  const [statusFilter] = useState<PlotStatus | "all">("all");
  const [categoryFilter] = useState("all");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [blockFilter, setBlockFilter] = useState("all");
  const [roadFilter, setRoadFilter] = useState("all");
  const [selectedPlotId, setSelectedPlotId] = useState<string | null>(null);
  const [popoverPosition, setPopoverPosition] = useState<PopoverPosition>({ x: 16, y: 88 });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [viewportSize, setViewportSize] = useState<ViewportSize>({ width: 0, height: 0 });
  const [isViewportReady, setIsViewportReady] = useState(false);
  const [baseImageReady, setBaseImageReady] = useState(false);
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    if (!apiUrl) return undefined;

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
        const list = Array.isArray(rows)
          ? rows
          : rows && typeof rows === "object" && Array.isArray((rows as { data?: unknown }).data)
            ? (rows as { data: unknown[] }).data
            : null;

        if (list) {
          setApiStatuses(list as LivePlotStatus[]);
        } else {
          setApiStatuses(null);
        }
      })
      .catch((error: Error) => {
        if (error.name !== "AbortError") {
          setApiStatuses(null);
        }
      });

    return () => controller.abort();
  }, [apiUrl]);

  const liveStatusLookup = useMemo(() => {
    const rows = apiStatuses ?? [];
    const bySvgPathId = new Map<string, LivePlotStatus>();
    const byPlotUid = new Map<string, LivePlotStatus>();
    const byPlotNo = new Map<string, LivePlotStatus>();

    rows.forEach((row) => {
      const svgPathId = getLiveSvgPathId(row);
      const plotUid = getLivePlotUid(row);
      const plotNo = getLivePlotNo(row);
      if (svgPathId) bySvgPathId.set(normalizeKey(svgPathId), row);
      if (plotUid) byPlotUid.set(normalizeKey(plotUid), row);
      if (plotNo) byPlotNo.set(normalizeKey(plotNo), row);
    });

    return { bySvgPathId, byPlotNo, byPlotUid };
  }, [apiStatuses]);

  const mapPlots = useMemo(() => {
    return (typedPathDataset.plots ?? [])
      .map((rawPlot, index): MapPlot | null => {
        if (!isCenter(rawPlot.center)) return null;

        const sourceId = rawPlot.id || `plot-${index + 1}`;
        const plotUid = normalizeValue(rawPlot.plot_uid) || sourceId;
        const svgPathId = normalizeValue(rawPlot.svg_path_id ?? rawPlot.sourcePathId) || sourceId;
        const plotNo = normalizeValue(rawPlot.plot_no);

        const liveStatus =
          liveStatusLookup.bySvgPathId.get(normalizeKey(svgPathId)) ??
          liveStatusLookup.bySvgPathId.get(normalizeKey(sourceId)) ??
          liveStatusLookup.byPlotUid.get(normalizeKey(plotUid)) ??
          liveStatusLookup.byPlotUid.get(normalizeKey(sourceId)) ??
          liveStatusLookup.byPlotNo.get(normalizeKey(plotNo));

        const centerX = Number(rawPlot.center[0]);
        const centerY = Number(rawPlot.center[1]);
        const bounds = isBounds(rawPlot.bounds)
          ? rawPlot.bounds
          : {
              minX: centerX - 5,
              minY: centerY - 4,
              maxX: centerX + 5,
              maxY: centerY + 4,
              width: 10,
              height: 8,
              cx: centerX,
              cy: centerY,
            };

        const size = normalizeValue(liveStatus?.size ?? rawPlot.size ?? rawPlot.category) || "Unknown";
        const category = normalizeValue(liveStatus?.category ?? rawPlot.category ?? size) || "Unknown";
        const extractedStatus = normalizeStatus(rawPlot.status);
        const status = liveStatus
          ? normalizeStatus(liveStatus.status)
          : extractedStatus === "unknown"
            ? "available"
            : extractedStatus;

        const basePlot = {
          uid: sourceId,
          plotUid,
          sourceId,
          svgPathId,
          plotNo,
          size,
          category,
          status,
          sector: liveStatus?.sector ?? rawPlot.sector ?? null,
          block: liveStatus?.block ?? rawPlot.block ?? null,
          road: liveStatus?.road ?? rawPlot.road ?? null,
          price: liveStatus?.price ?? rawPlot.price ?? null,
          customerName: liveStatus?.customer_name ?? null,
          customerPhone: liveStatus?.customer_phone ?? null,
          customerNid: liveStatus?.customer_nid ?? null,
          bookingDate: liveStatus?.booking_date ?? null,
          centerX,
          centerY,
          labelX: bounds.cx,
          labelY: bounds.cy,
          labelFontSize: getFittedFontSize(plotNo || sourceId, bounds, 4.8, 2.2),
          sizeFontSize: getFittedFontSize(size, bounds, 3.5, 1.8),
          pathD: rawPlot.d,
          pathTransform: rawPlot.transform,
          sourceLayer: rawPlot.layer,
          bounds,
        };

        return { ...basePlot, searchText: buildSearchText(basePlot) };
      })
      .filter((p): p is MapPlot => Boolean(p));
  }, [liveStatusLookup]);

  const drawablePlots = useMemo<DrawablePlot[]>(
    () => mapPlots.map((plot) => ({ ...plot, fillPath: createTransformedPath(plot.pathD, plot.pathTransform) })),
    [mapPlots],
  );

  const structurePaths = useMemo<DrawableStructurePath[]>(
    () =>
      (typedPathDataset.unassignedPaths ?? []).map((path) => ({
        sourcePathId: path.sourcePathId ?? path.plotId ?? `unassigned-${path.layer}`,
        fillPath: createTransformedPath(path.d, path.transform),
      })),
    [],
  );

  const plotById = useMemo(() => {
    const map = new Map<string, DrawablePlot>();
    drawablePlots.forEach((plot) => map.set(plot.uid, plot));
    return map;
  }, [drawablePlots]);

  const selectedPlot = selectedPlotId ? plotById.get(selectedPlotId) ?? null : null;

  const filteredPlots = useMemo(() => {
    const terms = normalizeText(deferredQuery).split(/\s+/).filter(Boolean);
    return drawablePlots.filter((plot) => {
      if (statusFilter !== "all" && plot.status !== statusFilter) return false;
      if (categoryFilter !== "all" && plot.category !== categoryFilter) return false;
      if (sectorFilter !== "all" && plot.sector !== sectorFilter) return false;
      if (blockFilter !== "all" && plot.block !== blockFilter) return false;
      if (roadFilter !== "all" && plot.road !== roadFilter) return false;
      return terms.length === 0 || terms.every((term) => plot.searchText.includes(term));
    });
  }, [blockFilter, categoryFilter, deferredQuery, drawablePlots, roadFilter, sectorFilter, statusFilter]);

  const visiblePlotIds = useMemo(() => new Set(filteredPlots.map((plot) => plot.uid)), [filteredPlots]);



  const updatePopoverPosition = useCallback(
    (plot: DrawablePlot | null) => {
      const viewport = viewportRef.current;
      if (!viewport || !plot) {
        setPopoverPosition({ x: 16, y: 88 });
        return;
      }

      const { x, y, scale } = transformRef.current;
      const screenX = x + plot.centerX * scale;
      const screenY = y + plot.centerY * scale;

      setPopoverPosition({
        x: clamp(screenX + 14, 12, Math.max(12, viewport.clientWidth - 292)),
        y: clamp(screenY - 18, 72, Math.max(72, viewport.clientHeight - 286)),
      });
    },
    [],
  );

  const scheduleDraw = useCallback(() => {
    if (frameRef.current !== null) return;
    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;

      const canvas = canvasRef.current;
      const viewport = viewportRef.current;
      if (!canvas || !viewport) return;

      const rect = viewport.getBoundingClientRect();
      const width = Math.max(0, Math.floor(rect.width));
      const height = Math.max(0, Math.floor(rect.height));
      if (width <= 0 || height <= 0) return;

      if (!hasCenteredInitialViewRef.current) {
        transformRef.current = getCenteredTransform(width, height);
        hasCenteredInitialViewRef.current = true;
      }

      const context = canvas.getContext("2d");
      if (!context) return;

      const dpr = window.devicePixelRatio || 1;
      if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
      }

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      context.fillStyle = "#f8fafc";
      context.fillRect(0, 0, width, height);

      const { x, y, scale } = transformRef.current;
      context.save();
      context.translate(x, y);
      context.scale(scale, scale);

      const baseImage = baseImageRef.current;
      if (baseImage && baseImageReady) {
        context.drawImage(baseImage, 0, 0, MAP_WIDTH, MAP_HEIGHT);
      } else {
        context.fillStyle = "#eef2f7";
        context.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);
      }

      context.strokeStyle = "#334155";
      context.lineCap = "round";
      context.lineJoin = "round";
      context.lineWidth = 0.5 / scale;
      context.globalAlpha = 0.08;
      structurePaths.forEach((path) => context.stroke(path.fillPath));
      context.globalAlpha = 1;

      drawablePlots.forEach((plot) => {
        const visible = visiblePlotIds.has(plot.uid);
        const config = STATUS_CONFIG[plot.status];
        const shouldTintPlot = plot.status !== "available";

        context.save();
        context.globalAlpha = visible ? 1 : 0.06;

        if (shouldTintPlot) {
          context.fillStyle = config.fill;
          context.strokeStyle = config.border;
          context.lineWidth = 0.58 / scale;
          context.fill(plot.fillPath);
          context.stroke(plot.fillPath);
        }

        if (selectedPlotId === plot.uid) {
          context.strokeStyle = "#ffffff";
          context.lineWidth = 2.2 / scale;
          context.stroke(plot.fillPath);
        }

        context.restore();
      });

      context.restore();
    });
  }, [baseImageReady, drawablePlots, selectedPlotId, structurePaths, visiblePlotIds]);

  useEffect(() => {
    const image = new Image();
    image.decoding = "async";
    image.src = BASE_MAP_HREF;
    image.onload = () => {
      baseImageRef.current = image;
      setBaseImageReady(true);
    };
    image.onerror = () => {
      baseImageRef.current = null;
      setBaseImageReady(false);
    };
  }, []);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return undefined;

    const syncViewport = () => {
      const rect = viewport.getBoundingClientRect();
      if (rect.width < 10 || rect.height < 10) {
        if (pendingSyncFrameRef.current !== null) {
          window.cancelAnimationFrame(pendingSyncFrameRef.current);
        }
        pendingSyncFrameRef.current = window.requestAnimationFrame(() => {
          pendingSyncFrameRef.current = null;
          syncViewport();
        });
        return;
      }

      const width = Math.max(320, Math.floor(rect.width));
      const height = Math.max(520, Math.floor(rect.height));
      setViewportSize((previous) => (previous.width === width && previous.height === height ? previous : { width, height }));
      setIsViewportReady(true);

      if (!hasCenteredInitialViewRef.current) {
        transformRef.current = getCenteredTransform(width, height);
        hasCenteredInitialViewRef.current = true;
      }

      scheduleDraw();
    };

    syncViewport();

    const resizeObserver = new ResizeObserver(() => syncViewport());
    resizeObserver.observe(viewport);
    window.addEventListener("resize", syncViewport);

    return () => {
      if (pendingSyncFrameRef.current !== null) {
        window.cancelAnimationFrame(pendingSyncFrameRef.current);
        pendingSyncFrameRef.current = null;
      }
      window.removeEventListener("resize", syncViewport);
      resizeObserver.disconnect();
    };
  }, [scheduleDraw]);

  useEffect(() => {
    if (!isViewportReady) return;
    scheduleDraw();
    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [isViewportReady, scheduleDraw, viewportSize, selectedPlotId, visiblePlotIds, baseImageReady]);

  useEffect(() => {
    updatePopoverPosition(selectedPlot);
  }, [selectedPlot, updatePopoverPosition, viewportSize]);

  const screenToWorld = useCallback((clientX: number, clientY: number) => {
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const screenX = clientX - rect.left;
    const screenY = clientY - rect.top;
    const { x, y, scale } = transformRef.current;
    return {
      screenX,
      screenY,
      worldX: (screenX - x) / scale,
      worldY: (screenY - y) / scale,
    };
  }, []);

  const getPlotAtWorldPoint = useCallback(
    (worldX: number, worldY: number) => {
      const context = canvasRef.current?.getContext("2d");
      if (!context) return null;

      for (let index = drawablePlots.length - 1; index >= 0; index -= 1) {
        const plot = drawablePlots[index];
        if (!visiblePlotIds.has(plot.uid)) continue;
        if (
          worldX < plot.bounds.minX ||
          worldX > plot.bounds.maxX ||
          worldY < plot.bounds.minY ||
          worldY > plot.bounds.maxY
        ) {
          continue;
        }
        if (context.isPointInPath(plot.fillPath, worldX, worldY)) {
          return plot;
        }
      }

      return null;
    },
    [drawablePlots, visiblePlotIds],
  );

  const zoomAtPoint = useCallback(
    (screenX: number, screenY: number, direction: 1 | -1) => {
      const { x, y, scale } = transformRef.current;
      const nextScale = clamp(direction > 0 ? scale * ZOOM_FACTOR : scale / ZOOM_FACTOR, MIN_SCALE, MAX_SCALE);
      const worldX = (screenX - x) / scale;
      const worldY = (screenY - y) / scale;
      transformRef.current = {
        scale: nextScale,
        x: screenX - worldX * nextScale,
        y: screenY - worldY * nextScale,
      };
      scheduleDraw();
      updatePopoverPosition(selectedPlot);
    },
    [scheduleDraw, selectedPlot, updatePopoverPosition],
  );

  const selectPlot = useCallback(
    (plot: DrawablePlot | null) => {
      setSelectedPlotId(plot?.uid ?? null);
      updatePopoverPosition(plot);
    },
    [updatePopoverPosition],
  );

  const zoomToPlot = useCallback(
    (plot: DrawablePlot) => {
      const viewport = viewportRef.current;
      if (!viewport) return;

      const targetScale = clamp(8, MIN_SCALE, MAX_SCALE);
      transformRef.current = {
        scale: targetScale,
        x: viewport.clientWidth / 2 - plot.centerX * targetScale,
        y: viewport.clientHeight * 0.46 - plot.centerY * targetScale,
      };
      setIsSearchOpen(false);
      setSelectedPlotId(plot.uid);
      updatePopoverPosition(plot);
      scheduleDraw();
    },
    [scheduleDraw, updatePopoverPosition],
  );

  const resetView = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    transformRef.current = getCenteredTransform(viewport.clientWidth, viewport.clientHeight);
    scheduleDraw();
    updatePopoverPosition(selectedPlot);
  }, [scheduleDraw, selectedPlot, updatePopoverPosition]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStateRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: transformRef.current.x,
      originY: transformRef.current.y,
      moved: false,
    };
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const dragState = dragStateRef.current;
    if (!dragState) return;

    const deltaX = event.clientX - dragState.startX;
    const deltaY = event.clientY - dragState.startY;
    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
      dragState.moved = true;
    }

    transformRef.current = {
      ...transformRef.current,
      x: dragState.originX + deltaX,
      y: dragState.originY + deltaY,
    };
    scheduleDraw();
    updatePopoverPosition(selectedPlot);
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const dragState = dragStateRef.current;
    dragStateRef.current = null;
    if (!dragState) return;

    if (dragState.moved) {
      updatePopoverPosition(selectedPlot);
      return;
    }

    const point = screenToWorld(event.clientX, event.clientY);
    if (!point) return;
    selectPlot(getPlotAtWorldPoint(point.worldX, point.worldY));
  };

  const handlePointerCancel = () => {
    dragStateRef.current = null;
  };

  const handleWheel = (event: ReactWheelEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    const screenX = event.clientX - rect.left;
    const screenY = event.clientY - rect.top;
    zoomAtPoint(screenX, screenY, event.deltaY < 0 ? 1 : -1);
  };

  return (
    <section className={`full-svg-map ${className}`} aria-label="Full interactive Uniflex plot map">
      <header className="full-svg-map__header">
        <div>
          <p>Uniflex Limited</p>
          <h1>Full plot map</h1>
        </div>
        <div className="full-svg-map__header-stats">
          <strong>{drawablePlots.length.toLocaleString("en-US")}</strong>
          <span>plot paths</span>
        </div>
      </header>

      <div className="full-svg-map__viewport" ref={viewportRef}>
        <button
          className={`full-svg-map__search-toggle${isSearchOpen ? " full-svg-map__search-toggle--active" : ""}`}
          type="button"
          aria-label={isSearchOpen ? "Close search" : "Open search"}
          onClick={() => setIsSearchOpen((value) => !value)}
        >
          {isSearchOpen ? <MdClose aria-hidden="true" /> : <MdManageSearch aria-hidden="true" />}
        </button>

        {isSearchOpen && (
          <aside className="full-svg-map__search-card" aria-label="Search and filter plots">
            <header>
              <div>
                <p>Search map</p>
                <h2>{filteredPlots.length.toLocaleString("en-US")} matches</h2>
              </div>
              <button type="button" aria-label="Close search" onClick={() => setIsSearchOpen(false)}>
                <MdClose aria-hidden="true" />
              </button>
            </header>

            <div className="full-svg-map__four-fields">
              <label className="full-svg-map__field-group">
                <span>Sector</span>
                <input
                  type="text"
                  value={sectorFilter === "all" ? "" : sectorFilter}
                  placeholder="e.g. 01"
                  autoComplete="off"
                  onChange={(event) => setSectorFilter(event.target.value || "all")}
                />
              </label>

              <label className="full-svg-map__field-group">
                <span>Block</span>
                <select value={blockFilter === "all" ? "" : blockFilter} onChange={(event) => setBlockFilter(event.target.value || "all")}>
                  <option value="">Select</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                </select>
              </label>

              <label className="full-svg-map__field-group">
                <span>Road</span>
                <input
                  type="text"
                  value={roadFilter === "all" ? "" : roadFilter}
                  placeholder="e.g. 07"
                  autoComplete="off"
                  onChange={(event) => setRoadFilter(event.target.value || "all")}
                />
              </label>

              <label className="full-svg-map__field-group">
                <span>Plot</span>
                <input
                  type="search"
                  value={query}
                  placeholder="e.g. 04/01"
                  autoComplete="off"
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
                />
              </label>
            </div>

            <ul className="full-svg-map__results [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {filteredPlots.slice(0, MAX_SEARCH_RESULTS).map((plot) => (
                <li key={`result-${plot.uid}`}>
                  <button type="button" onClick={() => zoomToPlot(plot)}>
                    <span
                      className="full-svg-map__result-status"
                      style={
                        {
                          "--status-color": STATUS_CONFIG[plot.status].color,
                          "--status-fill": STATUS_CONFIG[plot.status].fill,
                          "--status-border": STATUS_CONFIG[plot.status].border,
                        } as CSSProperties
                      }
                    />
                    <span>
                      <strong>Plot {plot.plotNo || plot.uid}</strong>
                      <small>
                        {[plot.size, plot.category, plot.sector, plot.block, plot.road, STATUS_CONFIG[plot.status].label]
                          .map(formatOptional)
                          .filter((value) => value !== "Not assigned")
                          .join(" · ")}
                      </small>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        )}

        <div className="full-svg-map__controls" aria-label="Map controls">
          <button type="button" aria-label="Zoom in" onClick={() => zoomAtPoint(viewportSize.width / 2, viewportSize.height / 2, 1)}>
            +
          </button>
          <button type="button" aria-label="Zoom out" onClick={() => zoomAtPoint(viewportSize.width / 2, viewportSize.height / 2, -1)}>
            -
          </button>
          <button type="button" aria-label="Reset view" onClick={resetView}>
            <MdCenterFocusStrong aria-hidden="true" />
          </button>
        </div>

        <canvas
          ref={canvasRef}
          className="full-svg-map__canvas"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onWheel={handleWheel}
        />



        {selectedPlot && (
          <aside
            className="full-svg-map__popover"
            aria-label="Selected plot details"
            style={{ left: popoverPosition.x, top: popoverPosition.y }}
          >
            <button type="button" aria-label="Close plot details" onClick={() => setSelectedPlotId(null)}>
              <MdClose aria-hidden="true" />
            </button>
            <p>Plot details</p>
            <h2>Plot {selectedPlot.plotNo || selectedPlot.uid}</h2>
            <span
              className="full-svg-map__popover-status"
              style={
                {
                  "--status-color": STATUS_CONFIG[selectedPlot.status].color,
                  "--status-fill": STATUS_CONFIG[selectedPlot.status].fill,
                  "--status-border": STATUS_CONFIG[selectedPlot.status].border,
                } as CSSProperties
              }
            >
              {STATUS_CONFIG[selectedPlot.status].label}
            </span>
            <dl>
              <div>
                <dt>Size</dt>
                <dd>{selectedPlot.size}</dd>
              </div>
              <div>
                <dt>Sector</dt>
                <dd>{formatOptional(selectedPlot.sector)}</dd>
              </div>
              <div>
                <dt>Block</dt>
                <dd>{formatOptional(selectedPlot.block)}</dd>
              </div>
              <div>
                <dt>Road</dt>
                <dd>{formatOptional(selectedPlot.road)}</dd>
              </div>
            </dl>
            {selectedPlot.customerName && (
              <div className="full-svg-map__customer">
                <strong>{selectedPlot.customerName}</strong>
                <span>{selectedPlot.customerPhone || "No phone"}</span>
                <span>{selectedPlot.bookingDate || "No booking date"}</span>
              </div>
            )}
          </aside>
        )}
      </div>
    </section>
  );
}
