import img from "../assets/images/2024-06-06.webp";
const ProjectPortfolio = () => {
  return (
    <div className="bg-white min-h-screen pb-24 font-sans text-slate-950 -mt-5">
      <main className="mx-auto w-full max-w-107.5 px-4 py-8 grid grid-cols-1 gap-5 ">
        <section className="grid grid-cols-1 gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-[#00176b] tracking-tight">
              Project Portfolio
            </h2>
            <p className="mt-1 text-sm leading-5 text-slate-500">
              Manage your active listings and track your commission performance.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[21px] text-slate-400">
                search
              </span>
              <input
                className="h-13 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-secondary focus:ring-4 focus:ring-sky-100"
                placeholder="Search by project name..."
                type="text"
              />
            </div>
          </div>
        </section>

        <section className="grid grid-flow-col auto-cols-max gap-2 overflow-x-auto rounded-2xl bg-slate-100 p-1.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button className="rounded-xl bg-white px-5 py-2 text-sm font-bold text-[#00176b] shadow-sm">
            All
          </button>
          <button className="rounded-xl px-5 py-2 text-sm font-bold text-slate-500">
            Running
          </button>
          <button className="rounded-xl px-5 py-2 text-sm font-bold text-slate-500">
            Completed
          </button>
          <button className="rounded-xl px-5 py-2 text-sm font-bold text-slate-500 -ml-5">
            Up Comming
          </button>
        </section>

        <section className="grid grid-cols-1 gap-5">
          <article className="overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-sm grid grid-cols-1">
            <div className="h-44 overflow-hidden">
              <img
                className="h-full w-full object-cover"
                alt="Luxury Residency Phase II"
                src={img}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 p-5">
              <div className="grid grid-cols-[1fr_auto] gap-3 items-start">
                <div className="min-w-0">
                  <span className="inline-flex w-fit rounded-full bg-blue-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#00176b]">
                    Active
                  </span>
                  <h3 className="mt-3 text-xl leading-6 font-extrabold text-[#00176b]">
                    Uniflex VIP Zone
                  </h3>
                  <div className="mt-1 grid grid-cols-[auto_1fr] items-center gap-1 text-slate-500">
                    <span className="material-symbols-outlined text-body-md">
                      location_on
                    </span>
                    <p className="text-sm truncate mt-4">
                      Fareast Tower, (Level-12) 35 Topkhana Road
                      <br />
                      urana Paltan, Dhaka - 1000.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-slate-500">Project Milestone</span>
                  <span className="text-right font-extrabold text-[#00176b]">
                    75%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-[75%] rounded-full bg-[#07277f]" />
                </div>
              </div>

              <div className="grid grid-cols-[auto_1fr] items-center gap-3 pt-1">
                <div className="flex -space-x-2">
                  <div className="h-8 w-8 rounded-full border-2 border-white bg-slate-200" />
                  <div className="h-8 w-8 rounded-full border-2 border-white bg-sky-200" />
                  <div className="h-8 w-8 rounded-full border-2 border-white bg-blue-200" />
                </div>
                <button className="justify-self-end grid grid-cols-[auto_auto] items-center gap-1 text-sm font-bold text-[#00176b]">
                  View Details
                  <span className="material-symbols-outlined text-body-lg">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
};

export default ProjectPortfolio;
