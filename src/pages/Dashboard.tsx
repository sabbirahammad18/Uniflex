const Dashboard = () => {
  return (
    <div className="bg-white min-h-screen pb-24 font-sans text-slate-950">
      <main className="mx-auto w-full max-w-107.5 px-3 py-3 space-y-4">
        <section className="grid grid-cols-1 gap-3">
          <div className="rounded-xl  p-4 min-h-23 border border-green-100  border-l-4 border-l-green-500">
            <div className="flex items-start justify-between gap-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500 font-medium">
                Total Commission
              </p>
              <span className="material-symbols-outlined text-body-lg p-1.5 rounded-lg text-green-600 bg-green-50">
                trending_up
              </span>
            </div>
            <h2 className="mt-2 text-[28px] leading-none font-extrabold tracking-tight">
              &#2547; 42,850
            </h2>
            <p className="mt-1 text-[11px] text-green-600">
              +12.5% vs last month
            </p>
          </div>

          <div className="rounded-xl bg-white p-4 min-h-23 border border-orange-100 border-l-4 border-l-orange-400">
            <div className="flex items-start justify-between gap-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500 font-medium">
                Pending Payments
              </p>
              <span className="material-symbols-outlined text-body-lg p-1.5 rounded-lg text-orange-600 bg-orange-50">
                schedule
              </span>
            </div>
            <h2 className="mt-2 text-[28px] leading-none font-extrabold tracking-tight">
              &#2547; 3,120
            </h2>
            <p className="mt-1 text-[11px] text-slate-500">
              4 invoices awaiting approval
            </p>
          </div>

          <div className="rounded-xl bg-white p-4 min-h-23 border border-blue-100 border-l-4 border-l-[#07277f]">
            <div className="flex items-start justify-between gap-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500 font-medium">
                Active Projects
              </p>
              <span className="material-symbols-outlined text-body-lg p-1.5 rounded-lg text-[#07277f] bg-blue-50">
                assignment
              </span>
            </div>
            <h2 className="mt-2 text-[28px] leading-none font-extrabold tracking-tight">
              24
            </h2>
            <p className="mt-1 text-[11px] text-slate-500">
              Across 12 global regions
            </p>
          </div>

          <div className="rounded-xl bg-white p-4 min-h-23 border border-blue-100 border-l-4 border-l-secondary">
            <div className="flex items-start justify-between gap-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500 font-medium">
                Total Bookings
              </p>
              <span className="material-symbols-outlined text-body-lg p-1.5 rounded-lg text-secondary bg-sky-50">
                event_available
              </span>
            </div>
            <h2 className="mt-2 text-[28px] leading-none font-extrabold tracking-tight">
              158
            </h2>
            <p className="mt-1 text-[11px] text-slate-500">
              Lifetime client conversions
            </p>
          </div>
        </section>

        <section className="rounded-xl bg-white p-4 border border-blue-100">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-extrabold text-[#07277f] leading-tight">
                Earnings
                <br />
                Growth
              </h3>
              <p className="mt-1 text-[11px] text-slate-500">
                Performance visualization for current fiscal year
              </p>
            </div>
            <button className="rounded-lg bg-blue-50 px-3 py-1 text-[10px] font-medium text-[#07277f]">
              Last 6 Months
            </button>
          </div>

          <div className="mt-4 h-44 rounded-xl bg-slate-50 border border-blue-100 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-b from-sky-50 to-transparent" />
            <svg
              className="absolute inset-x-4 bottom-5 h-32 w-[calc(100%-2rem)]"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path
                d="M0 82 Q 22 58, 45 68 T 80 42 T 100 20 L 100 100 L 0 100 Z"
                fill="rgba(57,184,253,.12)"
              />
              <path
                d="M0 82 Q 22 58, 45 68 T 80 42 T 100 20"
                fill="none"
                stroke="#006591"
                strokeWidth="2.3"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between text-[8px] text-slate-400 font-mono">
              <span>JAN</span>
              <span>FEB</span>
              <span>MAR</span>
              <span>APR</span>
              <span>MAY</span>
              <span>JUN</span>
            </div>
          </div>
        </section>

        {/* <section>
          <h3 className="mb-2 px-1 text-sm font-extrabold text-[#07277f]">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 gap-2">
            <button className="w-full rounded-xl border p-3 flex items-center gap-3 text-left active:scale-[0.98] transition bg-[#07277f] text-white border-[#07277f] shadow-lg">
              <span className="material-symbols-outlined p-2 rounded-lg text-[19px] bg-white/20 text-white">
                add_box
              </span>
              <span>
                <span className="block text-xs font-bold">New Booking</span>
                <span className="block text-[10px] text-white/75">
                  Initialize client reservation
                </span>
              </span>
            </button>
            <button className="w-full rounded-xl border p-3 flex items-center gap-3 text-left active:scale-[0.98] transition bg-white text-[#07277f] border-blue-100 shadow-sm">
              <span className="material-symbols-outlined p-2 rounded-lg text-[19px] bg-blue-100 text-[#07277f]">
                create_new_folder
              </span>
              <span>
                <span className="block text-xs font-bold">Add Project</span>
                <span className="block text-[10px] text-slate-500">
                  Register new commission track
                </span>
              </span>
            </button>
            <button className="w-full rounded-xl border p-3 flex items-center gap-3 text-left active:scale-[0.98] transition bg-white text-[#07277f] border-blue-100 shadow-sm">
              <span className="material-symbols-outlined p-2 rounded-lg text-[19px] bg-blue-100 text-[#07277f]">
                payments
              </span>
              <span>
                <span className="block text-xs font-bold">Request Payout</span>
                <span className="block text-[10px] text-slate-500">
                  Withdraw available commission
                </span>
              </span>
            </button>
          </div>
        </section> */}

        <section className="rounded-xl bg-linear-to-br from-white to-blue-50 p-4 border border-blue-100">
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#07277f] font-medium">
            Monthly Target Achievement
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-[#07277f]">
            <span> Marketing Officer</span>
            <span>75%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-blue-100 overflow-hidden">
            <div className="h-full w-3/4 rounded-full bg-[#07277f]" />
          </div>
          <p className="mt-2 text-center text-[10px] text-slate-500">
            &#2547; 15,000 more to unlock 5% bonus
          </p>
        </section>

        <section className="relative min-h-72.5 overflow-hidden rounded-xl bg-[#07277f] p-4 text-white shadow-xl flex items-end">
          <img
            alt="Corporate Growth Background"
            className="absolute inset-0 h-full w-full object-cover opacity-25 mix-blend-overlay"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyWWt65f1oPK2vpHplFqTYvkJQ-3Z7l0FBa-qlWqRhUst5HsmdOjks0dHf0v1d8AfQjVsGd15ZrDbFuqt5GhMUNgHbjhaaqSPKK9QHYegMOeSjZNNiaQonKFHvYC3ESdIjOhOI_2RR_0t24eU9ruVBf-fCOC6gtQdanvuQOsxXyZjSvuwfYklAV0T_VXHXrP7B5psdts2Wn6IczMhD6jriXc8zTEsw0yEAKzJFGFWTh-dd-6LQCJ6VT7uqXtRpRZfyHOR8TeiQgA"
          />
          <div className="relative z-10">
            <span className="inline-block rounded-full bg-sky-300 px-3 py-1 text-[9px] font-extrabold uppercase tracking-widest text-[#07277f]">
              Premium Offer
            </span>
            <h2 className="mt-3 text-2xl font-extrabold leading-tight">
              Grow your portfolio with HSBLCO V2.1
            </h2>
            <p className="mt-2 text-xs leading-5 text-white/90">
              Unlock exclusive access to high-yield offshore projects and
              increase your base commission by 2.5% on all bookings this
              quarter.
            </p>
            <button className="mt-5 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-[#07277f] active:scale-95 transition">
              Learn More
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
