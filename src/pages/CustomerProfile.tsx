import { Link, useLocation } from "react-router";
import img from "../assets/images/download.jpg";
import PaymentHistory from "./PaymentComponent/PaymentHistory";
const CustomerProfile = () => {
  const location = useLocation();

  const { customerName, customerId, customerDate, customerBalance } =
    location.state || {};
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
        
           <PaymentHistory />
      </main>
    </div>
  );
};

export default CustomerProfile;
