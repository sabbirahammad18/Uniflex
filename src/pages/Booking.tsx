import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetCurrentUserQuery } from "@/queries/authQuery";
import { useGetBookingsQuery } from "@/queries/bookingQuery";
import { formatCurrency, formatPlainNumber } from "@/utils/format";
import { getDataScopeLabel } from "@/utils/userAccess";

type BookingFilter = "all" | "due" | "paid";

const BookingManagement = () => {
  const [filter, setFilter] = useState<BookingFilter>("all");
  const { data: session } = useGetCurrentUserQuery();
  const { data, isLoading, isError } = useGetBookingsQuery();
  const bookings = data?.data || [];

  const visibleBookings = bookings.filter((booking) => {
    const isPaid = booking.remaining_amount <= 0;
    if (filter === "paid") return isPaid;
    if (filter === "due") return !isPaid;
    return true;
  });

  const dueTotal = bookings.reduce(
    (total, booking) => total + Math.max(booking.remaining_amount, 0),
    0,
  );

  const filterButtonClass = (value: BookingFilter) =>
    value === filter
      ? "grid grid-cols-[auto_auto] items-center gap-1 rounded-full bg-[#07277f] px-2.5 py-1 text-label-md font-bold text-white shadow-sm"
      : "grid grid-cols-[auto_auto] items-center gap-1 rounded-full bg-white px-2.5 py-2 text-label-md text-slate-500 border border-slate-100";

  return (
    <div className="bg-white mx-auto w-full max-w-107.5 min-h-screen pb-24 font-sans text-slate-950">
      <main className="mx-auto w-full max-w-107.5 px-4 py-6 grid grid-cols-1 gap-5">
        <section className="grid grid-cols-1 gap-4">
          <div>
            <p className="mb-1 text-[11px] font-extrabold uppercase tracking-[0.2em] text-secondary">
              {getDataScopeLabel(session?.user)}
            </p>
            <h2 className="text-2xl font-extrabold text-[#00176b] tracking-tight">
              Booking Management
            </h2>
          </div>

          <div className="grid grid-flow-col auto-cols-max gap-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              onClick={() => setFilter("all")}
              className={filterButtonClass("all")}
            >
              <span className="material-symbols-outlined text-body-sm">
                list_alt
              </span>
              All Bookings
            </button>
            <button
              onClick={() => setFilter("due")}
              className={filterButtonClass("due")}
            >
              <span className="material-symbols-outlined text-body-lg">
                pending_actions
              </span>
              Due
            </button>
            <button
              onClick={() => setFilter("paid")}
              className={filterButtonClass("paid")}
            >
              <span className="material-symbols-outlined text-body-lg">
                verified
              </span>
              Paid
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4">
          {isLoading && (
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 text-sm font-bold text-[#00176b]">
              Loading bookings...
            </div>
          )}

          {isError && (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-sm font-bold text-red-700">
              Could not load bookings.
            </div>
          )}

          {!isLoading && !isError && visibleBookings.length === 0 && (
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 text-sm font-bold text-slate-600">
              No bookings found.
            </div>
          )}

          {visibleBookings.map((booking) => {
            const isPaid = booking.remaining_amount <= 0;

            return (
              <article
                key={booking.booking_id}
                className={`grid grid-cols-1 gap-5 rounded-2xl bg-white p-5 border border-l-4 ${
                  isPaid
                    ? "border-green-100 border-l-emerald-500"
                    : "border-orange-100 border-l-amber-500"
                }`}
              >
                <div className="grid grid-cols-[auto_auto] items-start justify-between">
                  <div className="h-12 w-12 rounded-xl bg-slate-100 grid place-items-center text-[#00176b]">
                    <span className="material-symbols-outlined text-h2">
                      apartment
                    </span>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-[11px] font-extrabold ${
                      isPaid
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-amber-200 bg-amber-50 text-amber-700"
                    }`}
                  >
                    {isPaid ? "Paid" : "Due"}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-extrabold text-slate-950">
                    {booking.project_name || "Project"}
                  </h3>
                  <p className="mt-1 grid grid-cols-[auto_1fr] items-center gap-1 text-sm text-slate-500">
                    <span className="material-symbols-outlined text-body-md">
                      person
                    </span>
                    {booking.user_name || "Customer"}{" "}
                    {booking.customer_uid ? `(${booking.customer_uid})` : ""}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4 grid grid-cols-[1fr_auto] items-center gap-3">
                  <span className="text-sm text-slate-500">
                    Remaining Amount
                  </span>
                  <span className="text-xl font-extrabold text-[#00176b]">
                    {formatCurrency(booking.remaining_amount)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-xl bg-blue-50 p-3">
                    <p className="font-semibold text-slate-500">Plot Price</p>
                    <p className="mt-1 font-black text-[#00176b]">
                      {formatCurrency(booking.plot_price)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-green-50 p-3">
                    <p className="font-semibold text-slate-500">Paid</p>
                    <p className="mt-1 font-black text-green-700">
                      {formatCurrency(booking.total_paid_amount)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-yellow-50 p-3">
                    <p className="font-semibold text-slate-500">Booking</p>
                    <p className="mt-1 font-black text-yellow-700">
                      {formatCurrency(booking.booking_money)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-purple-50 p-3">
                    <p className="font-semibold text-slate-500">Khata</p>
                    <p className="mt-1 font-black text-purple-700">
                      {formatPlainNumber(booking.plot_size_khata)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <Link to={`/booking/${booking.booking_id}`}>
                    <button className="h-11 w-full rounded-xl bg-[#07277f] text-white font-bold grid grid-cols-[auto_auto] items-center justify-center gap-2 active:scale-[0.98] transition">
                      <span className="material-symbols-outlined text-body-lg">
                        visibility
                      </span>
                      View
                    </button>
                  </Link>
                  {!isPaid && (
                    <Link to="/customerpayment">
                      <button className="h-11 w-16 rounded-xl border border-blue-200 text-[#07277f] grid place-items-center text-xs font-bold active:scale-95 transition">
                        Pay
                      </button>
                    </Link>
                  )}
                </div>
              </article>
            );
          })}

          <article className="rounded-2xl bg-blue-50 p-5 border border-blue-100">
            <div className="grid grid-cols-[48px_1fr] items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-white grid place-items-center text-[#00176b]">
                <span className="material-symbols-outlined text-h2">
                  payments
                </span>
              </div>
              <div>
                <p className="text-xl font-extrabold text-[#00176b]">
                  {formatCurrency(dueTotal)}
                </p>
                <p className="text-sm text-slate-500">Total due balance</p>
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
};

export default BookingManagement;
