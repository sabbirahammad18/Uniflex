
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ChangeEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { MdCenterFocusStrong, MdClose, MdManageSearch, MdSearch } from "react-icons/md";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import fullMapPaths from "../../data/full_map_plot_paths.json";
import "./FullSvgPlotMap.css";

// ─── Types ────────────────────────────────────────────────────────────────────

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
};

type PopoverPosition = {
  x: number;
  y: number;
};

type FullSvgPlotMapProps = {
  apiUrl?: string;
  className?: string;
  initialStatuses?: LivePlotStatus[];
};

// ─── Constants ────────────────────────────────────────────────────────────────

const typedPathDataset = fullMapPaths as unknown as FullMapPathDataset;
const BASE_MAP_HREF = "/uniplex-customer-plan.svg";

const STATUS_CONFIG: Record<PlotStatus, StatusConfig> = {
  available: { color: "#22c55e", fill: "rgba(34,197,94,0.20)",   label: "Available", border: "#16a34a" },
  booked:    { color: "#f97316", fill: "rgba(249,115,22,0.75)",  label: "Booked",    border: "#ea580c" },
  sold:      { color: "#ef4444", fill: "rgba(239,68,68,0.80)",   label: "Sold",      border: "#dc2626" },
  unknown:   { color: "#6b7280", fill: "rgba(107,114,128,0.45)",label: "Unknown",   border: "#475569" },
};

const STATUS_OPTIONS: Array<PlotStatus | "all"> = [
  "all", "available", "booked", "sold","unknown",
];

const MAX_SEARCH_RESULTS = 80;
const MAP_WIDTH  = Number(typedPathDataset.meta.width)  || 2880;
const MAP_HEIGHT = Number(typedPathDataset.meta.height) || 2160;

// ─── Pure helpers (outside component — never recreated) ───────────────────────

const normalizeText  = (value: unknown) => String(value ?? "").trim().toLowerCase();
const normalizeValue = (value: unknown) => String(value ?? "").trim();
const normalizeKey   = (value: unknown) => normalizeValue(value).toLowerCase();
const formatOptional = (value: unknown) => normalizeValue(value) || "Not assigned";
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const normalizeStatus = (value: unknown): PlotStatus => {
  const s = normalizeText(value).replace(/[\s-]+/g, "_");
  if (s.includes("available")) return "available";
  if (s.includes("book"))      return "booked";
  if (s.includes("sold"))      return "sold";
  return "unknown"
};

const getLivePlotNo    = (r: LivePlotStatus) => normalizeValue(r.plot_no    ?? r.plotNo    ?? r.plot_number ?? r.plotNumber);
const getLiveSvgPathId = (r: LivePlotStatus) => normalizeValue(r.svg_path_id ?? r.svgPathId ?? r.sourcePathId);
const getLivePlotUid   = (r: LivePlotStatus) => normalizeValue(r.plot_uid   ?? r.plotUid   ?? r.plot_id    ?? r.plotId ?? r.id);

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
  const len      = Math.max(text.length, 1);
  const widthFit = bounds.width  / (len * 0.72);
  const heightFit = bounds.height * 0.36;
  return clamp(Math.min(widthFit, heightFit, maxSize), minSize, maxSize);
};

const buildSearchText = (plot: Omit<MapPlot, "searchText">) =>
    [
      plot.plotNo, plot.size, plot.category, plot.status,
      STATUS_CONFIG[plot.status].label,
      plot.sector, plot.block, plot.road, plot.price,
      plot.customerName, plot.customerPhone, plot.sourceLayer,
    ]
        .map(normalizeText)
        .filter(Boolean)
        .join(" ");

const getOptionList = (plots: MapPlot[], key: "category" | "sector" | "block" | "road") => {
  const values = new Set<string>();
  plots.forEach((p) => { const v = normalizeValue(p[key]); if (v) values.add(v); });
  return Array.from(values).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
};

const money = new Intl.NumberFormat("en-BD", {
  style: "currency", currency: "BDT", maximumFractionDigits: 0,
});

// ─── Component ────────────────────────────────────────────────────────────────

