import { Link } from "react-router";
const ForgetPassword = () => {
  return (
    <div className="lex flex-1 flex-col font-inter text-slate-950">
      {/* Logo Section */}

      {/* Form Section */}
      <section className="mt-8 grid grid-cols-1">
        <form className="grid grid-cols-1 gap-5">
          <div>
            <label className="mb-2 ml-2 block text-xs font-semibold text-slate-600">
              Verify Number
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

          <Link to="/otp" className="block">
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
            to="/"
            className="text-center text-sm font-semibold text-slate-400 hover:text-slate-500"
          >
            <button
              className="flex h-14 w-full items-center justify-center gap-2 rounded-xl border border-blue-100 bg-blue-50 text-base font-bold text-secondary active:scale-[0.98] transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[25px]">pin</span>
              Back to Login
            </button>
          </Link>
        </form>
      </section>
    </div>
  );
};

export default ForgetPassword;
