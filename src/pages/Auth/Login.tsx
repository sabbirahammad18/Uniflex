import { Link } from "react-router";

const Login = () => {
  return (
    <div className="bg-white min-h-screen  font-inter text-slate-950">
      <main className="relative mx-auto flex min-h-dvh w-full max-w-107 flex-col bg-white px-5 py-7 shadow-lg overflow-hidden">
        <section className="mt-8 grid grid-cols-1">
          <form className="grid grid-cols-1 gap-5">
            <div>
              <label className="mb-2 ml-2 block text-xs font-semibold text-slate-600">
                User ID
              </label>

              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[22px] text-slate-400">
                  person
                </span>
                <input
                  className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-secondary focus:bg-white focus:ring-4 focus:ring-sky-100"
                  placeholder="10001"
                  type="text"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between px-1">
                <label className="block text-xs font-semibold text-slate-600">
                  Password
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
                <Link
                  to="/forget"
                  className="text-xs font-semibold text-secondary hover:underline absolute right-2 top-full mt-1"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <Link to="/profile" className="block">
              <button
                className="flex mt-4 h-14 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#07277f] to-[#263f96] text-lg font-bold text-white shadow-lg active:scale-[0.98] transition-all"
                type="submit"
              >
                Login
                <span className="material-symbols-outlined text-[22px]">
                  arrow_forward
                </span>
              </button>
            </Link>

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-1"></div>
          </form>
        </section>

        <footer className="mt-auto pb-3 pt-10 flex items-center justify-center">
          <p className="text-[11px] font-mono tracking-wider text-slate-400">
            Developed by HSBLCO V2.1
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Login;
