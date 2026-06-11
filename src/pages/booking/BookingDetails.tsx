import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { useGetBookingsQuery } from "@/queries/bookingQuery";
import { getApiUrl } from "@/utils/apiUrl";
import { formatCurrency, formatPlainNumber } from "@/utils/format";

interface ReceiptData {
  company: {
    name: string;
    address: string;
    website: string;
    mobile: string;
    logo: string;
  };
  receipt: {
    copy_type: string;
    receipt_no: string;
    receipt_date: string;
    start_date: string;
  };
  customer: {
    employee_uid: string;
    customer_name: string;
    mobile_number: string;
    email: string;
  };
  plot: {
    property_no: string | null;
    katha: string | null;
    block_no: string | null;
    road_no: string | null;
    description: string;
  };
  payment: {
    type: string;
    received_amount: number;
    amount_in_word: string;
    total_paid: number;
    next_date: string;
  };
  project: {
    project_id: number;
    project_name: string;
  };
}

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
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
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
            <p className="text-lg font-extrabold text-[#00176b]">Booking not found</p>
            <Link className="mt-4 inline-block text-sm font-bold text-secondary" to="/booking">
              Back to bookings
            </Link>
          </div>
        </div>
    );
  }

  const status = booking.remaining_amount <= 0 ? "Paid" : "Due";

  const handleOpenReceipt = async () => {
    if (!booking.user_id) return;
    setReceiptLoading(true);
    try {
      const res = await fetch(getApiUrl(`money-receipt/${booking.user_id}`), {
        credentials: "include",
      });
      const json: ReceiptData = await res.json();
      setReceiptData(json);
      setReceiptOpen(true);
    } catch (error) {
      console.error("Failed to load receipt:", error);
    } finally {
      setReceiptLoading(false);
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
              <AmountTile label="Booking Money" value={booking.booking_money} className="bg-yellow-50 text-yellow-700" />
              <AmountTile label="Down Payment" value={booking.down_payment} className="bg-blue-50 text-[#00176b]" />
              <AmountTile label="Installment" value={booking.installment_amount} className="bg-purple-50 text-purple-700" />
              <AmountTile label="Total Paid" value={booking.total_paid_amount} className="bg-green-50 text-green-700" />
              <AmountTile label="Remaining" value={booking.remaining_amount} className="bg-red-50 text-red-700" />
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
                disabled={receiptLoading}
                onClick={handleOpenReceipt}
                className="mt-5 grid h-12 w-full grid-cols-[auto_auto] items-center justify-center gap-2 rounded-xl bg-[#07277F] text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-body-lg">receipt_long</span>
              {receiptLoading ? "Loading..." : "Money Receipt"}
            </button>
          </section>
        </main>

        {/* Receipt Modal */}
        {receiptOpen && receiptData && (
            <div className="fixed inset-0 z-[90] grid place-items-center bg-black/50 px-3 py-6">
              <div className="grid max-h-auto w-full max-w-107.5 grid-rows-[auto_1fr] overflow-hidden rounded-2xl bg-white shadow-2xl">

                {/* Modal Header */}
                <div className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-slate-100 px-4 py-3">
                  <div>
                    <h2 className="text-sm font-extrabold text-[#00176b]">Money Receipt</h2>
                    <p className="text-xs font-semibold text-slate-500">
                      {receiptData.customer.employee_uid}
                    </p>
                  </div>
                  <button
                      type="button"
                      onClick={() => setReceiptOpen(false)}
                      className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-[#07277F]"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                {/* Modal Body */}
                <div className="space-y-5">

                  {/* Company Strip */}
                  <div className="px-4 pt-2.5 pb-2 text-center border-slate-100">
                    <img src={receiptData.company.logo} alt={receiptData.company.name}
                         className="h-11 w-auto object-contain mx-auto mb-1" />
                    <p className="text-[10px] text-slate-400 leading-5">{receiptData.company.address}</p>
                    <p className="text-[10px] text-slate-400">{receiptData.company.website} · {receiptData.company.mobile}</p>
                    <span className="inline-block mt-1.5 rounded-full bg-[#07277f]/10 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#07277f]">
      {receiptData.receipt.copy_type}
    </span>
                  </div>

                  {/* Receipt No + Date */}
                  <div className="grid grid-cols-2 px-4 py-1.5 border border-slate-100">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Receipt no.</p>
                      <p className="text-sm font-black text-[#07277F]">{receiptData.receipt.receipt_no}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Date</p>
                      <p className="text-sm font-black text-[#07277F]">{receiptData.receipt.receipt_date}</p>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div className="px-4 pt-2 pb-0">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Customer details</p>
                    {[
                      ["Employee UID", receiptData.customer.employee_uid],
                      ["Customer name", receiptData.customer.customer_name],
                      ["Mobile", receiptData.customer.mobile_number],
                    ].map(([label, value]) => (
                        <div key={label} className="grid grid-cols-[110px_1fr] gap-2 py-1 border-b border-slate-100 last:border-0">
                          <span className="text-[11px] text-slate-500">{label}</span>
                          <span className="text-[11px] font-bold text-slate-800 text-right leading-tight">{value}</span>
                        </div>
                    ))}
                  </div>

                  {/* Plot Details */}
                  <div className="px-4 pt-2 pb-0 border-t border-slate-100">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Plot details</p>
                    {[
                      ["Plot description", receiptData.plot.description],
                      ["Project", receiptData.project.project_name],
                    ].map(([label, value]) => (
                        <div key={label} className="grid grid-cols-[110px_1fr] gap-2 py-1 border-b border-slate-100 last:border-0">
                          <span className="text-[11px] text-slate-500">{label}</span>
                          <span className="text-[11px] font-bold text-slate-800 text-right">{value}</span>
                        </div>
                    ))}
                  </div>

                  {/* Payment Panel */}
                  <div className="mx-3 mt-2.5 mb-3 rounded-xl bg-gray-100 p-3.5">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-black/50">Payment details</p>
                      <span className="rounded-full bg-white/15 py-0.5 text-[10px] font-bold text-black">
        {receiptData.payment.type}
      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div>
                        <p className="text-[10px] text-black/50 mb-0.5">Start date</p>
                        <p className="text-xs font-bold text-black">{receiptData.receipt.start_date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-black/50 mb-0.5">Next date</p>
                        <p className="text-xs font-bold text-black">{receiptData.payment.next_date}</p>
                      </div>
                    </div>
                    <div className="border-t border-white/20 pt-2">
                      <p className="text-[10px] text-black/50 mb-0.5">Received amount</p>
                      <p className="text-2xl font-black text-black">{formatCurrency(receiptData.payment.received_amount)}</p>
                      <p className="text-[11px] italic text-black/50 mt-1.5 pt-1.5 border-t border-white/15">
                        {receiptData.payment.amount_in_word}
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default BookingDetails;