export default function FullSvgPlotMap({
                                         // apiUrl = "/api/projects/1/plots",
                                         className = "",
                                         initialStatuses = [],
                                       }: FullSvgPlotMapProps) {

  // Refs
  const viewportRef      = useRef<HTMLDivElement | null>(null);
  const svgRef           = useRef<SVGSVGElement | null>(null);
  const selectedPathRef  = useRef<SVGPathElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transformRef     = useRef<any>(null);

  // State
  const [apiStatuses]   = useState<LivePlotStatus[] | null>(
      initialStatuses.length ? initialStatuses : null
  );
  const [query,          setQuery]          = useState("");
  const [statusFilter,   setStatusFilter]   = useState<PlotStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sectorFilter,   setSectorFilter]   = useState("all");
  const [blockFilter,    setBlockFilter]    = useState("all");
  const [roadFilter,     setRoadFilter]     = useState("all");
  const [selectedPlotId, setSelectedPlotId] = useState<string | null>(null);
  const [popoverPosition, setPopoverPosition] = useState<PopoverPosition>({ x: 16, y: 88 });
  const [isSearchOpen,   setIsSearchOpen]   = useState(false);

  const deferredQuery = useDeferredValue(query);

  // ── Fetch live statuses ─────────────────────────────────────────────────────
  // useEffect(() => {
  //   if (!apiUrl) return undefined;
  //   const controller = new AbortController();
  //   fetch(apiUrl, { headers: { Accept: "application/json" }, signal: controller.signal })
  //       .then((res) => {
  //         if (!res.ok) throw new Error(`Plot status request failed with ${res.status}`);
  //         return res.json();
  //       })
  //       .then((rows: unknown) => {
  //         const list = Array.isArray(rows)
  //             ? rows
  //             : rows && typeof rows === "object" && Array.isArray((rows as { data?: unknown }).data)
  //                 ? (rows as { data: unknown[] }).data
  //                 : null;
  //         if (list) setApiStatuses(list as LivePlotStatus[]);
  //       })
  //       .catch((err: Error) => { if (err.name !== "AbortError") setApiStatuses(null); });
  //   return () => controller.abort();
  // }, [apiUrl]);

  // ── Live status lookup maps ─────────────────────────────────────────────────
  const liveStatusLookup = useMemo(() => {
    const rows = apiStatuses ?? [];
    const bySvgPathId = new Map<string, LivePlotStatus>();
    const byPlotUid   = new Map<string, LivePlotStatus>();
    const byPlotNo    = new Map<string, LivePlotStatus>();
    rows.forEach((row) => {
      const svgPathId = getLiveSvgPathId(row);
      const plotUid   = getLivePlotUid(row);
      const plotNo    = getLivePlotNo(row);
      if (svgPathId) bySvgPathId.set(normalizeKey(svgPathId), row);
      if (plotUid)   byPlotUid.set(normalizeKey(plotUid), row);
      if (plotNo)    byPlotNo.set(normalizeKey(plotNo), row);
    });
    return { bySvgPathId, byPlotNo, byPlotUid };
  }, [apiStatuses]);

  // ── Build map plots ─────────────────────────────────────────────────────────
  const mapPlots = useMemo(() => {
    return (typedPathDataset.plots ?? [])
        .map((rawPlot, index): MapPlot | null => {
          if (!isCenter(rawPlot.center)) return null;

          const sourceId  = rawPlot.id || `plot-${index + 1}`;
          const plotUid   = normalizeValue(rawPlot.plot_uid) || sourceId;
          const svgPathId = normalizeValue(rawPlot.svg_path_id ?? rawPlot.sourcePathId) || sourceId;
          const plotNo    = normalizeValue(rawPlot.plot_no);

          const liveStatus =
              liveStatusLookup.bySvgPathId.get(normalizeKey(svgPathId)) ??
              liveStatusLookup.bySvgPathId.get(normalizeKey(sourceId))  ??
              liveStatusLookup.byPlotUid.get(normalizeKey(plotUid))     ??
              liveStatusLookup.byPlotUid.get(normalizeKey(sourceId))    ??
              liveStatusLookup.byPlotNo.get(normalizeKey(plotNo));

          const centerX = Number(rawPlot.center[0]);
          const centerY = Number(rawPlot.center[1]);
          const bounds  = isBounds(rawPlot.bounds)
              ? rawPlot.bounds
              : { minX: centerX - 5, minY: centerY - 4, maxX: centerX + 5, maxY: centerY + 4,
                width: 10, height: 8, cx: centerX, cy: centerY };

          const size     = normalizeValue(liveStatus?.size     ?? rawPlot.size     ?? rawPlot.category) || "Unknown";
          const category = normalizeValue(liveStatus?.category ?? rawPlot.category ?? size)             || "Unknown";
          const extractedStatus = normalizeStatus(rawPlot.status);
          const status = liveStatus
              ? normalizeStatus(liveStatus.status)
              : extractedStatus === "unknown" ? "available" : extractedStatus;

          const basePlot = {
            uid: sourceId, plotUid, sourceId, svgPathId, plotNo, size, category, status,
            sector:       liveStatus?.sector       ?? rawPlot.sector ?? null,
            block:        liveStatus?.block        ?? rawPlot.block  ?? null,
            road:         liveStatus?.road         ?? rawPlot.road   ?? null,
            price:        liveStatus?.price        ?? rawPlot.price  ?? null,
            customerName:  liveStatus?.customer_name  ?? null,
            customerPhone: liveStatus?.customer_phone ?? null,
            customerNid:   liveStatus?.customer_nid   ?? null,
            bookingDate:   liveStatus?.booking_date   ?? null,
            centerX, centerY,
            labelX: bounds.cx,
            labelY: bounds.cy,
            labelFontSize: getFittedFontSize(plotNo || sourceId, bounds, 4.8, 2.2),
            sizeFontSize:  getFittedFontSize(size, bounds, 3.5, 1.8),
            pathD:         rawPlot.d,
            pathTransform: rawPlot.transform,
            sourceLayer:   rawPlot.layer,
          };

          return { ...basePlot, searchText: buildSearchText(basePlot) };
        })
        .filter((p): p is MapPlot => Boolean(p));
  }, [liveStatusLookup]);

  const plotById = useMemo(() => {
    const map = new Map<string, MapPlot>();
    mapPlots.forEach((p) => map.set(p.uid, p));
    return map;
  }, [mapPlots]);

  const selectedPlot = selectedPlotId ? plotById.get(selectedPlotId) ?? null : null;

  // ── Filter options ──────────────────────────────────────────────────────────
  const categoryOptions = useMemo(() => getOptionList(mapPlots, "category"), [mapPlots]);
  const sectorOptions   = useMemo(() => getOptionList(mapPlots, "sector"),   [mapPlots]);
  const blockOptions    = useMemo(() => getOptionList(mapPlots, "block"),    [mapPlots]);
  const roadOptions     = useMemo(() => getOptionList(mapPlots, "road"),     [mapPlots]);

  const filteredPlots = useMemo(() => {
    const terms = normalizeText(deferredQuery).split(/\s+/).filter(Boolean);
    return mapPlots.filter((p) => {
      if (statusFilter   !== "all" && p.status   !== statusFilter)   return false;
      if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
      if (sectorFilter   !== "all" && p.sector   !== sectorFilter)   return false;
      if (blockFilter    !== "all" && p.block    !== blockFilter)     return false;
      if (roadFilter     !== "all" && p.road     !== roadFilter)      return false;
      return terms.length === 0 || terms.every((t) => p.searchText.includes(t));
    });
  }, [blockFilter, categoryFilter, deferredQuery, mapPlots, roadFilter, sectorFilter, statusFilter]);

  const visiblePlotIds = useMemo(() => new Set(filteredPlots.map((p) => p.uid)), [filteredPlots]);

  const statusCounts = useMemo(
      () => mapPlots.reduce<Record<PlotStatus, number>>(
          (acc, p) => { acc[p.status] += 1; return acc; },
          { available: 0, booked: 0, sold: 0, unknown: 0 },
      ),
      [mapPlots],
  );

  // ── Highlight selected path via class (no re-render) ───────────────────────
  useEffect(() => {
    selectedPathRef.current?.classList.remove("is-selected");
    selectedPathRef.current = null;
    if (!selectedPlotId) return;
    const el = svgRef.current?.querySelector(`[data-uid="${selectedPlotId}"]`) as SVGPathElement | null;
    if (el) { el.classList.add("is-selected"); selectedPathRef.current = el; }
  }, [selectedPlotId]);

  // ── selectPlot — reads real DOM position (works with CSS transform) ─────────
  const selectPlot = useCallback((plot: MapPlot) => {
    setSelectedPlotId(plot.uid);
    const el        = document.getElementById(`full-svg-map-plot-${plot.uid}`);
    const container = viewportRef.current;
    if (el && container) {
      const elRect        = el.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setPopoverPosition({
        x: clamp(elRect.left - containerRect.left + elRect.width  / 2 + 14, 12, Math.max(12, containerRect.width  - 292)),
        y: clamp(elRect.top  - containerRect.top  - 18,                     72, Math.max(72, containerRect.height - 286)),
      });
    } else {
      setPopoverPosition({ x: 16, y: 88 });
    }
  }, []);

  // ── zoomToPlot — uses react-zoom-pan-pinch built-in ────────────────────────
  const zoomToPlot = useCallback((plot: MapPlot) => {
    const el = document.getElementById(`full-svg-map-plot-${plot.uid}`) as HTMLElement | null;
    if (el) transformRef.current?.zoomToElement(el, 8, 300, "easeOut");
    setIsSearchOpen(false);
    // Wait for the zoom animation to finish before reading DOM position
    setTimeout(() => selectPlot(plot), 320);
  }, [selectPlot]);

  // ── SVG click handler ───────────────────────────────────────────────────────
  const handleSvgClick = useCallback((event: ReactMouseEvent<SVGSVGElement>) => {
    const target = (event.target as Element | null)
        ?.closest(".full-svg-map__plot[data-uid]") as SVGPathElement | null;

    if (!target) { setSelectedPlotId(null); return; }

    const plot = plotById.get(target.dataset.uid || "");
    if (plot) selectPlot(plot);
  }, [plotById, selectPlot]);

  // ── Memoised SVG elements (only re-render when data changes) ───────────────
  const plotPathElements = useMemo(
      () => mapPlots.map((plot) => {
        const visible = visiblePlotIds.has(plot.uid);
        const config  = STATUS_CONFIG[plot.status];
        return (
            <path
                key={plot.uid}
                id={`full-svg-map-plot-${plot.uid}`}
                className={`full-svg-map__plot full-svg-map__plot--${plot.status}${visible ? "" : " is-filtered-out"}`}
                d={plot.pathD}
                transform={plot.pathTransform || undefined}
                vectorEffect="non-scaling-stroke"
                data-uid={plot.uid}
                data-plot={plot.plotNo}
                data-plot-uid={plot.plotUid}
                data-svg-path-id={plot.svgPathId}
                data-status={plot.status}
                data-size={plot.size}
                data-category={plot.category}
                data-sector={plot.sector ?? ""}
                data-block={plot.block ?? ""}
                data-road={plot.road ?? ""}
                data-fill={config.fill}
                data-border={config.border}
                style={{ "--plot-fill": config.fill, "--plot-border": config.border } as CSSProperties}
            />
        );
      }),
      [mapPlots, visiblePlotIds],
  );

  const labelElements = useMemo(
      () => mapPlots.map((plot) => {
        const visible    = visiblePlotIds.has(plot.uid);
        const sizeOffset = Math.max(3.2, plot.labelFontSize * 0.92);
        return (
            <g key={`label-${plot.uid}`}
               className={`full-svg-map__label-group${visible ? "" : " is-filtered-out"}`}>
              <text className="full-svg-map__plot-label"
                    fontSize={plot.labelFontSize} x={plot.labelX} y={plot.labelY - sizeOffset * 0.15}>
                {plot.plotNo}
              </text>
              <text className="full-svg-map__plot-size"
                    fontSize={plot.sizeFontSize} x={plot.labelX} y={plot.labelY + sizeOffset}>
                {plot.size}
              </text>
            </g>
        );
      }),
      [mapPlots, visiblePlotIds],
  );

  const unassignedPathElements = useMemo(
      () => typedPathDataset.unassignedPaths.map((p) => (
          <path key={p.sourcePathId} className="full-svg-map__structure-path"
                d={p.d} transform={p.transform || undefined} vectorEffect="non-scaling-stroke" />
      )),
      [],
  );

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
      <section className={`full-svg-map ${className}`} aria-label="Full interactive Uniflex plot map">

        <header className="full-svg-map__header">
          <div>
            <p>Uniflex Limited</p>
            <h1>Full plot map</h1>
          </div>
          <div className="full-svg-map__header-stats">
            <strong>{mapPlots.length.toLocaleString("en-US")}</strong>
            <span>plot paths</span>
          </div>
        </header>

        {/* react-zoom-pan-pinch owns ALL pan/zoom — GPU-accelerated CSS transform,
          zero JS on every frame, no viewBox manipulation needed */}
        <TransformWrapper
            ref={transformRef}
            initialScale={1}
            minScale={0.08}
            maxScale={24}
            centerOnInit
            smooth
            wheel={{ step: 0.002 }}
            pinch={{ step: 5 }}
            doubleClick={{ disabled: true }}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
              <div className="full-svg-map__viewport" ref={viewportRef}>

                {/* Search toggle */}
                <button
                    className={`full-svg-map__search-toggle${isSearchOpen ? " full-svg-map__search-toggle--active" : ""}`}
                    type="button"
                    aria-label={isSearchOpen ? "Close search" : "Open search"}
                    onClick={() => setIsSearchOpen((v) => !v)}
                >
                  {isSearchOpen ? <MdClose aria-hidden="true" /> : <MdManageSearch aria-hidden="true" />}
                </button>

                {/* Search & filter panel */}
                {/* Search & filter panel */}
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

                      {/* Four-field search form */}
                      <div className="full-svg-map__four-fields">
                        <label className="full-svg-map__field-group">
                          <span>Sector</span>
                          <input
                              type="text"
                              value={sectorFilter === "all" ? "" : sectorFilter}
                              placeholder="e.g. 01"
                              autoComplete="off"
                              onChange={(e) => setSectorFilter(e.target.value || "all")}
                          />
                        </label>

                        <label className="full-svg-map__field-group">
                          <span>Block</span>
                          <select
                              value={blockFilter === "all" ? "" : blockFilter}
                              onChange={(e) => setBlockFilter(e.target.value || "all")}
                          >
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
                              onChange={(e) => setRoadFilter(e.target.value || "all")}
                          />
                        </label>

                        <label className="full-svg-map__field-group">
                          <span>Plot</span>
                          <input
                              type="search"
                              value={query}
                              placeholder="e.g. 04/01"
                              autoComplete="off"
                              onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                          />
                        </label>
                      </div>


                      <ul className="full-svg-map__results">
                        {filteredPlots.slice(0, MAX_SEARCH_RESULTS).map((plot) => (
                            <li key={`result-${plot.uid}`}>
                              <button type="button" onClick={() => zoomToPlot(plot)}>
                <span
                    className="full-svg-map__result-status"
                    style={{
                      "--status-color":  STATUS_CONFIG[plot.status].color,
                      "--status-fill":   STATUS_CONFIG[plot.status].fill,
                      "--status-border": STATUS_CONFIG[plot.status].border,
                    } as CSSProperties}
                />
                                <span>
                  <strong>Plot {plot.plotNo || plot.uid}</strong>
                  <small>
                    {[plot.size, plot.category, plot.sector, plot.block, plot.road, STATUS_CONFIG[plot.status].label]
                        .map(formatOptional)
                        .filter((v) => v !== "Not assigned")
                        .join(" · ")}
                  </small>
                </span>
                              </button>
                            </li>
                        ))}
                      </ul>
                    </aside>
                )}

                {/* Zoom controls */}
                <div className="full-svg-map__controls" aria-label="Map controls">
                  <button type="button" aria-label="Zoom in"    onClick={() => zoomIn()}>+</button>
                  <button type="button" aria-label="Zoom out"   onClick={() => zoomOut()}>-</button>
                  <button type="button" aria-label="Reset view" onClick={() => resetTransform()}>
                    <MdCenterFocusStrong aria-hidden="true" />
                  </button>
                </div>

                {/* The map — TransformComponent applies GPU CSS transform to this subtree only */}
                <TransformComponent
                    wrapperStyle={{ width: "100%", height: "100%" }}
                    contentStyle={{ width: MAP_WIDTH, height: MAP_HEIGHT }}
                >
                  <svg
                      ref={svgRef}
                      className="full-svg-map__svg"
                      viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
                      width={MAP_WIDTH}
                      height={MAP_HEIGHT}
                      style={{ display: "block" }}
                      onClick={handleSvgClick}
                  >
                    {/* Base raster map — single image, zero DOM overhead */}
                    <image
                        className="full-svg-map__base"
                        href={BASE_MAP_HREF}
                        x="0" y="0"
                        width={MAP_WIDTH}
                        height={MAP_HEIGHT}
                        preserveAspectRatio="none"
                    />
                    {/* Unassigned structural paths */}
                    <g className="full-svg-map__structure" aria-hidden="true">
                      {unassignedPathElements}
                    </g>
                    {/* Coloured plot overlays */}
                    <g className="full-svg-map__plots">
                      {plotPathElements}
                    </g>
                    {/* Plot number / size labels (CSS-controlled visibility) */}
                    <g className="full-svg-map__labels" aria-hidden="true">
                      {labelElements}
                    </g>
                  </svg>
                </TransformComponent>

                {/* Status legend */}
                <aside className="full-svg-map__legend" aria-label="Plot status legend">
                  <p>Plot status</p>
                  {STATUS_OPTIONS
                      .filter((s): s is PlotStatus => s !== "all")
                      .map((s) => (
                          <button
                              key={`legend-${s}`}
                              type="button"
                              className={statusFilter === s ? "is-active" : ""}
                              onClick={() => setStatusFilter(statusFilter === s ? "all" : s)}
                              style={{
                                "--status-color":  STATUS_CONFIG[s].color,
                                "--status-fill":   STATUS_CONFIG[s].fill,
                                "--status-border": STATUS_CONFIG[s].border,
                              } as CSSProperties}
                          >
                            <span />
                            <em>{STATUS_CONFIG[s].label}</em>
                            <b>{statusCounts[s].toLocaleString("en-US")}</b>
                          </button>
                      ))}
                </aside>

                {/* Plot detail popover */}
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
                          style={{
                            "--status-color":  STATUS_CONFIG[selectedPlot.status].color,
                            "--status-fill":   STATUS_CONFIG[selectedPlot.status].fill,
                            "--status-border": STATUS_CONFIG[selectedPlot.status].border,
                          } as CSSProperties}
                      >
                  {STATUS_CONFIG[selectedPlot.status].label}
                </span>
                      <dl>
                        <div><dt>Size</dt>     <dd>{selectedPlot.size}</dd></div>
                        <div><dt>Category</dt> <dd>{selectedPlot.category}</dd></div>
                        <div><dt>Sector</dt>   <dd>{formatOptional(selectedPlot.sector)}</dd></div>
                        <div><dt>Block</dt>    <dd>{formatOptional(selectedPlot.block)}</dd></div>
                        <div className="full-svg-map__popover-wide">
                          <dt>Road</dt>
                          <dd>{formatOptional(selectedPlot.road)}</dd>
                        </div>
                        <div>
                          <dt>Price</dt>
                          <dd>{selectedPlot.price ? money.format(Number(selectedPlot.price)) : "Not available"}</dd>
                        </div>
                        <div><dt>Source layer</dt> <dd>{selectedPlot.sourceLayer}</dd></div>
                        <div><dt>SVG path</dt>     <dd>{selectedPlot.svgPathId}</dd></div>
                        <div className="full-svg-map__popover-wide">
                          <dt>Plot UID</dt>
                          <dd>{selectedPlot.plotUid}</dd>
                        </div>
                      </dl>
                      {selectedPlot.customerName && (
                          <div className="full-svg-map__customer">
                            <strong>{selectedPlot.customerName}</strong>
                            <span>{selectedPlot.customerPhone || "No phone"}</span>
                            <span>{selectedPlot.bookingDate   || "No booking date"}</span>
                          </div>
                      )}
                    </aside>
                )}

              </div>
          )}
        </TransformWrapper>

      </section>
  );
}