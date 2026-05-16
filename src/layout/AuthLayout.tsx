import { Outlet } from "react-router-dom";
import Logo from "../assets/images/uniflex_logo_con (1).png";
function AuthLayout() {
  return (
    <div>
      <div className="bg-white grid grid-cols-1 place-items-center pt-3 relative mx-auto w-full shadow-lg max-w-107 overflow-hidden">
        <div className="grid h-24 w-24 place-items-center">
          <img
            alt="UNIFLEX Logo"
            className="h-24 w-24 object-contain"
            src={Logo}
          />
        </div>
        <h1 className="mt-2 text-center font-['Goldman'] text-[28px] font-medium leading-tight text-[#00176b]">
          UNIFLEX LIMITED
        </h1>
        <p className="mt-1 text-center text-sm text-slate-500">
          স্বপ্ন পূরণের বাস্তব ঠিকানা
        </p>
      </div>
      <Outlet />
    </div>
  );
}

export default AuthLayout;
