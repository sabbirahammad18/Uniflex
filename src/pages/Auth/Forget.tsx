import { Link } from "react-router";

const Forget = () => {
  return (
    
      <div className="lex flex-1 flex-col font-inter text-slate-950">
        <section className="mt-8 grid grid-cols-1">
          <form className="grid grid-cols-1 gap-5">
            <div>
              <div className="mb-2 flex items-center justify-between px-1">
                <label className="block text-xs font-semibold text-slate-600">
                  New Password
                </label>
              </div>

              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[22px] text-slate-400">
                  lock
                </span>

                <input
                  className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-12 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-secondary focus:bg-white focus:ring-4 focus:ring-sky-100"
                  placeholder="••••••••"
                  type="password"
                />

                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 active:scale-95 transition"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[22px] mt-1.5">
                    visibility
                  </span>
                </button>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between px-1">
                <label className="block text-xs font-semibold text-slate-600">
                  Confirm Password
                </label>
              </div>

              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[22px] text-slate-400">
                  lock
                </span>

                <input
                  className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-12 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-secondary focus:bg-white focus:ring-4 focus:ring-sky-100"
                  placeholder="••••••••"
                  type="password"
                />

                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 active:scale-95 transition"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[22px] mt-1.5">
                    visibility
                  </span>
                </button>
                {/* <Link
                  to="/"
                  className="text-xs font-semibold text-secondary hover:underline absolute right-2 top-full mt-1"
                >
                  Back To Login
                </Link> */}
              </div>
            </div>

            <Link to="/" className="block">
              <button
                className="flex mt-4 h-14 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#07277f] to-[#263f96] text-lg font-bold text-white shadow-lg active:scale-[0.98] transition-all"
                type="submit"
              >
                Reset Password
                <span className="material-symbols-outlined text-[22px]">
                  arrow_forward
                </span>
              </button>
            </Link>
          </form>
        </section>
      <div/>
    </div>
  );
};

export default Forget;
