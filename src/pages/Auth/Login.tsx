import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/queries/authQuery";
import { getApiErrorMessage } from "@/utils/format";
import { RiErrorWarningFill } from "react-icons/ri";

type LoginFormErrors = {
  login?: string;
};

type ApiErrorResponse = {
  data?: {
    errors?: Record<string, string[]>;
  };
};

const getFieldError = (error: unknown, field: string) => {
  const apiError = error as ApiErrorResponse;
  return apiError.data?.errors?.[field]?.[0] || "";
};

const Login = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<LoginFormErrors>({});
  const [loginUser, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname || "/profile";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setFieldErrors({});

    try {
      await loginUser({ login, password }).unwrap();
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const loginError = getFieldError(error, "login");

      if (loginError) {
        setFieldErrors({ login: loginError });
        return;
      }

      setErrorMessage(getApiErrorMessage(error, "Invalid credentials"));
    }
  };

  return (
   
      <div className="flex flex-1 flex-col font-inter text-slate-950">
        <section className="mt-8 grid grid-cols-1">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
            {errorMessage && (
              <div
                className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 font-semibold text-red-700 flex gap-4 items-center"
                role="alert"
              >
                <RiErrorWarningFill size={24} /> {errorMessage}
              </div>
            )}

            <div>
              <label className="mb-2 ml-2 block text-xs font-semibold text-slate-600">
                User ID
              </label>

              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[22px] text-slate-400">
                  person
                </span>
                <input
                  value={login}
                  onChange={(event) => {
                    setLogin(event.target.value);
                    setFieldErrors((errors) => ({ ...errors, login: "" }));
                  }}
                  className={`h-14 w-full rounded-xl border bg-slate-50 pl-11 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
                    fieldErrors.login
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : "border-slate-200 focus:border-secondary focus:ring-sky-100"
                  }`}
                  placeholder="UC2913 or email"
                  type="text"
                  autoComplete="username"
                  aria-invalid={Boolean(fieldErrors.login)}
                  aria-describedby={
                    fieldErrors.login ? "login-field-error" : undefined
                  }
                  required
                />
              </div>
              {fieldErrors.login && (
                <p
                  className="mt-2 px-2 text-xs font-semibold text-red-600"
                  id="login-field-error"
                >
                  {fieldErrors.login}
                </p>
              )}
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
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-12 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-secondary focus:bg-white focus:ring-4 focus:ring-sky-100"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                />

                <button
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 active:scale-95 transition"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[22px] mt-1.5">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
                <Link
                  to="/forgetpassword"
                  className="text-xs font-semibold text-secondary hover:underline absolute right-2 top-full mt-1"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <div className="block">
              <button
                className="flex mt-4 h-14 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#07277f] to-[#263f96] text-lg font-bold text-white shadow-lg active:scale-[0.98] transition-all disabled:cursor-not-allowed disabled:opacity-60"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
                <span className="material-symbols-outlined text-[22px]">
                  arrow_forward
                </span>
              </button>
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-1"></div>
          </form>
        </section>

        <footer className="mt-auto pb-3 pt-10 flex items-center justify-center">
          <p className="text-[11px] font-mono tracking-wider text-slate-400">
            Developed by HSBLCO V2.1
          </p>
        </footer>
      </div>
 
  );
};

export default Login;
