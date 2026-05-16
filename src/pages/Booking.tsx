import { Link } from "react-router-dom";

const BookingManagement = () => {
  return (
    <div className="bg-white mx-auto w-full max-w-107.5 min-h-screen pb-24 font-sans text-slate-950">
      <main className="mx-auto w-full max-w-107.5 px-4 py-6 grid grid-cols-1 gap-5">
        <section className="grid grid-cols-1 gap-4">
          <div>
            <p className="mb-1 text-[11px] font-extrabold uppercase tracking-[0.2em] text-secondary">
              Portfolio Management
            </p>
            <h2 className="text-2xl font-extrabold text-[#00176b] tracking-tight">
              Booking Management
            </h2>
          </div>

          <div className="grid grid-flow-col auto-cols-max gap-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button className="grid grid-cols-[auto_auto] items-center gap-1 rounded-full bg-[#07277f] px-2.5 py-1 text-label-md font-bold text-white shadow-sm">
              <span className="material-symbols-outlined  text-body-sm">
                list_alt
              </span>
              All Bookings
            </button>
            <button className="grid grid-cols-[auto_auto] items-center gap-1 rounded-full bg-white px-2.5 py-2 text-label-md  text-slate-500 border border-slate-100">
              <span className="material-symbols-outlined text-body-lg">
                pending_actions
              </span>
              Pending
            </button>
            <button className="grid grid-cols-[auto_auto] items-center gap-1 rounded-full bg-white px-2.5 py-2 text-label-md  text-slate-500 border border-slate-100">
              <span className="material-symbols-outlined text-body-lg">
                verified
              </span>
              Confirmed
            </button>
            <button className="grid grid-cols-[auto_auto] items-center gap-0.5 rounded-full bg-white px-2 py-2 text-label-md  text-slate-500 border border-slate-100">
              <span className="material-symbols-outlined text-body-lg">
                filter_list
              </span>
              Filters
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4">
          <article className="grid grid-cols-1 gap-5 rounded-2xl bg-white p-5 border border-orange-100 border-l-4 border-l-amber-500">
            <div className="grid grid-cols-[auto_auto] items-start justify-between">
              <div className="h-12 w-12 rounded-xl bg-slate-100 grid place-items-center text-[#00176b]">
                <span className="material-symbols-outlined text-h2">
                  apartment
                </span>
              </div>
              <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-extrabold text-amber-700">
                Pending
              </span>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-950">
                Skyline Apartments
              </h3>
              <p className="mt-1 grid grid-cols-[auto_1fr] items-center gap-1 text-sm text-slate-500">
                <span className="material-symbols-outlined text-body-md">
                  person
                </span>
                John Doe
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 grid grid-cols-[1fr_auto] items-center gap-3">
              <span className="text-sm text-slate-500">
                Expected Commission
              </span>
              <span className="text-xl font-extrabold text-[#00176b]">
                &#2547; 1,200
              </span>
            </div>

            <div className="grid grid-cols-[1fr_auto] gap-2">
              <Link to="/Moneyreceipt">
                <button className="h-11 w-70  rounded-xl bg-[#07277f] text-white font-bold grid grid-cols-[auto_auto] items-center justify-center gap-2 active:scale-[0.98] transition">
                  <span className="material-symbols-outlined text-body-lg">
                    check_circle
                  </span>
                  View
                </button>
              </Link>
              <button className="h-11 w-12 rounded-xl border border-red-200 text-red-600 grid place-items-center active:scale-95 transition">
                <span className="material-symbols-outlined text-body-lg">
                  close
                </span>
              </button>
            </div>
          </article>

          <article className="grid grid-cols-1 gap-5 rounded-2xl bg-white p-5 border border-green-100 border-l-4 border-l-emerald-500">
            <div className="grid grid-cols-[auto_auto] items-start justify-between">
              <div className="h-12 w-12 rounded-xl bg-slate-100 grid place-items-center text-[#00176b]">
                <span className="material-symbols-outlined text-h2">
                  home_work
                </span>
              </div>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-extrabold text-emerald-700">
                Confirmed
              </span>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-950">
                Ocean View Villas
              </h3>
              <p className="mt-1 grid grid-cols-[auto_1fr] items-center gap-1 text-sm text-slate-500">
                <span className="material-symbols-outlined text-body-md">
                  person
                </span>
                Sarah Jenkins
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 grid grid-cols-[1fr_auto] items-center gap-3">
              <span className="text-sm text-slate-500">Total Commission</span>
              <span className="text-xl font-extrabold text-secondary">
                &#2547; 3,450
              </span>
            </div>

            <Link to="/Moneyreceipt">
              <button className="h-11 w-90  rounded-xl border border-gray-400  text-black font-bold grid grid-cols-[auto_auto] items-center justify-center gap-2 active:scale-[0.98] transition">
                <span className="material-symbols-outlined text-body-lg">
                  check_circle
                </span>
                View
              </button>
            </Link>
          </article>

          <article className="grid grid-cols-1 gap-5 rounded-2xl bg-white p-5 border border-orange-100 border-l-4 border-l-amber-500">
            <div className="grid grid-cols-[auto_auto] items-start justify-between">
              <div className="h-12 w-12 rounded-xl bg-slate-100 grid place-items-center text-[#00176b]">
                <span className="material-symbols-outlined text-h2">deck</span>
              </div>
              <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-extrabold text-amber-700">
                Pending
              </span>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-950">
                Highland Retreat
              </h3>
              <p className="mt-1 grid grid-cols-[auto_1fr] items-center gap-1 text-sm text-slate-500">
                <span className="material-symbols-outlined text-body-md">
                  person
                </span>
                Marcus Thorne
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 grid grid-cols-[1fr_auto] items-center gap-3">
              <span className="text-sm text-slate-500">
                Expected Commission
              </span>
              <span className="text-xl font-extrabold text-[#00176b]">
                &#2547; 850
              </span>
            </div>

            <div className="grid grid-cols-[1fr_auto] gap-2">
              <Link to="/Moneyreceipt">
                <button className="h-11 w-70  rounded-xl bg-[#07277f] text-white font-bold grid grid-cols-[auto_auto] items-center justify-center gap-2 active:scale-[0.98] transition">
                  <span className="material-symbols-outlined text-body-lg">
                    check_circle
                  </span>
                  View
                </button>
              </Link>
              <button className="h-11 w-12 rounded-xl border border-red-200 text-red-600 grid place-items-center active:scale-95 transition">
                <span className="material-symbols-outlined text-body-lg">
                  close
                </span>
              </button>
            </div>
          </article>

          <article className="rounded-2xl bg-blue-50 p-5 border border-blue-100">
            <div className="grid grid-cols-2 items-center mb-4">
              <span className="text-[11px] font-extrabold uppercase text-[#00176b]">
                Monthly Goal
              </span>
              <span className="justify-self-end text-sm font-extrabold text-[#00176b]">
                75%
              </span>
            </div>

            <div className="mb-5 h-2 w-full overflow-hidden rounded-full bg-blue-100">
              <div className="h-full w-[75%] rounded-full bg-[#07277f]" />
            </div>

            <div className="grid grid-cols-[48px_1fr] items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-white grid place-items-center text-[#00176b]">
                <span className="material-symbols-outlined text-h2">
                  trending_up
                </span>
              </div>
              <div>
                <p className="text-xl font-extrabold text-[#00176b]">
                  &#2547; 12,400
                </p>
                <p className="text-sm text-slate-500">Pending Settlements</p>
              </div>
            </div>
          </article>

          <button className="h-14 rounded-2xl border-2 border-dashed border-slate-200 bg-white text-slate-500 font-bold grid grid-cols-[auto_auto] items-center justify-center gap-2 active:scale-[0.98] transition">
            <span className="material-symbols-outlined text-[22px]">
              autorenew
            </span>
            Load more bookings
          </button>
        </section>
      </main>

      
    </div>
  );
};

export default BookingManagement;
