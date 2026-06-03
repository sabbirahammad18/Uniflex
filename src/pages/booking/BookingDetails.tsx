import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { useGetBookingsQuery } from "@/queries/bookingQuery";
import { getApiUrl } from "@/utils/apiUrl";
import { formatCurrency, formatPlainNumber } from "@/utils/format";

const AmountTile = ({
                      label,
                      value,
                      className = "bg-slate-50 text-[#00176b]",
                    }: {
  label: string;
  value: number;
  className?: string;
}) => (
    <div className={`rounded-xl p-4 ${className}`}>
      <p className="text-xs font-bold opacity-70">{label}</p>
      <p className="mt-1 text-lg font-black">{formatCurrency(value)}</p>
    </div>
);

const BookingDetails = () => {
  const { id } = useParams();
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [receiptLoading, setReceiptLoading] = useState(false);
  const { data, isLoading } = useGetBookingsQuery();
  const booking = data?.data.find((item) => String(item.booking_id) === id);

  if (isLoading) {
    return (
        <div className="grid min-h-screen place-items-center bg-white text-[#07277F]">
          Loading booking details
        </div>
    );
  }

  if (!booking) {
    return (
        <div className="mx-auto grid min-h-screen w-full max-w-107.5 place-items-center bg-white p-5 text-center">
          <div>
            <p className="text-lg font-extrabold text-[#00176b]">
              Booking not found
            </p>
            <Link className="mt-4 inline-block text-sm font-bold text-secondary" to="/booking">
              Back to bookings
            </Link>
          </div>
        </div>
    );
  }

  const status = booking.remaining_amount <= 0 ? "Paid" : "Due";
  const receiptSource = booking.booking_id
      ? getApiUrl(`money-receipt/${booking.booking_id}`)
      : null;

  const handleOpenReceipt = async () => {
    if (!receiptSource) return;
    setReceiptLoading(true);
    try {
      const res = await fetch(receiptSource, { credentials: "include" });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setReceiptUrl(url);
      setReceiptOpen(true);
    } catch (error) {
      console.error("Failed to load receipt:", error);
    } finally {
      setReceiptLoading(false);
    }
  };

  const handleCloseReceipt = () => {
    setReceiptOpen(false);
    if (receiptUrl) {
      URL.revokeObjectURL(receiptUrl); // free memory
      setReceiptUrl(null);
    }
  };

  return (
      <div className="bg-white font-sans text-slate-950">
        <main className="mx-auto grid w-full max-w-107.5 grid-cols-1 gap-5 px-4 py-6">
          <section className="rounded-2xl border border-blue-100 bg-white p-5">
            <div className="grid grid-cols-[1fr_auto] items-start gap-3">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-secondary">
                  {booking.customer_uid || `Booking #${booking.booking_id}`}
                </p>
                <h1 className="mt-1 text-2xl font-extrabold text-[#00176b]">
                  {booking.user_name || "Customer"}
                </h1>
                <p className="mt-2 text-sm font-semibold text-slate-500">
                  {booking.project_name || "No project name"}
                </p>
              </div>
              <span
                  className={`rounded-full px-3 py-1 text-[11px] font-extrabold ${
                      status === "Paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                  }`}
              >
              {status}
            </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <AmountTile label="Plot Price" value={booking.plot_price} />
              <AmountTile
                  label="Booking Money"
                  value={booking.booking_money}
                  className="bg-yellow-50 text-yellow-700"
              />
              <AmountTile
                  label="Down Payment"
                  value={booking.down_payment}
                  className="bg-blue-50 text-[#00176b]"
              />
              <AmountTile
                  label="Installment"
                  value={booking.installment_amount}
                  className="bg-purple-50 text-purple-700"
              />
              <AmountTile
                  label="Total Paid"
                  value={booking.total_paid_amount}
                  className="bg-green-50 text-green-700"
              />
              <AmountTile
                  label="Remaining"
                  value={booking.remaining_amount}
                  className="bg-red-50 text-red-700"
              />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-bold text-slate-500">Plot Size</p>
                <p className="mt-1 font-black text-[#00176b]">
                  {formatPlainNumber(booking.plot_size_khata)} Khata
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-bold text-slate-500">Last Entry</p>
                <p className="mt-1 font-black text-[#00176b]">
                  {booking.last_entry_date || "N/A"}
                </p>
              </div>
            </div>

            <button
                type="button"
                disabled={!receiptSource || receiptLoading}
                onClick={handleOpenReceipt}
                className="mt-5 grid h-12 w-full grid-cols-[auto_auto] items-center justify-center gap-2 rounded-xl bg-[#07277F] text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
            <span className="material-symbols-outlined text-body-lg">
              receipt_long
            </span>
              {receiptLoading ? "Loading..." : "Money Receipt"}
            </button>
          </section>
        </main>

        {receiptOpen && receiptUrl && (
            <div className="fixed inset-0 z-[90] grid place-items-center bg-black/50 px-3 py-6">
              <div className="grid h-full max-h-[88vh] w-full max-w-107.5 grid-rows-[auto_1fr] overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-slate-100 px-4 py-3">
                  <div>
                    <h2 className="text-sm font-extrabold text-[#00176b]">
                      Money Receipt
                    </h2>
                    <p className="text-xs font-semibold text-slate-500">
                      {booking.customer_uid || `Booking #${booking.booking_id}`}
                    </p>
                  </div>
                  <button
                      type="button"
                      onClick={handleCloseReceipt}
                      className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-[#07277F]"
                      aria-label="Close receipt"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <iframe
                    title="Money Receipt"
                    src={receiptUrl}
                    className="h-full w-full border-0 bg-white"
                />
              </div>
            </div>
        )}
      </div>
  );
};

export default BookingDetails;