import { useGetPaymentSummaryQuery } from "@/queries/paymentQuery";
import { useGetBookingsQuery } from "@/queries/bookingQuery";
import { formatCurrency, formatPlainNumber } from "@/utils/format";

const PaymentHistory = () => {
  const { data: summary, isLoading } = useGetPaymentSummaryQuery();
  const { data: bookings } = useGetBookingsQuery();
  const customerBooking = bookings?.data.find(
    (booking) => booking.customer_uid === summary?.user_id,
  );

  return (
    <div className="w-full min-h-screen bg-gray-100 flex justify-center -mt-1">
      <div className="w-107 min-h-screen bg-white flex flex-col">
        <div className="p-4 space-y-4 overflow-y-auto">
          <div className="rounded-2xl border border-blue-100 bg-white overflow-hidden">
            <div className="flex justify-between items-center px-4 py-3 bg-slate-50 rounded-lg">
              <div>
                <p className="text-[11px] text-gray-500">Customer ID</p>
                <p className="font-bold text-blue-700">
                  {isLoading ? "Loading..." : summary?.user_id || "N/A"}
                </p>
              </div>

              <div className="text-right">
                <p className="text-[11px] text-gray-500">Project</p>
                <p className="font-bold text-blue-700">
                  {customerBooking?.project_name || "N/A"}
                </p>
              </div>
            </div>

            <div className="px-4 py-3 border-b">
              <p className="text-[11px] text-gray-500">Customer Name</p>
              <p className="font-semibold text-gray-800">
                {summary?.user_name || "N/A"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 p-4 text-sm">
              <div className="p-3 rounded-xl bg-blue-50">
                <p className="text-xs text-gray-500">Plot Price</p>
                <p className="font-bold text-blue-700">
                  {formatCurrency(summary?.plot_price)}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-yellow-50">
                <p className="text-xs text-gray-500">Booking</p>
                <p className="font-bold text-yellow-600">
                  {formatCurrency(summary?.booking_money)}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-gray-50">
                <p className="text-xs text-gray-500">Down Payment</p>
                <p className="font-bold text-gray-700">
                  {formatCurrency(summary?.down_payment)}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-purple-50">
                <p className="text-xs text-gray-500">Installment</p>
                <p className="font-bold text-purple-700">
                  {formatCurrency(summary?.installment_amount)}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-green-50 col-span-2">
                <p className="text-xs text-gray-500">Total Paid</p>
                <p className="font-bold text-green-700">
                  {formatCurrency(summary?.total_paid_amount)}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-red-50 col-span-2">
                <p className="text-xs text-gray-500">Remaining</p>
                <p className="font-bold text-red-600">
                  {formatCurrency(summary?.remaining_amount)}
                </p>
              </div>
            </div>

            <div className="flex justify-between px-4 py-3 bg-slate-50 text-xs">
              <span className="text-gray-500">
                Last: {customerBooking?.last_entry_date || "N/A"}
              </span>
              <span className="font-semibold text-slate-800">
                Khata: {formatPlainNumber(summary?.plot_size_khata)}
              </span>
            </div>
          </div>
        </div>

        <section className="overflow-hidden rounded-[30px] bg-white shadow-sm border border-slate-100">
          <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100">
            <div>
              <h3 className="text-h3 font-extrabold text-[#00176b]">
                Transaction History
              </h3>
              <p className="text-[13px] text-slate-400">
                Recent backend payment totals
              </p>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <div className="rounded-3xl border border-slate-100 bg-[#f8fbff] p-4 shadow-sm">
              <div className="flex justify-between gap-3">
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 text-[#00176b] grid place-items-center">
                    <span className="material-symbols-outlined text-[28px]">
                      payments
                    </span>
                  </div>

                  <div>
                    <h4 className="text-[17px] font-bold text-[#00176b] leading-6">
                      Booking Money
                    </h4>

                    <p className="text-sm text-slate-500">
                      {customerBooking?.project_name || "Project"}
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-lg font-bold text-[#00176b]">
                {formatCurrency(summary?.booking_money)}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
              <h4 className="text-[17px] font-bold text-[#00176b] leading-6">
                Down Payment
              </h4>
              <p className="mt-4 text-lg font-bold text-[#00176b]">
                {formatCurrency(summary?.down_payment)}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
              <h4 className="text-[17px] font-bold text-[#00176b] leading-6">
                Installment
              </h4>
              <p className="mt-4 text-lg font-bold text-[#00176b]">
                {formatCurrency(summary?.installment_amount)}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PaymentHistory;
