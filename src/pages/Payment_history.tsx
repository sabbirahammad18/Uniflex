import { Link } from "react-router-dom";

const PaymentHistoryMobile = () => {
  const data = [
    {
      id: "UC00514",
      name: "Dr. Md. Delower Hossain",
      plotPrice: 4125000,
      bookingMoney: 100000,
      downPayment: 0,
      installment: 100000,
      totalPaid: 400000,
      remaining: 4025000,
      lastDate: "15 Sep 2025",
      khata: 5,
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-100 flex justify-center -mt-1">
      <div className="w-107 min-h-screen bg-white flex flex-col">
        <div className="p-4 space-y-4 overflow-y-auto">
          {data.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-blue-100 bg-white overflow-hidden"
            >
              {/* Top ID + Button */}
              <div className="flex justify-between items-center px-4 py-3 bg-slate-50 rounded-lg">
                {/* Customer ID */}
                <div>
                  <p className="text-[11px] text-gray-500">Customer ID</p>
                  <p className="font-bold text-blue-700">{item.id}</p>
                </div>

                {/* Installment No */}
                <div className="text-right">
                  <p className="text-[11px] text-gray-500">Installment No</p>
                  <p className="font-bold text-blue-700">05</p>
                </div>
              </div>

              {/* Name */}
              <div className="px-4 py-3 border-b">
                <p className="text-[11px] text-gray-500">Customer Name</p>
                <p className="font-semibold text-gray-800">{item.name}</p>
              </div>

              {/* Color Blocks */}
              <div className="grid grid-cols-2 gap-2 p-4 text-sm">
                <div className="p-3 rounded-xl bg-blue-50">
                  <p className="text-xs text-gray-500">Plot Price</p>
                  <p className="font-bold text-blue-700">
                    ৳{item.plotPrice.toLocaleString()}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-yellow-50">
                  <p className="text-xs text-gray-500">Booking</p>
                  <p className="font-bold text-yellow-600">
                    ৳{item.bookingMoney.toLocaleString()}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-gray-50">
                  <p className="text-xs text-gray-500">Down Payment</p>
                  <p className="font-bold text-gray-700">
                    ৳{item.downPayment.toLocaleString()}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-purple-50">
                  <p className="text-xs text-gray-500">Installment</p>
                  <p className="font-bold text-purple-700">
                    ৳{item.installment.toLocaleString()}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-green-50 col-span-2">
                  <p className="text-xs text-gray-500">Total Paid</p>
                  <p className="font-bold text-green-700">
                    ৳{item.totalPaid.toLocaleString()}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-red-50 col-span-2">
                  <p className="text-xs text-gray-500">Remaining</p>
                  <p className="font-bold text-red-600">
                    ৳{item.remaining.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between px-4 py-3 bg-slate-50 text-xs">
                <span className="text-gray-500">Last: {item.lastDate}</span>
                <span className="font-semibold text-slate-800">
                  Khata: {item.khata}
                </span>
              </div>
            </div>
          ))}
        </div>

        <section className="overflow-hidden rounded-[30px] bg-white shadow-sm border border-slate-100">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100">
            <div>
              <h3 className="text-h3 font-extrabold text-[#00176b]">
                Transaction History
              </h3>
              <p className="text-[13px] text-slate-400">
                Recent payment transactions
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button className="w-10 h-10 rounded-full bg-slate-100 active:scale-95 transition grid place-items-center">
                <span className="material-symbols-outlined text-slate-600">
                  tune
                </span>
              </button>

              <button className="w-10 h-10 rounded-full bg-slate-100 active:scale-95 transition grid place-items-center">
                <span className="material-symbols-outlined text-slate-600">
                  download
                </span>
              </button>
            </div>
          </div>

          {/* Transactions */}
          <div className="p-4 space-y-4">
            {/* Card 1 */}
            <div className="rounded-3xl border border-slate-100 bg-[#f8fbff] p-4 shadow-sm">
              <div className="flex justify-between gap-3">
                {/* Left */}
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 text-[#00176b] grid place-items-center">
                    <span className="material-symbols-outlined text-[28px]">
                      payments
                    </span>
                  </div>

                  <div>
                    <h4 className="text-[17px] font-bold text-[#00176b] leading-6">
                      Commission Payment
                    </h4>

                    <p className="text-sm text-slate-500">Project Phoenix</p>

                    <p className="text-xs mt-1 text-slate-400">TRX-7729103</p>
                  </div>
                </div>

                {/* Date */}
                <div className="text-right">
                  <p className="text-sm font-bold text-[#00176b]">24 Oct</p>
                  <p className="text-xs text-slate-400">02:45 PM</p>
                </div>
              </div>

              <Link to="/moneyreceipt">
                <button className="w-full mt-4 py-3 rounded-2xl bg-[#00176b] text-white font-bold active:scale-95 transition">
                  View Money Receipt
                </button>
              </Link>
            </div>

            {/* Card 2 */}
            <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex justify-between gap-3">
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 grid place-items-center">
                    <span className="material-symbols-outlined text-[28px]">
                      account_balance
                    </span>
                  </div>

                  <div>
                    <h4 className="text-[17px] font-bold text-[#00176b] leading-6">
                      Withdrawal to Bank
                    </h4>

                    <p className="text-sm text-slate-500">DBBL Account</p>

                    <p className="text-xs mt-1 text-slate-400">TRX-7728841</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-bold text-[#00176b]">22 Oct</p>
                  <p className="text-xs text-slate-400">11:15 AM</p>
                </div>
              </div>

              <Link to="/moneyreceipt">
                <button className="w-full mt-4 py-3 rounded-2xl border-2 border-[#00176b] text-[#00176b] font-bold active:scale-95 transition">
                  View Money Receipt
                </button>
              </Link>
            </div>

            {/* Card 3 */}
            <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex justify-between gap-3">
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-600 grid place-items-center">
                    <span className="material-symbols-outlined text-[28px]">
                      receipt_long
                    </span>
                  </div>

                  <div>
                    <h4 className="text-[17px] font-bold text-[#00176b] leading-6">
                      Booking Fee
                    </h4>

                    <p className="text-sm text-slate-500">Client A</p>

                    <p className="text-xs mt-1 text-slate-400">TRX-7725519</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-bold text-[#00176b]">19 Oct</p>
                  <p className="text-xs text-slate-400">09:00 AM</p>
                </div>
              </div>

              <Link to="/moneyreceipt">
                <button className="w-full mt-4 py-3 rounded-2xl border-2 border-[#00176b] text-[#00176b] font-bold active:scale-95 transition">
                  View Money Receipt
                </button>
              </Link>
            </div>
          </div>

          {/* Footer */}
        </section>
      </div>
    </div>
  );
};

export default PaymentHistoryMobile;
