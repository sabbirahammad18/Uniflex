import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import "./SvgMiniMap.css";

type PlotStatus = "available" | "booked" | "hold" | "sold" | "unknown";

type SvgPlot = {
  id: string;
  sector: string;
  block: string;
  road: string;
  plot: string;
  size: string;
  status: PlotStatus;
  price?: number;
  d: string;
  labelX: number;
  labelY: number;
  zoomX: number;
  zoomY: number;
};

type PlotGroup = {
  sector: string;
  blocks: Array<{
    id: string;
    plots: SvgPlot[];
  }>;
};

type ViewBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type PanState = {
  pointerId: number;
  startClientX: number;
  startClientY: number;
  startViewBox: ViewBox;
  moved: boolean;
};

const VIEWBOX_WIDTH = 960;
const VIEWBOX_HEIGHT = 680;
const MIN_VIEWBOX_WIDTH = 170;
const STATUS_OPTIONS: Array<PlotStatus | "all"> = ["all", "available", "booked", "hold", "sold", "unknown"];

const statusLabel: Record<PlotStatus, string> = {
  available: "Available",
  booked: "Booked",
  hold: "Hold",
  sold: "Sold",
  unknown: "Unknown",
};

const money = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 0,
});

const rectPath = (x: number, y: number, width: number, height: number) =>
  `M${x} ${y}L${x + width} ${y}L${x + width} ${y + height}L${x} ${y + height}Z`;

const angledPath = (x: number, y: number, width: number, height: number, skew: number) =>
  `M${x + skew} ${y}L${x + width + skew} ${y}L${x + width - skew} ${y + height}L${x - skew} ${y + height}Z`;

const makePlot = (
  sector: string,
  block: string,
  road: string,
  plot: string,
  size: string,
  status: PlotStatus,
  d: string,
  labelX: number,
  labelY: number,
  price?: number,
): SvgPlot => ({
  id: `plot-${sector}-${block}-${road.replace(/\s+/g, "")}-${plot}`,
  sector,
  block,
  road,
  plot,
  size,
  status,
  price,
  d,
  labelX,
  labelY,
  zoomX: labelX,
  zoomY: labelY,
});

const plotGroups: PlotGroup[] = [
  {
    sector: "A",
    blocks: [
      {
        id: "A1",
        plots: [
          makePlot("A", "A1", "Road-1", "001", "5K", "available", rectPath(86, 112, 74, 58), 123, 142, 500000),
          makePlot("A", "A1", "Road-1", "002", "5K", "booked", rectPath(160, 112, 74, 58), 197, 142, 520000),
          makePlot("A", "A1", "Road-1", "003", "5K", "available", rectPath(234, 112, 74, 58), 271, 142, 500000),
          makePlot("A", "A1", "Road-2", "004", "7.5K", "hold", rectPath(86, 218, 74, 66), 123, 253, 720000),
          makePlot("A", "A1", "Road-2", "005", "7.5K", "sold", rectPath(160, 218, 74, 66), 197, 253, 760000),
          makePlot("A", "A1", "Road-2", "006", "7.5K", "available", rectPath(234, 218, 74, 66), 271, 253, 745000),
        ],
      },
      {
        id: "A2",
        plots: [
          makePlot("A", "A2", "Road-3", "007", "10K", "available", angledPath(394, 98, 86, 68, 14), 437, 132, 980000),
          makePlot("A", "A2", "Road-3", "008", "10K", "unknown", angledPath(480, 98, 86, 68, 14), 523, 132),
          makePlot("A", "A2", "Road-4", "009", "10K", "booked", angledPath(374, 220, 86, 68, 14), 417, 254, 1030000),
          makePlot("A", "A2", "Road-4", "010", "10K", "available", angledPath(460, 220, 86, 68, 14), 503, 254, 1010000),
        ],
      },
    ],
  },
  {
    sector: "B",
    blocks: [
      {
        id: "B1",
        plots: [
          makePlot("B", "B1", "Road-5", "011", "8K", "hold", rectPath(650, 122, 72, 56), 686, 151, 835000),
          makePlot("B", "B1", "Road-5", "012", "8K", "available", rectPath(722, 122, 72, 56), 758, 151, 830000),
          makePlot("B", "B1", "Road-6", "013", "8K", "sold", rectPath(650, 226, 72, 56), 686, 255, 850000),
          makePlot("B", "B1", "Road-6", "014", "8K", "booked", rectPath(722, 226, 72, 56), 758, 255, 850000),
        ],
      },
      {
        id: "B2",
        plots: [
          makePlot("B", "B2", "Avenue-1", "015", "12K", "available", angledPath(592, 430, 92, 72, -12), 638, 466, 1280000),
          makePlot("B", "B2", "Avenue-1", "016", "12K", "hold", angledPath(684, 430, 92, 72, -12), 730, 466, 1290000),
          makePlot("B", "B2", "Avenue-2", "017", "12K", "sold", angledPath(612, 536, 92, 72, -12), 658, 572, 1310000),
          makePlot("B", "B2", "Avenue-2", "018", "12K", "available", angledPath(704, 536, 92, 72, -12), 750, 572, 1300000),
        ],
      },
    ],
  },
];

