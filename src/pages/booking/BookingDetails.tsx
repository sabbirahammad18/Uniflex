import { Link, useParams, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useGetBookingDetailsQuery, useGetMoneyReceiptQuery } from "@/queries/bookingQuery";
import { formatCurrency, formatPlainNumber } from "@/utils/format";

// ── sub-components ────────────────────────────────────────────────────────────

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

const APPROVAL: Record<number, { text: string; cls: string }> = {
  0: { text: "Pending",  cls: "bg-amber-100 text-amber-700" },
  1: { text: "Approved", cls: "bg-green-100 text-green-700" },
  2: { text: "Rejected", cls: "bg-red-100 text-red-700"    },
};

// ── receipt modal (isolated so it owns its own RTK query) ─────────────────────

const ReceiptModal = ({
                        userId,
                        paymentId,
                        onClose,
                      }: {
  userId: number;
  paymentId: number;
  onClose: () => void;
}) => {
  const { data, isFetching, isError } = useGetMoneyReceiptQuery({ userId, paymentId });

  return (
      <div className="fixed inset-0 z-90 grid place-items-center bg-black/50 px-3 py-6">
        <div className="grid w-full max-w-107.5 grid-rows-[auto_1fr] overflow-hidden rounded-2xl bg-white shadow-2xl">

          {/* Header */}
          <div className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-slate-100 px-4 py-3">
            <div>
              <h2 className="text-sm font-extrabold text-[#00176b]">Money Receipt</h2>
              {data && (
                  <p className="text-xs font-semibold text-slate-500">
                    {data.customer.employee_uid}
                  </p>
              )}
            </div>
            <button
                type="button"
                onClick={onClose}
                className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-[#07277F]"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Body */}
          {isFetching && (
              <div className="grid place-items-center h-[38rem] py-16 text-sm font-semibold text-[#07277F]">
                Loading receipt…
              </div>
          )}

          {isError && !isFetching && (
              <div className="grid place-items-center py-16 text-sm font-semibold text-red-500">
                Failed to load receipt. Please try again.
              </div>
          )}

          {data && !isFetching && (
              <div className="space-y-5 overflow-y-auto">

                {/* Company strip */}
                <div className="border-b border-slate-100 px-4 pb-2 pt-2.5 text-center">
                  <img
                      src={data.company.logo}
                      alt={data.company.name}
                      className="mx-auto mb-1 h-11 w-auto object-contain"
                  />
                  <p className="text-[10px] leading-5 text-slate-400">{data.company.address}</p>
                  <p className="text-[10px] text-slate-400">
                    {data.company.website} · {data.company.mobile}
                  </p>
                  <span className="mt-1.5 inline-block rounded-full bg-[#07277f]/10 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#07277f]">
                {data.receipt.copy_type}
              </span>
                </div>

                {/* Receipt no + date */}
                <div className="grid grid-cols-2 border border-slate-100 px-4 py-1.5">
                  <div>
                    <p className="mb-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Receipt no.
                    </p>
                    <p className="text-sm font-black text-[#07277F]">{data.receipt.receipt_no}</p>
                  </div>
                  <div className="text-right">
                    <p className="mb-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Date
                    </p>
                    <p className="text-sm font-black text-[#07277F]">{data.receipt.receipt_date}</p>
                  </div>
                </div>

                {/* Customer details */}
                <div className="px-4 pb-0 pt-2">
                  <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Customer details
                  </p>
                  {(
                      [
                        ["Employee UID",  data.customer.employee_uid],
                        ["Customer name", data.customer.customer_name],
                        ["Mobile",        data.customer.mobile_number],
                      ] as [string, string][]
                  ).map(([label, value]) => (
                      <div
                          key={label}
                          className="grid grid-cols-[110px_1fr] gap-2 border-b border-slate-100 py-1 last:border-0"
                      >
                        <span className="text-[11px] text-slate-500">{label}</span>
                        <span className="text-right text-[11px] font-bold leading-tight text-slate-800">
                    {value}
                  </span>
                      </div>
                  ))}
                </div>

                {/* Plot details */}
                <div className="border-t border-slate-100 px-4 pb-0 pt-2">
                  <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Plot details
                  </p>
                  {(
                      [
                        ["Plot description", data.plot.description],
                        ["Project",         data.project.project_name],
                      ] as [string, string][]
                  ).map(([label, value]) => (
                      <div
                          key={label}
                          className="grid grid-cols-[110px_1fr] gap-2 border-b border-slate-100 py-1 last:border-0"
                      >
                        <span className="text-[11px] text-slate-500">{label}</span>
                        <span className="text-right text-[11px] font-bold text-slate-800">{value}</span>
                      </div>
                  ))}
                </div>

                {/* Payment panel */}
                <div className="mx-3 mb-3 mt-2.5 rounded-xl bg-gray-100 p-3.5">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-black/50">
                      Payment details
                    </p>
                    <span className="rounded-full py-0.5 text-[10px] font-bold text-black">
                  {data.payment.type}
                </span>
                  </div>
                  <div className="mb-2 grid grid-cols-2 gap-2">
                    <div>
                      <p className="mb-0.5 text-[10px] text-black/50">Start date</p>
                      <p className="text-xs font-bold text-black">{data.receipt.start_date}</p>
                    </div>
                    <div className="text-right">
                      <p className="mb-0.5 text-[10px] text-black/50">Next date</p>
                      <p className="text-xs font-bold text-black">{data.payment.next_date}</p>
                    </div>
                  </div>
                  <div className="border-t border-white/20 pt-2">
                    <p className="mb-0.5 text-[10px] text-black/50">Received amount</p>
                    <p className="text-2xl font-black text-black">
                      {formatCurrency(data.payment.received_amount)}
                    </p>
                    <p className="mt-1.5 border-t border-white/15 pt-1.5 text-[11px] italic text-black/50">
                      {data.payment.amount_in_word}
                    </p>
                  </div>
                </div>

              </div>
          )}
        </div>
      </div>
  );
};

// ── main component ────────────────────────────────────────────────────────────

const BookingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();

  const projectId = Number(id);
  const user_id   = searchParams.get("user_id");

  // null  → no receipt open
  // number → receipt open for that payment_id
  const [activePaymentId, setActivePaymentId] = useState<number | null>(null);

  const { data, isLoading } = useGetBookingDetailsQuery(
      { projectId, user_id },
      { skip: !projectId }
  );

  if (isLoading) {
    return (
        <div className="grid min-h-screen place-items-center bg-white text-[#07277F]">
          Loading booking details…
        </div>
    );
  }

  if (!data?.booking) {
    return (
        <div className="mx-auto grid min-h-screen w-full max-w-107.5 place-items-center bg-white p-5 text-center">
          <div>
            <p className="text-lg font-extrabold text-[#00176b]">Booking not found</p>
            <Link className="mt-4 inline-block text-sm font-bold text-secondary" to="/booking">
              Back to bookings
            </Link>
          </div>
        </div>
    );
  }

  const { booking, payments } = data;
  const paymentStatus = booking.remaining_amount <= 0 ? "Paid" : "Due";

  return (
      <div className="bg-white font-sans text-slate-950">
        <main className="mx-auto grid w-full max-w-107.5 grid-cols-1 gap-5 px-4 py-6">

          {/* ── Summary card ── */}
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
                      paymentStatus === "Paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                  }`}
              >
              {paymentStatus}
            </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <AmountTile label="Plot Price"    value={booking.plot_price} />
              <AmountTile label="Booking Money" value={booking.booking_money}      className="bg-yellow-50 text-yellow-700" />
              <AmountTile label="Down Payment"  value={booking.down_payment}       className="bg-blue-50 text-[#00176b]" />
              <AmountTile label="Installment"   value={booking.installment_amount} className="bg-purple-50 text-purple-700" />
              <AmountTile label="Total Paid"    value={booking.total_paid_amount}  className="bg-green-50 text-green-700" />
              <AmountTile label="Remaining"     value={booking.remaining_amount}   className="bg-red-50 text-red-700" />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-bold text-slate-500">Plot Size</p>
                <p className="mt-1 font-black text-[#00176b]">
                  {formatPlainNumber(booking.plot_size_khata)} Khata
                </p>
              </div>
            </div>
          </section>

          {/* ── Payment history ── */}
          <section className="mb-16 rounded-2xl border border-blue-100 bg-white p-5">
            <h2 className="mb-4 text-sm font-extrabold uppercase tracking-wider text-[#00176b]">
              Payment History
              <span className="ml-2 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-bold text-[#07277F]">
              {payments.length}
            </span>
            </h2>

            {payments.length === 0 ? (
                <p className="py-6 text-center text-sm font-semibold text-slate-400">
                  No payments recorded yet.
                </p>
            ) : (
                <ul className="space-y-3">
                  {payments.map((p) => {
                    const badge = APPROVAL[p.is_approved] ?? APPROVAL[0];
                    return (
                        <li key={p.payment_id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-base font-black text-[#00176b]">
                                {formatCurrency(p.amount)}
                              </p>
                              {p.payment_type && (
                                  <p className="mt-0.5 text-[11px] font-semibold capitalize text-slate-500">
                                    {p.payment_type}
                                  </p>
                              )}
                            </div>
                            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${badge.cls}`}>
                        {badge.text}
                      </span>
                          </div>

                          <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                            <div>
                              <p className="font-bold uppercase tracking-wide">Date</p>
                              <p className="font-semibold text-slate-700">{p.payment_date}</p>
                            </div>
                            {p.transaction_id && (
                                <div className="text-right">
                                  <p className="font-bold uppercase tracking-wide">Txn ID</p>
                                  <p className="break-all font-semibold text-slate-700">{p.transaction_id}</p>
                                </div>
                            )}
                          </div>

                          {p.note && (
                              <p className="mt-2 border-t border-slate-200 pt-2 text-[11px] italic text-slate-400">
                                {p.note}
                              </p>
                          )}

                          <button
                              type="button"
                              onClick={() => setActivePaymentId(p.payment_id)}
                              className="mt-4 grid h-10 w-full grid-cols-[auto_auto] items-center justify-center gap-2 rounded-xl bg-[#07277F] text-sm font-semibold text-white"
                          >
                            <span className="material-symbols-outlined text-body-sm">receipt_long</span>
                            Money Receipt
                          </button>
                        </li>
                    );
                  })}
                </ul>
            )}
          </section>
        </main>

        {/* ReceiptModal mounts only when a payment is selected.
          It owns its RTK query — loading/error/data all live inside it. */}
        {activePaymentId !== null && booking.user_id && (
            <ReceiptModal
                userId={booking.user_id}
                paymentId={activePaymentId}
                onClose={() => setActivePaymentId(null)}
            />
        )}
      </div>
  );
};

export default BookingDetails;