import type { MapPlot } from "./UniplexMap";

type PlotStatus = MapPlot["status"];
type StatusFilter = PlotStatus | "all";
type StatusCounts = Record<PlotStatus, number>;

type PlotSearchProps = {
  query: string;
  onQueryChange: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (value: StatusFilter) => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  categories: string[];
  results: MapPlot[];
  resultCount: number;
  totalPlots: number;
  statusCounts: StatusCounts;
  onClose: () => void;
  onResultClick: (plot: MapPlot) => void;
};

const STATUS_OPTIONS = ["all", "available", "booked", "hold", "sold", "unknown"] as const;
const PLOT_STATUS_OPTIONS = ["available", "booked", "hold", "sold", "unknown"] as const;
const RESULT_LIMIT_LABEL = 80;

const formatCount = (value: number): string => new Intl.NumberFormat("en-BD").format(value || 0);

const toTitle = (value: string | number | null | undefined): string => {
  if (!value) {
    return "";
  }

  return String(value)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

export default function PlotSearch({
  query,
  onQueryChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  categories,
  results,
  resultCount,
  totalPlots,
  statusCounts,
  onClose,
  onResultClick,
}: PlotSearchProps) {
  const hasActiveSearch = Boolean(query.trim() || statusFilter !== "all" || categoryFilter !== "all");

  return (
    <aside className="uniplex-search" aria-label="Plot search" onWheel={(event) => event.stopPropagation()}>
      <div className="uniplex-search__summary">
        <div>
          <p className="uniplex-search__label">Uniplex plot map</p>
          <strong>{formatCount(totalPlots)} plots</strong>
        </div>

        <button className="uniplex-search__close" type="button" aria-label="Close plot search" onClick={onClose}>
          <span className="material-symbols-outlined" aria-hidden="true">
            close
          </span>
        </button>
      </div>

      <div className="uniplex-search__field">
        <label className="uniplex-sr-only" htmlFor="uniplex-plot-search">
          Search plot number, size, category, or status
        </label>
        <span className="material-symbols-outlined" aria-hidden="true">
          search
        </span>
        <input
          id="uniplex-plot-search"
          type="search"
          value={query}
          autoComplete="off"
          inputMode="search"
          placeholder="Plot no, size, category, status"
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </div>

      <div className="uniplex-search__filters">
        <label>
          <span>Status</span>
          <select value={statusFilter} onChange={(event) => onStatusFilterChange(event.target.value as StatusFilter)}>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status === "all" ? "All statuses" : toTitle(status)}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Category</span>
          <select value={categoryFilter} onChange={(event) => onCategoryFilterChange(event.target.value)}>
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {toTitle(category)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="uniplex-status-legend" aria-label="Status quick filters">
        {PLOT_STATUS_OPTIONS.map((status) => (
          <button
            className={`uniplex-status-pill${statusFilter === status ? " uniplex-status-pill--active" : ""}`}
            key={status}
            type="button"
            onClick={() => onStatusFilterChange(statusFilter === status ? "all" : status)}
          >
            <span className={`uniplex-status-dot uniplex-status-dot--${status}`} aria-hidden="true" />
            {toTitle(status)}
            <b>{formatCount(statusCounts[status])}</b>
          </button>
        ))}
      </div>

      {hasActiveSearch ? (
        <div className="uniplex-search-results">
          <div className="uniplex-search-results__meta">
            <span>{formatCount(resultCount)} matches</span>
            {resultCount > RESULT_LIMIT_LABEL ? <span>Showing first {RESULT_LIMIT_LABEL}</span> : null}
          </div>

          {results.length ? (
            <ul>
              {results.map((plot) => (
                <li key={plot.uid}>
                  <button type="button" onClick={() => onResultClick(plot)}>
                    <span className={`uniplex-status-dot uniplex-status-dot--${plot.status}`} aria-hidden="true" />
                    <span>
                      <strong>Plot {plot.plot_no}</strong>
                      <small>
                        {[plot.size, toTitle(plot.category), toTitle(plot.status)].filter(Boolean).join(" . ")}
                      </small>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="uniplex-search-results__empty">No matching plots</p>
          )}
        </div>
      ) : null}
    </aside>
  );
}
