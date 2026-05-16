import { Link } from "react-router";

const Otp = () => {
  return (
    <div className="bg-white min-h-screen  font-inter text-slate-950 flex flex-col overflow-hidden">
      <main className="relative mx-auto flex min-h-dvh w-full max-w-107.5 flex-col bg-white px-5 py-7 shadow-lg overflow-hidden">
        <div className="text-center">
          <div className="mx-auto mb-3 -mt-2.5 flex h-18 w-18 items-center justify-center rounded-full bg-blue-100">
            <span
              className="material-symbols-outlined text-4xl! text-blue-700"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified_user
            </span>
          </div>

          <h1 className="mb-3 text-3xl font-bold text-slate-900">
            Verify Account
          </h1>

          <p className="mb-7 text-sm text-slate-500">
            Enter the code sent to your mobile <br />
            <span className="font-semibold text-blue-700">
              +1 (•••) •••-4421
            </span>
          </p>

          <div className="mb-7 flex justify-center gap-3">
            {[...Array(6)].map((_, i) => (
              <input
                key={i}
                maxLength={1}
                type="text"
                inputMode="numeric"
                className=" h-14 w-12 rounded-xl border-2 border-slate-200 bg-white text-center text-2xl font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            ))}
          </div>

          <div className="mb-5 flex items-center justify-center gap-2 text-sm text-slate-500">
            <span className="material-symbols-outlined text-base">
              schedule
            </span>
            <span>
              Resend code in{" "}
              <span className="font-semibold text-blue-700">0:45</span>
            </span>
          </div>

          <Link to="/Component/Profile" className="block">
            <button
              type="button"
              className="w-full py-4 bg-linear-to-r from-primary to-primary-container text-on-primary text-xl font-semibold rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              Verify
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </Link>
          <button className="mt-4 text-sm font-semibold text-secondary hover:underline">
            Didn’t receive the code?
          </button>
        </div>

        <div className="mt-6 text-center absolute bottom-0 left-0 w-full py-4">
          <p className="text-xs font-mono tracking-wider text-slate-400">
            Developed by HSBLCO V2.1
          </p>
        </div>
      </main>
    </div>
  );
};

export default Otp;
