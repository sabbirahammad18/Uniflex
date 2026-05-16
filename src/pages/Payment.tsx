import { Link } from "react-router-dom";

const Payments = () => {
  return (
    <div className="bg-white mx-auto w-full max-w-107.5 min-h-screen pb-24 font-sans text-slate-950">
      <main className="mx-auto w-full max-w-107.5 px-4 py-6 grid grid-cols-1 gap-5">
        <section className="relative overflow-hidden rounded-3xl bg-white border border-blue-100 p-5 -mt-3">
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full  blur-2xl" />
          <div className="absolute -left-12 -bottom-12 h-32 w-32 rounded-full blur-2xl" />

          <div className="relative z-10 grid grid-cols-1 gap-5">
            <div>
              <p className="grid grid-cols-[auto_1fr] items-center gap-2 text-sm text-slate-500">
                <span className="material-symbols-outlined text-body-lg">
                  account_balance_wallet
                </span>
                Current Balance
              </p>
              <h2 className="mt-2 text-numeral-xl leading-none font-extrabold tracking-tight text-[#00176b]">
                &#2547;12,450.80
              </h2>
              <div className="mt-3 grid grid-cols-1 gap-2">
                <span className="w-fit rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                  +14.2% this month
                </span>
                <span className="text-xs text-slate-400">
                  Updated 2 mins ago
                </span>
              </div>
            </div>

            <Link to="/request">
              <button className="h-13 w-full rounded-2xl bg-linear-to-r from-[#07277f] to-blue-700 text-white font-extrabold shadow-lg grid grid-cols-[auto_auto] items-center justify-center gap-2 active:scale-[0.98] transition">
                <span className="material-symbols-outlined text-[21px]">
                  payments
                </span>
                Payment Request
              </button>
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4">
          <h3 className="px-1 text-xl font-extrabold text-slate-950">
            Recent Transactions
          </h3>

          <article className="rounded-2xl bg-white border border-blue-100 p-4  grid grid-cols-[48px_1fr] gap-3">
            <div className="h-12 w-12 rounded-xl bg-blue-50 grid place-items-center text-[#00176b]">
              <span className="material-symbols-outlined text-[23px]">
                check_circle
              </span>
            </div>
            <div className="min-w-0 grid grid-cols-1 gap-3">
              <div>
                <h4 className="text-sm font-extrabold leading-5 text-[#00176b]">
                  Residential Commission - Skyway Heights
                </h4>
                <div className="mt-2 grid grid-cols-1 gap-1 text-xs text-slate-500">
                  <p className="grid grid-cols-[auto_1fr] items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">
                      calendar_today
                    </span>
                    Oct 12, 2023
                  </p>
                  <p className="grid grid-cols-[auto_1fr] items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">
                      fingerprint
                    </span>
                    #TXN-99821
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                <p className="text-lg font-extrabold text-[#00176b]">
                  +&#2547; 3,240.00
                </p>
                <span className="rounded-full bg-green-100 px-2 py-1 text-[10px] font-bold text-green-700">
                  Completed
                </span>
              </div>
            </div>
          </article>

          <article className="rounded-2xl bg-white border border-blue-100 p-4 grid grid-cols-[48px_1fr] gap-3">
            <div className="h-12 w-12 rounded-xl bg-blue-50 grid place-items-center text-[#00176b]">
              <span className="material-symbols-outlined text-[23px]">
                check_circle
              </span>
            </div>
            <div className="min-w-0 grid grid-cols-1 gap-3">
              <div>
                <h4 className="text-sm font-extrabold leading-5 text-[#00176b]">
                  Leasing Bonus - Downtown Plaza
                </h4>
                <div className="mt-2 grid grid-cols-1 gap-1 text-xs text-slate-500">
                  <p className="grid grid-cols-[auto_1fr] items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">
                      calendar_today
                    </span>
                    Oct 08, 2023
                  </p>
                  <p className="grid grid-cols-[auto_1fr] items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">
                      fingerprint
                    </span>
                    #TXN-99754
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                <p className="text-lg font-extrabold text-[#00176b]">
                  +&#2547; 1,150.00
                </p>
                <span className="rounded-full bg-green-100 px-2 py-1 text-[10px] font-bold text-green-700">
                  Completed
                </span>
              </div>
            </div>
          </article>

          <article className="rounded-2xl bg-white border border-blue-100 p-4 grid grid-cols-[48px_1fr] gap-3">
            <div className="h-12 w-12 rounded-xl bg-blue-50 grid place-items-center text-[#00176b]">
              <span className="material-symbols-outlined text-[23px]">
                check_circle
              </span>
            </div>
            <div className="min-w-0 grid grid-cols-1 gap-3">
              <div>
                <h4 className="text-sm font-extrabold leading-5 text-[#00176b]">
                  Referral Reward - Platinum Tier
                </h4>
                <div className="mt-2 grid grid-cols-1 gap-1 text-xs text-slate-500">
                  <p className="grid grid-cols-[auto_1fr] items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">
                      calendar_today
                    </span>
                    Sep 28, 2023
                  </p>
                  <p className="grid grid-cols-[auto_1fr] items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">
                      fingerprint
                    </span>
                    #TXN-99412
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                <p className="text-lg font-extrabold text-[#00176b]">
                  +&#2547; 500.00
                </p>
                <span className="rounded-full bg-green-100 px-2 py-1 text-[10px] font-bold text-green-700">
                  Completed
                </span>
              </div>
            </div>
          </article>

          <article className="rounded-2xl bg-white border border-blue-100 p-4 grid grid-cols-[48px_1fr] gap-3">
            <div className="h-12 w-12 rounded-xl bg-blue-50 grid place-items-center text-[#00176b]">
              <span className="material-symbols-outlined text-[23px]">
                check_circle
              </span>
            </div>
            <div className="min-w-0 grid grid-cols-1 gap-3">
              <div>
                <h4 className="text-sm font-extrabold leading-5 text-[#00176b]">
                  Annual Performance Bonus
                </h4>
                <div className="mt-2 grid grid-cols-1 gap-1 text-xs text-slate-500">
                  <p className="grid grid-cols-[auto_1fr] items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">
                      calendar_today
                    </span>
                    Sep 15, 2023
                  </p>
                  <p className="grid grid-cols-[auto_1fr] items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">
                      fingerprint
                    </span>
                    #TXN-99105
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                <p className="text-lg font-extrabold text-[#00176b]">
                  +&#2547; 7,560.80
                </p>
                <span className="rounded-full bg-green-100 px-2 py-1 text-[10px] font-bold text-green-700">
                  Completed
                </span>
              </div>
            </div>
          </article>

          <button className="h-13 rounded-2xl border-2 border-dashed border-slate-200 bg-white text-[#00176b] font-bold grid grid-cols-[auto_auto] items-center justify-center gap-2 active:scale-[0.98] transition">
            Load More History
            <span className="material-symbols-outlined text-h3">
              expand_more
            </span>
          </button>
        </section>

        <aside className="grid grid-cols-1 gap-5">
          <section className="relative overflow-hidden rounded-3xl bg-[#07277f] p-6 text-white shadow-xl">
            <img
              alt="Growth graph"
              className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-overlay"
              src="https://images.unsplash.com/photo-1642790551116-18e150f248e5?auto=format&fit=crop&w=900&q=80"
            />
            <div className="relative z-10">
              <h4 className="text-xl font-extrabold">Earnings Insight</h4>
              <p className="mt-1 text-sm leading-5 text-blue-200">
                You have earned 22% more than last quarter. Keep it up!
              </p>

              <div className="mt-6 border-t border-blue-800 pt-5">
                <div className="mb-2 grid grid-cols-2 items-center text-sm font-bold">
                  <span className="text-blue-200">Tier Progress</span>
                  <span className="justify-self-end">85%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-blue-900">
                  <div className="h-full w-[85%] bg-sky-300" />
                </div>
                <p className="mt-2 text-[10px] text-blue-300">
                  Just $5,000 away from Diamond Tier rewards.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-white border border-blue-100 p-5">
            <h4 className="text-xl font-extrabold text-slate-950">
              Payment Methods
            </h4>

            <div className="mt-4 grid grid-cols-1 gap-3">
              <div className="rounded-xl border border-slate-100 p-3 grid grid-cols-[1fr_auto] items-center gap-3">
                <div className="grid grid-cols-[40px_1fr] items-center gap-3">
                  <div className="h-6 w-10 rounded bg-slate-900 text-[10px] font-bold text-white grid place-items-center">
                    VISA
                  </div>
                  <p className="text-sm font-semibold">•••• 4421</p>
                </div>
                <span className="rounded bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700">
                  Primary
                </span>
              </div>

              <div className="rounded-xl border border-slate-100 p-3 grid grid-cols-[1fr_auto] items-center gap-3">
                <div className="grid grid-cols-[40px_1fr] items-center gap-3">
                  <div className="h-6 w-10 rounded bg-slate-100 text-[10px] font-bold text-slate-600 grid place-items-center">
                    BANK
                  </div>
                  <p className="text-sm font-semibold">Checking •••• 1092</p>
                </div>
                <button className="text-[10px] font-bold text-[#00176b]">
                  Manage
                </button>
              </div>
            </div>

            <button className="mt-4 h-11 w-full rounded-xl text-[#00176b] font-bold grid grid-cols-[auto_auto] items-center justify-center gap-1 active:scale-[0.98] transition">
              <span className="material-symbols-outlined text-body-lg">
                add
              </span>
              Add Method
            </button>
          </section>
        </aside>
      </main>
    </div>
  );
};

export default Payments;
