import { Link } from "react-router";

const Number = () => {
  return (
    <div className="bg-white min-h-screen font-inter text-slate-950">
      <main className="relative mx-auto flex min-h-dvh w-full max-w-107.5 flex-col bg-white px-5 py-7 shadow-lg overflow-hidden">
        {/* Logo Section */}

        {/* Form Section */}
        <section className="mt-8 grid grid-cols-1">
          <form className="grid grid-cols-1 gap-5">
            <div>
              <label className="mb-2 ml-2 block text-xs font-semibold text-slate-600">
                Enter Mobile Number
              </label>

              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[22px] text-slate-400">
                  phone
                </span>

                <input
                  className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-secondary focus:bg-white focus:ring-4 focus:ring-sky-100"
                  placeholder="+01*********"
                  type="text"
                />
              </div>
            </div>

            <Link to="/auth/otp" className="block">
              <button
                className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#07277f] to-[#263f96] text-base font-bold text-white shadow-lg active:scale-[0.98] transition-all"
                type="submit"
              >
                Send Code
                <span className="material-symbols-outlined text-[22px]">
                  arrow_forward
                </span>
              </button>
            </Link>

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-1">
              <div className="h-px bg-slate-200" />
              <span className="text-xs font-semibold text-slate-400">OR</span>
              <div className="h-px bg-slate-200" />
            </div>

            <Link
              to="/auth/login"
              className="text-center text-sm font-semibold text-slate-400 hover:text-slate-500"
            >
              <button
                className="flex h-14 w-full items-center justify-center gap-2 rounded-xl border border-blue-100 bg-blue-50 text-base font-bold text-secondary active:scale-[0.98] transition-all"
                type="button"
              >
                <span className="material-symbols-outlined text-[25px]">
                  pin
                </span>
                Back to Login
              </button>
            </Link>
          </form>
        </section>

        {/* Footer */}
        <footer className="mt-auto pt-10 pb-3 flex items-center justify-center">
          <p className="text-[11px] font-mono tracking-wider text-slate-400">
            Developed by HSBLCO V2.1
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Number;
