import { Link, useParams } from "react-router-dom";
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

  return (
    <div className="bg-whitefont-sans text-slate-950">
      <main className="mx-auto grid w-full max-w-107.5 grid-cols-1 gap-5 px-4 py-6">
        <Link
          to="/booking"
          className="inline-grid w-fit grid-cols-[auto_auto] items-center gap-1 text-sm font-bold text-[#07277F]"
        >
          <span className="material-symbols-outlined text-body-lg">
            arrow_back
          </span>
          Bookings
        </Link>

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

          <a
            className="mt-5 grid h-12 grid-cols-[auto_auto] items-center justify-center gap-2 rounded-xl bg-[#07277F] text-sm font-extrabold text-white"
            href={getApiUrl(`money-receipt/${booking.booking_id}`)}
            target="_blank"
            rel="noreferrer"
          >
            <span className="material-symbols-outlined text-body-lg">
              receipt_long
            </span>
            Money Receipt
          </a>
        </section>
      </main>
    </div>
  );
};

export default BookingDetails;