const allPlots = plotGroups.flatMap((sector) => sector.blocks.flatMap((block) => block.plots));

const normalize = (value: unknown) => String(value ?? "").trim().toLowerCase();

const searchText = (plot: SvgPlot) =>
  [plot.sector, plot.block, plot.road, plot.plot, plot.size, plot.status, plot.price].map(normalize).join(" ");

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export default function SvgMiniMap() {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const panStateRef = useRef<PanState | null>(null);
  const lastPointerMoveWasPanRef = useRef(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PlotStatus | "all">("all");
  const [selectedPlotId, setSelectedPlotId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [viewBox, setViewBox] = useState<ViewBox>({
    x: 0,
    y: 0,
    width: VIEWBOX_WIDTH,
    height: VIEWBOX_HEIGHT,
  });
  const hasSizedViewportRef = useRef(false);
  const deferredQuery = useDeferredValue(query);
  const viewportAspect = viewportSize.width && viewportSize.height ? viewportSize.width / viewportSize.height : VIEWBOX_WIDTH / VIEWBOX_HEIGHT;

  const selectedPlot = allPlots.find((plot) => plot.id === selectedPlotId) ?? null;

  const normalizeViewBox = useCallback(
    (box: Pick<ViewBox, "x" | "width"> & Partial<Pick<ViewBox, "y" | "height">>): ViewBox => {
      const width = clamp(box.width, MIN_VIEWBOX_WIDTH, VIEWBOX_WIDTH);
      const height = width / viewportAspect;
      const maxX = VIEWBOX_WIDTH - width;
      const maxY = VIEWBOX_HEIGHT - height;

      return {
        x: maxX < 0 ? maxX / 2 : clamp(box.x, 0, maxX),
        y: maxY < 0 ? maxY / 2 : clamp(box.y ?? 0, 0, maxY),
        width,
        height,
      };
    },
    [viewportAspect],
  );

  const getFitViewBox = useCallback(
    (aspect = viewportAspect): ViewBox => {
      const height = VIEWBOX_WIDTH / aspect;
      const maxY = VIEWBOX_HEIGHT - height;

      return {
        x: 0,
        y: maxY < 0 ? maxY / 2 : clamp(0, 0, maxY),
        width: VIEWBOX_WIDTH,
        height,
      };
    },
    [viewportAspect],
  );

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return undefined;
    }

    const observer = new ResizeObserver(([entry]) => {
      const nextSize = {
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      };

      setViewportSize({
        width: nextSize.width,
        height: nextSize.height,
      });

      if (!hasSizedViewportRef.current && nextSize.width > 0 && nextSize.height > 0) {
        hasSizedViewportRef.current = true;
        setViewBox(getFitViewBox(nextSize.width / nextSize.height));
      }
    });

    observer.observe(viewport);
    return () => observer.disconnect();
  }, [getFitViewBox]);

  const filteredPlots = useMemo(() => {
    const terms = normalize(deferredQuery).split(/\s+/).filter(Boolean);

    return allPlots.filter((plot) => {
      if (statusFilter !== "all" && plot.status !== statusFilter) {
        return false;
      }

      if (!terms.length) {
        return true;
      }

      const content = searchText(plot);
      return terms.every((term) => content.includes(term));
    });
  }, [deferredQuery, statusFilter]);

  const statusCounts = useMemo(
    () =>
      allPlots.reduce<Record<PlotStatus, number>>(
        (counts, plot) => {
          counts[plot.status] += 1;
          return counts;
        },
        { available: 0, booked: 0, hold: 0, sold: 0, unknown: 0 },
      ),
    [],
  );

  const zoomToPlot = useCallback((plot: SvgPlot) => {
    const targetWidth = clamp(300, MIN_VIEWBOX_WIDTH, VIEWBOX_WIDTH);
    const targetHeight = targetWidth / viewportAspect;

    setSelectedPlotId(plot.id);
    setIsSearchOpen(false);
    setViewBox(
      normalizeViewBox({
        x: plot.zoomX - targetWidth / 2,
        y: plot.zoomY - targetHeight * 0.46,
        width: targetWidth,
      }),
    );
  }, [normalizeViewBox, viewportAspect]);

  const zoomAtPoint = useCallback(
    (clientX: number, clientY: number, zoomFactor: number) => {
      const svg = svgRef.current;
      const rect = svg?.getBoundingClientRect();
      if (!rect) {
        return;
      }

      const pointerRatioX = (clientX - rect.left) / rect.width;
      const pointerRatioY = (clientY - rect.top) / rect.height;
      const svgX = viewBox.x + pointerRatioX * viewBox.width;
      const svgY = viewBox.y + pointerRatioY * viewBox.height;
      const nextWidth = clamp(viewBox.width / zoomFactor, MIN_VIEWBOX_WIDTH, VIEWBOX_WIDTH);
      const nextHeight = nextWidth / viewportAspect;

      setViewBox(
        normalizeViewBox({
          x: svgX - pointerRatioX * nextWidth,
          y: svgY - pointerRatioY * nextHeight,
          width: nextWidth,
        }),
      );
    },
    [normalizeViewBox, viewBox, viewportAspect],
  );

  const zoomAtCenter = useCallback(
    (zoomFactor: number) => {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) {
        return;
      }

      zoomAtPoint(rect.left + rect.width / 2, rect.top + rect.height / 2, zoomFactor);
    },
    [zoomAtPoint],
  );

  const handleWheel = useCallback(
    (event: ReactWheelEvent<SVGSVGElement>) => {
      if ((event.target as HTMLElement | null)?.closest(".svg-mini-map__search-card, .svg-mini-map__details")) {
        return;
      }

      event.preventDefault();
      const wheelDelta = clamp(event.deltaY, -90, 90);
      const zoomFactor = Math.exp(-wheelDelta * 0.0012);
      zoomAtPoint(event.clientX, event.clientY, zoomFactor);
    },
    [zoomAtPoint],
  );

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<SVGSVGElement>) => {
      if ((event.target as HTMLElement | null)?.closest("button, input, select, .svg-mini-map__search-card, .svg-mini-map__details")) {
        return;
      }

      event.currentTarget.setPointerCapture(event.pointerId);
      panStateRef.current = {
        pointerId: event.pointerId,
        startClientX: event.clientX,
        startClientY: event.clientY,
        startViewBox: viewBox,
        moved: false,
      };
      lastPointerMoveWasPanRef.current = false;
    },
    [viewBox],
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<SVGSVGElement>) => {
      const panState = panStateRef.current;
      const svg = svgRef.current;
      const rect = svg?.getBoundingClientRect();

      if (!panState || !rect || panState.pointerId !== event.pointerId) {
        return;
      }

      const deltaX = event.clientX - panState.startClientX;
      const deltaY = event.clientY - panState.startClientY;

      if (Math.hypot(deltaX, deltaY) > 4) {
        panState.moved = true;
        lastPointerMoveWasPanRef.current = true;
      }

      setViewBox(
        normalizeViewBox({
          x: panState.startViewBox.x - (deltaX / rect.width) * panState.startViewBox.width,
          y: panState.startViewBox.y - (deltaY / rect.height) * panState.startViewBox.height,
          width: panState.startViewBox.width,
        }),
      );
    },
    [normalizeViewBox],
  );

  const handlePointerUp = useCallback((event: ReactPointerEvent<SVGSVGElement>) => {
    const panState = panStateRef.current;
    if (panState?.pointerId === event.pointerId) {
      lastPointerMoveWasPanRef.current = panState.moved;
      panStateRef.current = null;
      window.setTimeout(() => {
        lastPointerMoveWasPanRef.current = false;
      }, 0);
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(event.target.value as PlotStatus | "all");
  };

  return (
    <section className="svg-mini-map" aria-label="SVG mini plot map example">
      <div className="svg-mini-map__viewport" ref={viewportRef}>
        <button
          className={`svg-mini-map__search-toggle${isSearchOpen ? " svg-mini-map__search-toggle--active" : ""}`}
          type="button"
          aria-label={isSearchOpen ? "Close search" : "Open search"}
          onClick={() => setIsSearchOpen((value) => !value)}
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            {isSearchOpen ? "close" : "manage_search"}
          </span>
        </button>

        {isSearchOpen ? (
          <aside className="svg-mini-map__search-card" aria-label="Search plots">
            <header>
              <div>
                <p>SVG plot search</p>
                <h2>{filteredPlots.length} matches</h2>
              </div>
              <button type="button" aria-label="Close search" onClick={() => setIsSearchOpen(false)}>
                <span className="material-symbols-outlined" aria-hidden="true">
                  close
                </span>
              </button>
            </header>

            <label className="svg-mini-map__field">
              <span className="material-symbols-outlined" aria-hidden="true">
                search
              </span>
              <input
                type="search"
                value={query}
                placeholder="Plot, size, sector, road"
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>

            <div className="svg-mini-map__filters">
              <label>
                <span>Status</span>
                <select value={statusFilter} onChange={handleStatusChange}>
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status === "all" ? "All statuses" : statusLabel[status]}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="svg-mini-map__chips">
              {STATUS_OPTIONS.filter((status): status is PlotStatus => status !== "all").map((status) => (
                <button
                  className={statusFilter === status ? "is-active" : ""}
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(statusFilter === status ? "all" : status)}
                >
                  <span className={`svg-mini-map__dot svg-mini-map__dot--${status}`} />
                  {statusLabel[status]}
                  <b>{statusCounts[status]}</b>
                </button>
              ))}
            </div>

            <ul className="svg-mini-map__results">
              {filteredPlots.slice(0, 40).map((plot) => (
                <li key={plot.id}>
                  <button type="button" onClick={() => zoomToPlot(plot)}>
                    <span className={`svg-mini-map__dot svg-mini-map__dot--${plot.status}`} />
                    <span>
                      <strong>
                        {plot.sector}-{plot.block}-{plot.plot}
                      </strong>
                      <small>
                        {plot.road} . {plot.size} . {statusLabel[plot.status]}
                      </small>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        ) : null}

        <div className="svg-mini-map__controls" aria-label="Map controls">
          <button type="button" aria-label="Zoom in" onClick={() => zoomAtCenter(1.35)}>
            +
          </button>
          <button type="button" aria-label="Zoom out" onClick={() => zoomAtCenter(1 / 1.35)}>
            -
          </button>
          <button
            type="button"
            aria-label="Center map"
            onClick={() => {
              setSelectedPlotId(null);
              setViewBox(getFitViewBox());
            }}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              center_focus_strong
            </span>
          </button>
        </div>

        <svg
          ref={svgRef}
          className="svg-mini-map__svg"
          viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Mini SVG real estate plot map"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
        >
                  <defs>
                    <pattern id="mini-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                      <path d="M24 0H0V24" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                    </pattern>
                  </defs>

                  <rect width={VIEWBOX_WIDTH} height={VIEWBOX_HEIGHT} fill="#f8fafc" />
                  <rect width={VIEWBOX_WIDTH} height={VIEWBOX_HEIGHT} fill="url(#mini-grid)" opacity="0.55" />

                  <g id="site-features">
                    <path
                      id="lake-blue-belt"
                      className="svg-mini-map__water"
                      d="M0 492C120 418 182 488 260 428C347 361 420 385 500 432C580 480 636 440 714 358C780 288 862 266 960 302V386C850 356 792 398 720 478C640 568 538 592 442 536C346 480 282 514 194 572C112 626 58 608 0 636Z"
                    />
                    <path
                      id="avenue-main"
                      className="svg-mini-map__road svg-mini-map__road--main"
                      d="M0 346H342L462 330L960 330"
                    />
                    <path id="avenue-secondary" className="svg-mini-map__road" d="M340 0L342 330L312 680" />
                    <path id="road-sector-a" className="svg-mini-map__road" d="M54 190H326" />
                    <path id="road-sector-b" className="svg-mini-map__road" d="M612 200H830" />
                    <path id="road-block-b2" className="svg-mini-map__road" d="M572 520H850" />
                    <text className="svg-mini-map__road-label" x="122" y="338">
                      Avenue Road
                    </text>
                    <text className="svg-mini-map__road-label" x="354" y="176" transform="rotate(90 354 176)">
                      Connector Road
                    </text>
                  </g>

                  {plotGroups.map((sectorGroup) => (
                    <g id={`sector-${sectorGroup.sector.toLowerCase()}`} data-sector={sectorGroup.sector} key={sectorGroup.sector}>
                      {sectorGroup.blocks.map((blockGroup) => (
                        <g
                          id={`block-${blockGroup.id.toLowerCase()}`}
                          data-sector={sectorGroup.sector}
                          data-block={blockGroup.id}
                          key={`${sectorGroup.sector}-${blockGroup.id}`}
                        >
                          {blockGroup.plots.map((plot) => (
                            <g key={plot.id}>
                              <path
                                id={plot.id}
                                className={`svg-mini-map__plot svg-mini-map__plot--${plot.status}${
                                  selectedPlotId === plot.id ? " svg-mini-map__plot--selected" : ""
                                }`}
                                data-sector={plot.sector}
                                data-block={plot.block}
                                data-road={plot.road}
                                data-plot={plot.plot}
                                data-size={plot.size}
                                data-status={plot.status}
                                d={plot.d}
                                vectorEffect="non-scaling-stroke"
                                tabIndex={0}
                                role="button"
                                aria-label={`Plot ${plot.plot}, ${plot.size}, ${statusLabel[plot.status]}`}
                                onClick={() => {
                                  if (lastPointerMoveWasPanRef.current) {
                                    return;
                                  }
                                  setSelectedPlotId(plot.id);
                                }}
                                onKeyDown={(event) => {
                                  if (event.key === "Enter" || event.key === " ") {
                                    event.preventDefault();
                                    setSelectedPlotId(plot.id);
                                  }
                                }}
                              />
                              <text className="svg-mini-map__plot-label" x={plot.labelX} y={plot.labelY - 4}>
                                {plot.plot}
                              </text>
                              <text className="svg-mini-map__plot-size" x={plot.labelX} y={plot.labelY + 12}>
                                {plot.size}
                              </text>
                            </g>
                          ))}
                        </g>
                      ))}
                    </g>
                  ))}

                  <g id="labels">
                    <text className="svg-mini-map__sector-label" x="86" y="72">
                      Sector A / Block A
                    </text>
                    <text className="svg-mini-map__sector-label" x="626" y="72">
                      Sector B
                    </text>
                    <text className="svg-mini-map__sector-label" x="590" y="398">
                      Block B2
                    </text>
                  </g>
                </svg>

              {selectedPlot ? (
                <aside className="svg-mini-map__details" aria-label="Selected plot details">
                  <button type="button" aria-label="Close selected plot" onClick={() => setSelectedPlotId(null)}>
                    <span className="material-symbols-outlined" aria-hidden="true">
                      close
                    </span>
                  </button>
                  <p>Selected plot</p>
                  <h2>
                    {selectedPlot.sector}-{selectedPlot.block}-{selectedPlot.plot}
                  </h2>
                  <dl>
                    <div>
                      <dt>Status</dt>
                      <dd>{statusLabel[selectedPlot.status]}</dd>
                    </div>
                    <div>
                      <dt>Size</dt>
                      <dd>{selectedPlot.size}</dd>
                    </div>
                    <div>
                      <dt>Road</dt>
                      <dd>{selectedPlot.road}</dd>
                    </div>
                    <div>
                      <dt>Price</dt>
                      <dd>{selectedPlot.price ? money.format(selectedPlot.price) : "Not available"}</dd>
                    </div>
                  </dl>
                </aside>
              ) : null}
      </div>
    </section>
  );
}
