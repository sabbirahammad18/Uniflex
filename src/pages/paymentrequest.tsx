import { useState } from "react";

const BalanceRequestCard = () => {
  const currentBalance = 12450.8;
  const [requestBalance, setRequestBalance] = useState("");
  const [method, setMethod] = useState("");

  const requestAmount = Number(requestBalance) || 0;
  const remainingBalance = Math.max(currentBalance - requestAmount, 0);

  return (
    <div className="w-full max-w-107.5 p-3">
      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 h-40 w-full bg-[#07277F]  rounded-sm" />
        <div className="absolute -right-12 -top-12 h-40 w-40" />
        <div className="absolute left-8 top-24 h-20 w-20" />

        <div className="relative z-10 p-5">
          <div className="flex items-center justify-between text-white">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
                Current Balance
              </p>
              <h2 className="mt-2 text-4xl font-black tracking-tight">
                ৳{currentBalance.toLocaleString("en-US")}
              </h2>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
              <span className="material-symbols-outlined text-3xl">
                account_balance_wallet
              </span>
            </div>
          </div>

          <div className="mt-5 inline-flex rounded-full bg-white/20 px-4 py-2 text-xs font-bold text-white backdrop-blur">
            +14.2% this month
          </div>
        </div>

        <div className="relative z-10 mt-6 space-y-4 rounded-t-[34px] bg-white p-5">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Request Balance
            </label>

            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-1 focus-within:border-[#1239d8] focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
              <span className="text-xl font-black text-[#00176b]">৳</span>

              <input
                type="number"
                value={requestBalance}
                onChange={(e) => setRequestBalance(e.target.value)}
                placeholder="0.00"
                className="w-full bg-transparent px-3 py-4 text-lg font-extrabold text-slate-800 outline-none placeholder:text-slate-300"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Method
            </label>

            <div className="relative rounded border border-slate-200 bg-slate-50 px-4 shadow-inner focus-within:border-[#1239d8] focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full  appearance-none bg-transparent py-2 px-4  text-sm font-bold text-black-700 outline-none"
              >
                <option  value="">Select withdraw method</option>
                <option value="cash">Cash</option>
                <option value="bank">Bank</option>
                <option value="gateway">Gateway</option>
              </select>

              <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                expand_more
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-[#eef4ff] p-4 overflow-hidden">
              <p className="text-xs font-bold text-slate-500">Request</p>
              <h3 className="mt-1 text-xl font-black text-[#00176b]">
                ৳{requestAmount.toFixed(2)}
              </h3>
            </div>

            <div className="rounded-xl bg-[#ecfdf5] p-4 overflow-hidden">
              <p className="text-xs font-bold text-slate-500">Remaining</p>
              <h3 className="mt-1 text-xl font-black text-green-700">
                ৳{remainingBalance.toFixed(2)}
              </h3>
            </div>
          </div>

          <button
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#07277F] px-5 py-4 text-sm font-black text-white  hover:bg-[#00228f]"
            onClick={() =>
              console.log({
                currentBalance,
                requestAmount,
                method,
                remainingBalance,
              })
            }
          >
            Submit Request
            <span className="material-symbols-outlined text-lg">
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BalanceRequestCard;
