import { Link } from "react-router";

const Otp = () => {
  return (
    <div className="lex flex-1 flex-col font-inter text-slate-950">
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
          <span className="font-semibold text-blue-700">+1 (•••) •••-4421</span>
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
          <span className="material-symbols-outlined text-base">schedule</span>
          <span>
            Resend code in{" "}
            <span className="font-semibold text-blue-700">0:45</span>
          </span>
        </div>

        <Link to="/forget" className="block">
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
    </div>
  );
};

export default Otp;
