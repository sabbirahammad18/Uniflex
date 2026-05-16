import { Link, useLocation } from "react-router";
import img from "../assets/images/download.jpg";
const Profile_Customer = () => {
  const location = useLocation();

  const { customerName, customerId, customerDate, customerBalance } =
    location.state || {};
  const data = [
    {
      id: "UC00514",
      name: "Mohammad Hasan Sajjad",
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
    <div className="bg-white min-h-screen pb-24 font-sans text-slate-950">
      <main className="mx-auto w-full max-w-107.5 px-4 py-8 space-y-6">
        {/* PROFILE SECTION (NO DESIGN CHANGE) */}
        <section className="grid grid-cols-1 rounded-xl bg-white  -mt-9 p-6">
          <div className="grid grid-cols-[96px_1fr] items-center gap-5">
            <div className="relative">
              <img
                alt="Agent Profile"
                className="w-21 h-21 rounded-full object-cover border-2 border-blue-900 mb-5 shadow-lg"
                src={img}
              />
            </div>

            <div className="">
              <h2 className="text-h2 leading-6 font-extrabold text-[#00176b] tracking-tight ">
                {customerName || "Mohammad Hasan Sajjad"}
              </h2>

              <div className="mt-2 flex items-center gap-2">
                <span className="rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                  Customer
                </span>

                <span className="text-sm text-slate-400">
                  ID: {customerId || "UC000120"}
                </span>
              </div>

              <div className="mt-2 text-sm text-slate-400">
                {customerDate || ""}
              </div>
            </div>
          </div>
        </section>

        {/* BALANCE SECTION (NO DESIGN CHANGE) */}
        <header className="rounded-xl bg-[#07277F] p-6 text-white -mt-10">
          <p className="text-sm text-white/45 font-medium">Due Balance</p>

          <Link
            to="/customerpayment"
            className="text-sm font-medium text-white/70 mt-1"
          >
            <h3 className="mt-1 text-[38px] leading-none font-extrabold tracking-tight text-[#9cb4ff]">
              {customerBalance || "442,850.00"}
            </h3>
          </Link>

          <div className="mt-6 flex items-center gap-2 text-emerald-300">
            <span className="material-symbols-outlined text-[23px]">
              trending_up
            </span>
            <span className="text-sm font-bold">+12.5% this month</span>
          </div>
        </header>

        <div className="w-full min-h-screen bg-gray-100 flex justify-center -mt-6">
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
                      <p className="text-[11px] text-gray-500">
                        Installment No
                      </p>
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

                        <p className="text-sm text-slate-500">
                          Project Phoenix
                        </p>

                        <p className="text-xs mt-1 text-slate-400">
                          TRX-7729103
                        </p>
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

                        <p className="text-xs mt-1 text-slate-400">
                          TRX-7728841
                        </p>
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

                        <p className="text-xs mt-1 text-slate-400">
                          TRX-7725519
                        </p>
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
              <div className="px-5 pb-5">
                <Link to="/allstatement">
                  <button className="w-full py-4 rounded-[20px] bg-slate-100 text-[#00176b] font-extrabold active:scale-95 transition">
                    View Full Statement
                  </button>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile_Customer;
