import { Outlet } from "react-router-dom";
import Logo from "../assets/logo.png";

function AuthLayout() {
  return (
    <div className="min-h-screen flex justify-center overflow-hidden">
      <div className="w-full max-w-107 bg-white shadow-sm min-h-screen flex flex-col">
        
        {/* Header */}
        <div className="grid grid-cols-1 place-items-center pt-3 pb-4">
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

        {/* Page Content */}
        <div className="flex-1 px-5 pb-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;