import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import img from "../assets/images/uniflex_logo_con (1).png";

function Component() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState("");

  const closeSidebar = () => setSidebarOpen(false);

  const subMenuClass =
    "flex items-center gap-2 py-2 px-3 rounded-md text-slate-300 hover:bg-white/10";

  return (
    <div className="mx-auto w-full max-w-107.5 min-h-screen relative overflow-x-hidden pb-16">
      {/* HEADER */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 z-50 h-14 w-full max-w-107.5 bg-white px-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 rounded-full grid place-items-center hover:bg-slate-100"
          >
            <span className="material-symbols-outlined text-[#07277f]">
              menu
            </span>
          </button>

          <Link to="../profile">
            <h1 className="text-sm font-semibold font-['Goldman'] text-[#07277f] tracking-tight">
              UNIFLEX LIMITED
            </h1>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative w-9 h-9 rounded-full grid place-items-center hover:bg-slate-100 active:scale-95 transition">
            <span className="material-symbols-outlined text-[#07277f] text-h3">
              notifications
            </span>
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white" />
          </button>
        </div>
      </header>

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
          className={`h-full w-65.5 bg-[#07277F] text-white pointer-events-auto transition-transform duration-300 ease-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* TOP */}
          <div className="h-14 px-4 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2">
              <img
                src={img}
                alt="UNIFLEX LIMITED"
                className="w-8 h-8 rounded-full object-cover bg-white"
              />

              <h1 className="text-sm font-semibold font-['Goldman'] text-white">
                UNIFLEX LIMITED
              </h1>
            </div>

            <button
              onClick={closeSidebar}
              className="w-8 h-8 rounded-full hover:bg-white/10 grid place-items-center"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* MENU */}
          <nav className="p-2 space-y-1 text-sm overflow-y-auto h-[calc(100%-56px)]">
            <button
              onClick={() =>
                setOpenMenu(openMenu === "project" ? "" : "project")
              }
              className="w-full h-11 px-3 rounded-md flex items-center gap-3 text-slate-300 hover:bg-white/10"
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

            <Link
              to="#"
              onClick={closeSidebar}
              className="h-11 px-3 rounded-md flex items-center gap-3 text-slate-300 hover:bg-white/10"
            >
              <span className="material-symbols-outlined">payments</span>
              Withdraw Request
            </Link>

            <Link
              to="#"
              onClick={closeSidebar}
              className="h-11 px-3 rounded-md flex items-center gap-3 text-slate-300 hover:bg-white/10"
            >
              <span className="material-symbols-outlined">history</span>
              Withdraw History
            </Link>

            <button
              onClick={() => setOpenMenu(openMenu === "hrm" ? "" : "hrm")}
              className="w-full h-11 px-3 rounded-md flex items-center gap-3 text-slate-300 hover:bg-white/10"
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
                  <span className="material-symbols-outlined text-base">
                    event_available
                  </span>
                  Booking
                </Link>

                <Link
                  to="/employee"
                  onClick={closeSidebar}
                  className={subMenuClass}
                >
                  <span className="material-symbols-outlined text-base">
                    account_tree
                  </span>
                  Employee Tree
                </Link>

                <Link
                  to="/customer"
                  onClick={closeSidebar}
                  className={subMenuClass}
                >
                  <span className="material-symbols-outlined text-base">
                    groups
                  </span>
                  All Customer
                </Link>

                <Link
                  to="/customerpayment"
                  onClick={closeSidebar}
                  className={subMenuClass}
                >
                  <span className="material-symbols-outlined text-base">
                    account_balance_wallet
                  </span>
                  Customer Payment
                </Link>

                <Link
                  to="/payment"
                  onClick={closeSidebar}
                  className={subMenuClass}
                >
                  <span className="material-symbols-outlined text-base">
                    request_quote
                  </span>
                  PayOut Request
                </Link>
              </div>
            )}

            <button
              onClick={() =>
                setOpenMenu(openMenu === "accounts" ? "" : "accounts")
              }
              className="w-full h-11 px-3 rounded-md flex items-center gap-3 text-slate-300 hover:bg-white/10"
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
                  <span className="material-symbols-outlined text-base">
                    add_card
                  </span>
                  Income Entry
                </Link>

                <Link
                  to="/component/create-pay"
                  onClick={closeSidebar}
                  className={subMenuClass}
                >
                  <span className="material-symbols-outlined text-base">
                    paid
                  </span>
                  Create Pay
                </Link>

                <Link
                  to="/payment"
                  onClick={closeSidebar}
                  className={subMenuClass}
                >
                  <span className="material-symbols-outlined text-base">
                    payments
                  </span>
                  Payment
                </Link>

                <Link
                  to="/customer-payment"
                  onClick={closeSidebar}
                  className={subMenuClass}
                >
                  <span className="material-symbols-outlined text-base">
                    receipt_long
                  </span>
                  Customer Payment
                </Link>

              </div>
            )}
                <Link
                  to="/"
                  onClick={closeSidebar}
                  className="absolute left-0 bottom-0 w-65.5 mt-auto h-11 px-3 flex items-center  gap-3 text-white bg-red-600"
                >
                  <span className="material-symbols-outlined">logout</span>
                  Logout
                </Link>
          </nav>
        </aside>
      </div>

      <main className="pt-14">
        <Outlet />
      </main>
      <footer className="py-4 flex justify-center border-t border-slate-100 opacity-70">
        <p className="text-[10px] font-mono tracking-wider uppercase text-slate-400">
          Developed by HSBLCO V2.1
        </p>
      </footer>
      {/* BOTTOM NAV */}
      <nav className="mx-auto w-full max-w-106 fixed bottom-0 left-0 right-0 z-50 h-16 bg-white/90 backdrop-blur-xl border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="mx-auto grid h-full max-w-107.5 grid-cols-4 items-center gap-2">
          <Link
            className="mx-auto flex flex-col items-center justify-center rounded-xl px-3 py-1 text-blue-700"
            to="/profile"
          >
            <span className="material-symbols-outlined text-h3">dashboard</span>
            <span className="mt-1 text-[9px] font-medium">Dashboard</span>
          </Link>

          <Link
            className="mx-auto flex flex-col items-center justify-center text-slate-400"
            to="/project"
          >
            <span className="material-symbols-outlined text-h3">
              assignment
            </span>
            <span className="mt-1 text-[9px] font-medium">Project</span>
          </Link>

          <Link
            className="mx-auto flex flex-col items-center justify-center text-slate-400"
            to="/booking"
          >
            <span className="material-symbols-outlined text-h3">
              event_available
            </span>
            <span className="mt-1 text-[9px] font-medium">Booking</span>
          </Link>

          <Link
            className="mx-auto flex flex-col items-center justify-center text-slate-400"
            to="/setting"
          >
            <span className="material-symbols-outlined text-h3">
              account_circle
            </span>
            <span className="mt-1 text-[9px] font-medium">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default Component;
