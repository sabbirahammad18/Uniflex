import { useState } from "react";
import { Link } from "react-router-dom";
import type { SidebarProps } from "@/types/types";

import logo from "@/assets/logo.png";

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const [openMenu, setOpenMenu] = useState("");

  const closeSidebar = () => setSidebarOpen(false);

  const subMenuClass =
    "flex items-center gap-2 py-2 px-3 rounded-md text-[#07277F] hover:bg-blue-50";

  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={closeSidebar}
        className={`fixed inset-0 left-1/2 -translate-x-1/2 z-60 w-full max-w-107.5 bg-black/40 transition-all duration-300 ${
          sidebarOpen
            ? "opacity-100 visible pointer-events-auto"
            : "opacity-0 invisible pointer-events-none"
        }`}
      />

      {/* SIDEBAR WRAPPER */}
      <div
        className={`fixed top-0 left-1/2 -translate-x-1/2 z-70 h-screen w-full max-w-107.5 pointer-events-none transition-all duration-300 overflow-hidden ${
          sidebarOpen ? "visible" : "invisible"
        }`}
      >
        {/* SIDEBAR */}
        <aside
          className={`h-full w-65.5 bg-white text-[#07277F] pointer-events-auto transition-transform duration-300 ease-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* TOP */}
          <div className="h-14 px-4 flex items-center justify-between border-b border-blue-100 bg-white">
            <div className="flex items-center gap-2">
              <img
                src={logo}
                alt="UNIFLEX LIMITED"
                className="w-8 h-8 rounded-full object-cover bg-white"
              />

              <h1 className="text-sm font-semibold font-['Goldman'] text-[#07277F]">
                UNIFLEX LIMITED
              </h1>
            </div>

            <button
              onClick={closeSidebar}
              className="w-8 h-8 rounded-full hover:bg-blue-50 grid place-items-center"
            >
              <span className="material-symbols-outlined text-[#07277F]">
                close
              </span>
            </button>
          </div>

          {/* MENU */}
          <nav className="p-2 space-y-1 text-sm overflow-y-auto h-[calc(100%-56px)]">
            {/* PROJECT */}
            <button
              onClick={() =>
                setOpenMenu(openMenu === "project" ? "" : "project")
              }
              className="w-full h-11 px-3 rounded-md flex items-center gap-3 text-[#07277F] hover:bg-blue-50"
            >
              <span className="material-symbols-outlined">folder_managed</span>
              <span className="flex-1 text-left">Project</span>
              <span className="material-symbols-outlined text-body-lg">
                {openMenu === "project" ? "expand_more" : "chevron_right"}
              </span>
            </button>

            {openMenu === "project" && (
              <div className="ml-8 space-y-1">
                <Link
                  to="/project"
                  onClick={closeSidebar}
                  className={subMenuClass}
                >
                  <span className="material-symbols-outlined text-base">
                    assignment
                  </span>
                  Project
                </Link>

                <Link
                  to="/booking"
                  onClick={closeSidebar}
                  className={subMenuClass}
                >
                  <span className="material-symbols-outlined text-base">
                    event_available
                  </span>
                  All Booking
                </Link>
              </div>
            )}

            {/* WITHDRAW */}
            <Link
              to="#"
              onClick={closeSidebar}
              className="h-11 px-3 rounded-md flex items-center gap-3 text-[#07277F] hover:bg-blue-50"
            >
              <span className="material-symbols-outlined">payments</span>
              Withdraw Request
            </Link>

            <Link
              to="#"
              onClick={closeSidebar}
              className="h-11 px-3 rounded-md flex items-center gap-3 text-[#07277F] hover:bg-blue-50"
            >
              <span className="material-symbols-outlined">history</span>
              Withdraw History
            </Link>

            {/* HRM */}
            <button
              onClick={() => setOpenMenu(openMenu === "hrm" ? "" : "hrm")}
              className="w-full h-11 px-3 rounded-md flex items-center gap-3 text-[#07277F] hover:bg-blue-50"
            >
              <span className="material-symbols-outlined">badge</span>
              <span className="flex-1 text-left">HRM</span>
              <span className="material-symbols-outlined text-body-lg">
                {openMenu === "hrm" ? "expand_more" : "chevron_right"}
              </span>
            </button>

            {openMenu === "hrm" && (
              <div className="ml-8 space-y-1">
                <Link
                  to="/booking"
                  onClick={closeSidebar}
                  className={subMenuClass}
                >
                  Booking
                </Link>

                <Link
                  to="/employee"
                  onClick={closeSidebar}
                  className={subMenuClass}
                >
                  Employee Tree
                </Link>

                <Link
                  to="/customer"
                  onClick={closeSidebar}
                  className={subMenuClass}
                >
                  All Customer
                </Link>

                <Link
                  to="/customerpayment"
                  onClick={closeSidebar}
                  className={subMenuClass}
                >
                  Customer Payment
                </Link>

                <Link
                  to="/payment"
                  onClick={closeSidebar}
                  className={subMenuClass}
                >
                  PayOut Request
                </Link>
              </div>
            )}

            {/* ACCOUNTS */}
            <button
              onClick={() =>
                setOpenMenu(openMenu === "accounts" ? "" : "accounts")
              }
              className="w-full h-11 px-3 rounded-md flex items-center gap-3 text-[#07277F] hover:bg-blue-50"
            >
              <span className="material-symbols-outlined">account_balance</span>
              <span className="flex-1 text-left">Accounts Management</span>
              <span className="material-symbols-outlined text-body-lg">
                {openMenu === "accounts" ? "expand_more" : "chevron_right"}
              </span>
            </button>

            {openMenu === "accounts" && (
              <div className="ml-8 space-y-1">
                <Link
                  to="/component/income-entry"
                  onClick={closeSidebar}
                  className={subMenuClass}
                >
                  Income Entry
                </Link>

                <Link
                  to="/component/create-pay"
                  onClick={closeSidebar}
                  className={subMenuClass}
                >
                  Create Pay
                </Link>

                <Link
                  to="/payment"
                  onClick={closeSidebar}
                  className={subMenuClass}
                >
                  Payment
                </Link>

                <Link
                  to="/customer-payment"
                  onClick={closeSidebar}
                  className={subMenuClass}
                >
                  Customer Payment
                </Link>
              </div>
            )}

            {/* LOGOUT */}
            {/* LOGOUT */}
            <Link
              to="/"
              onClick={closeSidebar}
              className="text-body-lg absolute left-0 bottom-0 w-65.5 mt-auto h-11 px-3 flex items-center gap-2 text-[#07277F] border-t-2 border-slate-500"
            >
              <span className="material-symbols-outlined">logout</span>
              Logout
            </Link>
          </nav>
        </aside>
      </div>
    </>
  );
};

export default Sidebar;
