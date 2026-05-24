import { Link } from "react-router-dom";
import { useGetBookingsQuery } from "@/queries/bookingQuery";
import { formatCurrency, formatPlainNumber } from "@/utils/format";

function CustomerHistory() {
  const { data, isLoading, isError } = useGetBookingsQuery();
  const bookings = data?.data || [];

  return (
    <div className="w-full flex justify-center bg-gray-50">
      <div className="w-107 min-h-screen bg-white flex flex-col">
        <div className="p-5 bg-[#07277F] text-white">
          <h1 className="text-lg font-bold">Customer Timeline</h1>
          <p className="text-xs opacity-80">Booking and payment summary</p>
        </div>

        <div className="p-5 space-y-6 relative">
          <div className="absolute left-7 top-6 bottom-6 w-0.5 bg-gray-200" />

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

          {!isLoading && !isError && bookings.length === 0 && (
            <p className="rounded-xl bg-slate-50 p-4 text-sm font-bold text-slate-600">
              No customer bookings found.
            </p>
          )}

          {bookings.map((item) => {
            const paid = item.remaining_amount <= 0;

            return (
              <div key={item.booking_id} className="flex items-start gap-4 relative">
                <div
                  className={`w-4 h-4 rounded-full mt-1 z-10 border-2 border-white shadow ${
                    paid ? "bg-green-500" : "bg-yellow-400"
                  }`}
                />

                <div className="flex-1 bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between items-center gap-3">
                    <Link to={`/booking/${item.booking_id}`}>
                      <h2 className="font-semibold text-[#07277F] text-sm hover:underline cursor-pointer">
                        {item.user_name || "Customer"}
                      </h2>
                    </Link>

                    <span
                      className={`text-[10px] px-2 py-1 rounded-full font-semibold ${
                        paid
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {paid ? "Paid" : "Due"}
                    </span>
                  </div>

                  <div className="mt-2 flex justify-between text-xs text-gray-500">
                    <span>{item.customer_uid || "N/A"}</span>
                    <span>{formatPlainNumber(item.plot_size_khata)} Khata</span>
                  </div>

                  <div className="mt-3 flex justify-between items-center gap-3">
                    <p className="font-bold text-[#07277F]">
                      {formatCurrency(item.remaining_amount)}
                    </p>
                    <Link to={`/booking/${item.booking_id}`}>
                      <button className="text-[10px] bg-[#07277F] text-white px-3 py-1 rounded-md">
                        Payment Details
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CustomerHistory;
