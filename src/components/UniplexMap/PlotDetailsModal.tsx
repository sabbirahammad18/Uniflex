import { useEffect } from "react";
import type { MapPlot } from "./UniplexMap";

type PlotDetailsModalProps = {
  plot: MapPlot | null;
  onClose: () => void;
};

type DetailRow = [label: string, value: string | number | null | undefined];

const emptyValue = "Not available";

const formatPrice = (value: string | number | null | undefined): string | null => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) {
    return String(value);
  }

  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(numericValue);
};

const normalizeLabel = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined || value === "") {
    return emptyValue;
  }

  return String(value);
};

export default function PlotDetailsModal({ plot, onClose }: PlotDetailsModalProps) {
  useEffect(() => {
    if (!plot) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, plot]);

  if (!plot) {
    return null;
  }

  const price = formatPrice(plot.price);
  const details: DetailRow[] = [
    ["Plot no", plot.plot_no],
    ["Size", plot.size],
    ["Category", plot.category],
    ["Status", plot.status],
    ["Sector", plot.sector],
    ["Block", plot.block],
    ["Road", plot.road],
  ];

  if (price) {
    details.push(["Price", price]);
  }

  return (
    <div className="uniplex-modal" role="dialog" aria-modal="true" aria-labelledby="plot-details-title">
      <button className="uniplex-modal__backdrop" type="button" aria-label="Close plot details" onClick={onClose} />

      <section className="uniplex-modal__panel">
        <div className="uniplex-modal__handle" aria-hidden="true" />

        <header className="uniplex-modal__header">
          <div>
            <p className="uniplex-modal__eyebrow">Plot details</p>
            <h2 id="plot-details-title">Plot {normalizeLabel(plot.plot_no)}</h2>
          </div>

          <button className="uniplex-icon-button" type="button" aria-label="Close plot details" onClick={onClose}>
            <span className="material-symbols-outlined" aria-hidden="true">
              close
            </span>
          </button>
        </header>

        <dl className="uniplex-detail-grid">
          {details.map(([label, value]) => (
            <div className="uniplex-detail-grid__item" key={label}>
              <dt>{label}</dt>
              <dd className={label === "Status" ? `uniplex-status-text uniplex-status-text--${plot.status}` : undefined}>
                {normalizeLabel(value)}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
