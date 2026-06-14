import { useDeferredValue, useMemo, useState } from "react";
import { useGetManagementBookingsQuery } from "@/queries/managementQuery";
import { formatCurrency } from "@/utils/format";

const AllBookings = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"" | "due" | "paid">("");
  const deferredSearch = useDeferredValue(search);

  const query = useMemo(
    () => ({
      page,
      per_page: 10,
      search: deferredSearch.trim() || undefined,
      payment_status: paymentStatus,
    }),
    [deferredSearch, page, paymentStatus],
  );

  const { data, isLoading, isFetching, isError } =
    useGetManagementBookingsQuery(query);

  const bookings = data?.data || [];
  const pagination = data?.pagination;
  const paymentFilters = data?.filters.payment_statuses || [];
  const dueTotal = bookings.reduce(
    (total, booking) => total + Math.max(booking.due_amount, 0),
    0,
  );
  const paidTotal = bookings.reduce(
    (total, booking) => total + booking.paid_amount,
    0,
  );

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <div className="mx-auto flex min-h-screen w-full max-w-107.5 flex-col bg-white pb-24">
        <div className="bg-[#07277F] px-5 py-5 text-white">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-blue-200">
            Mobile admin
          </p>
          <h1 className="mt-1 text-xl font-black">Bookings List</h1>
          <p className="mt-1 text-xs text-blue-100">
            Approved active bookings from the backend dashboard
          </p>
        </div>

        <div className="space-y-4 p-5">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              search
            </span>
            <input
              type="search"
              inputMode="search"
              value={search}
              onChange={(event) => {
                setPage(1);
                setSearch(event.target.value);
              }}
              placeholder="Search by customer, UID, phone, project"
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-semibold text-slate-800 outline-none focus:border-[#07277F]"
            />
          </div>

          <div className="grid grid-flow-col auto-cols-max gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={() => {
                setPage(1);
                setPaymentStatus("");
              }}
              className={`rounded-full px-3 py-2 text-xs font-black transition ${
                paymentStatus === ""
                  ? "bg-[#07277F] text-white"
                  : "border border-slate-200 bg-white text-slate-600"
              }`}
            >
              All
            </button>
            {paymentFilters
              .filter((item) => item.value !== "all")
              .map((item) => (
                <button
                  key={String(item.value)}
                  type="button"
                  onClick={() => {
                    setPage(1);
                    setPaymentStatus(item.value as "due" | "paid");
                  }}
                  className={`rounded-full px-3 py-2 text-xs font-black transition ${
                    paymentStatus === item.value
                      ? "bg-[#07277F] text-white"
                      : "border border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  {item.label}
                </button>
              ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-amber-50 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                Due on page
              </p>
              <p className="mt-2 text-lg font-black text-amber-700">
                {formatCurrency(dueTotal)}
              </p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                Paid on page
              </p>
              <p className="mt-2 text-lg font-black text-emerald-700">
                {formatCurrency(paidTotal)}
              </p>
            </div>
          </div>

          {isLoading && (
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm font-bold text-[#07277F]">
              Loading bookings...
            </div>
          )}

          {isError && (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">
              Could not load bookings.
            </div>
          )}

          {!isLoading && !isError && bookings.length === 0 && (
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-600">
              No bookings found.
            </div>
          )}

          <section className="space-y-3">
            {bookings.map((booking) => {
              const isPaid = booking.payment_status === "paid";

              return (
                <article
                  key={booking.booking_id}
                  className={`rounded-2xl border border-l-4 bg-white p-4 shadow-sm ${
                    isPaid
                      ? "border-green-100 border-l-emerald-500"
                      : "border-orange-100 border-l-amber-500"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="truncate text-base font-black text-slate-900">
                        {booking.project_name || "Project"}
                      </h2>
                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        {booking.customer_name || "Customer"}
                        {booking.customer_uid ? ` (${booking.customer_uid})` : ""}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black ${
                        isPaid
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {isPaid ? "Paid" : "Due"}
                    </span>
                  </div>

                  <div className="mt-3 rounded-xl bg-slate-50 p-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      Contact
                    </p>
                    <p className="mt-1 text-sm font-bold text-[#07277F]">
                      {booking.phone_number || "Phone not available"}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      Added {booking.created_at || "N/A"}
                    </p>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                    <div className="rounded-xl bg-blue-50 p-3">
                      <p className="font-bold text-slate-500">Payable</p>
                      <p className="mt-1 font-black text-[#07277F]">
                        {formatCurrency(booking.payable_amount)}
                      </p>
                    </div>
                    <div className="rounded-xl bg-emerald-50 p-3">
                      <p className="font-bold text-slate-500">Paid</p>
                      <p className="mt-1 font-black text-emerald-700">
                        {formatCurrency(booking.paid_amount)}
                      </p>
                    </div>
                    <div className="rounded-xl bg-amber-50 p-3">
                      <p className="font-bold text-slate-500">Due</p>
                      <p className="mt-1 font-black text-amber-700">
                        {formatCurrency(booking.due_amount)}
                      </p>
                    </div>
                  </div>


                </article>
              );
            })}
          </section>

          {pagination && pagination.last_page > 1 && (
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setPage((value) => Math.max(value - 1, 1))}
                disabled={pagination.current_page <= 1 || isFetching}
                className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-[#07277F] disabled:opacity-40"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <p className="text-center text-xs font-bold text-slate-500">
                Page {pagination.current_page} of {pagination.last_page}
              </p>
              <button
                type="button"
                onClick={() =>
                  setPage((value) =>
                    Math.min(value + 1, pagination.last_page),
                  )
                }
                disabled={
                  pagination.current_page >= pagination.last_page || isFetching
                }
                className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-[#07277F] disabled:opacity-40"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllBookings;
