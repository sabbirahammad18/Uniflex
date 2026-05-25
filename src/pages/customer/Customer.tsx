import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { useGetCustomersQuery } from "@/queries/customerQuery";
import { formatCurrency, formatPlainNumber } from "@/utils/format";

function CustomerHistory() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const query = useMemo(
    () => ({
      page,
      per_page: 10,
      search: search.trim() || undefined,
    }),
    [page, search],
  );
  const { data, isLoading, isFetching, isError } = useGetCustomersQuery(query);
  const customers = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="w-full min-h-screen flex justify-center bg-gray-50">
      <div className="w-full max-w-107.5 min-h-screen bg-white flex flex-col pb-24">
        <div className="p-5 bg-[#07277F] text-white">
          <h1 className="text-lg font-bold">Customers</h1>
          <p className="text-xs opacity-80">Booking and payment summary</p>
        </div>

        <div className="p-5 space-y-5">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              search
            </span>
            <input
              value={search}
              onChange={(event) => {
                setPage(1);
                setSearch(event.target.value);
              }}
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-semibold text-slate-800 outline-none focus:border-[#07277F]"
              placeholder="Search customer"
            />
          </div>

          {isLoading && (
            <p className="rounded-xl bg-blue-50 p-4 text-sm font-bold text-[#07277F]">
              Loading customers...
            </p>
          )}

          {isError && (
            <p className="rounded-xl bg-red-50 p-4 text-sm font-bold text-red-700">
              Could not load customer history.
            </p>
          )}

          {!isLoading && !isError && customers.length === 0 && (
            <p className="rounded-xl bg-slate-50 p-4 text-sm font-bold text-slate-600">
              No customers found.
            </p>
          )}

          {customers.map((customer) => {
            const bookings = customer.bookings || [];
            const totalDue = bookings.reduce(
              (total, booking) => total + Math.max(booking.remaining_amount, 0),
              0,
            );

            return (
              <article
                key={customer.user_id}
                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
              >
                <div className="grid grid-cols-[1fr_auto] items-start gap-3">
                  <div>
                    <Link to={bookings[0] ? `/booking/${bookings[0].booking_id}` : "#"}>
                      <h2 className="text-base font-extrabold text-[#07277F] hover:underline">
                        {customer.name || "Customer"}
                      </h2>
                    </Link>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-slate-500">
                      <span>{customer.customer_uid || "N/A"}</span>
                      {customer.phone_number && <span>{customer.phone_number}</span>}
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${
                      customer.status === 1
                        ? "bg-green-50 text-green-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {customer.status_label}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-blue-50 p-3">
                    <p className="text-[11px] font-bold text-slate-500">Bookings</p>
                    <p className="mt-1 text-lg font-black text-[#07277F]">
                      {bookings.length}
                    </p>
                  </div>
                  <div className="rounded-xl bg-red-50 p-3">
                    <p className="text-[11px] font-bold text-slate-500">Total Due</p>
                    <p className="mt-1 text-lg font-black text-red-700">
                      {formatCurrency(totalDue)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {bookings.length === 0 && (
                    <p className="rounded-xl bg-slate-50 p-3 text-xs font-bold text-slate-500">
                      No booking details found.
                    </p>
                  )}

                  {bookings.map((booking) => {
                    const paid = booking.remaining_amount <= 0;

                    return (
                      <div
                        key={booking.booking_id}
                        className="rounded-xl border border-slate-100 bg-slate-50 p-3"
                      >
                        <div className="grid grid-cols-[1fr_auto] items-start gap-3">
                          <div>
                            <p className="text-sm font-extrabold text-slate-900">
                              {booking.project_name || "Project"}
                            </p>
                            <p className="mt-1 text-xs font-semibold text-slate-500">
                              {booking.property_no || "N/A"} ·{" "}
                              {formatPlainNumber(booking.plot_size_katha)} Khata
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-2 py-1 text-[10px] font-extrabold ${
                              paid
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {paid ? "Paid" : booking.status_label}
                          </span>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="font-bold text-slate-500">Plot Price</p>
                            <p className="mt-1 font-black text-[#07277F]">
                              {formatCurrency(booking.plot_price)}
                            </p>
                          </div>
                          <div>
                            <p className="font-bold text-slate-500">Remaining</p>
                            <p className="mt-1 font-black text-red-700">
                              {formatCurrency(booking.remaining_amount)}
                            </p>
                          </div>
                        </div>

                        <Link
                          to={`/booking/${booking.booking_id}`}
                          className="mt-3 grid h-9 grid-cols-[auto_auto] items-center justify-center gap-1 rounded-lg bg-[#07277F] text-xs font-bold text-white"
                        >
                          <span className="material-symbols-outlined text-body-sm">
                            visibility
                          </span>
                          View Booking
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </article>
            );
          })}

          {pagination && pagination.last_page > 1 && (
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
              <button
                type="button"
                onClick={() => setPage((value) => Math.max(value - 1, 1))}
                disabled={page <= 1 || isFetching}
                className="h-10 w-10 rounded-full border border-slate-200 text-[#07277F] disabled:opacity-40"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <p className="text-center text-xs font-bold text-slate-500">
                Page {pagination.current_page} of {pagination.last_page}
              </p>
              <button
                type="button"
                onClick={() =>
                  setPage((value) => Math.min(value + 1, pagination.last_page))
                }
                disabled={page >= pagination.last_page || isFetching}
                className="h-10 w-10 rounded-full border border-slate-200 text-[#07277F] disabled:opacity-40"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerHistory;
