import {Link, useNavigate} from "react-router-dom";
import type {SidebarProps} from "@/types/types";
import {useGetCurrentUserQuery, useLogoutMutation} from "@/queries/authQuery";
import {isMarketingUser} from "@/utils/userAccess";

import logo from "@/assets/logo.png";

const Sidebar = ({sidebarOpen, setSidebarOpen}: SidebarProps) => {
    const {data: session} = useGetCurrentUserQuery();
    const marketingUser = isMarketingUser(session?.user);
    const [logout, {isLoading: isLoggingOut}] = useLogoutMutation();
    const navigate = useNavigate();

    const closeSidebar = () => setSidebarOpen(false);
    const handleLogout = async () => {
        closeSidebar();

        try {
            await logout().unwrap();
        } finally {
            localStorage.removeItem("user");
            navigate("/", {replace: true});
        }
    };

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

                        <div className="mt-4 space-y-1">

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
                        </div>

                        {
                            marketingUser ? <>
                                <Link to="/payment" onClick={closeSidebar} className={subMenuClass}>
                                    <span className="material-symbols-outlined">history</span>
                                    Withdraw History
                                </Link>
                            </> : null
                        }

                        {/* HRM */}

                        <div className="space-y-1">
                            <Link
                                to="/booking"
                                onClick={closeSidebar}
                                className={subMenuClass}
                            >
                <span className="material-symbols-outlined text-h3">
                  event_available
                </span>
                                Booking
                            </Link>

                            <Link
                                to="/employee"
                                onClick={closeSidebar}
                                className={subMenuClass}
                            >
                <span className="material-symbols-outlined text-[23px]">
                  account_tree
                </span>
                                Employee Tree
                            </Link>

                            <Link
                                to="/customer"
                                onClick={closeSidebar}
                                className={subMenuClass}
                            >
                                <span className="material-symbols-outlined">group</span>
                                All Customer
                            </Link>

                            <Link
                                to="/privacy-policy"
                                onClick={closeSidebar}
                                className={subMenuClass}
                            >
               <span className="material-symbols-outlined">
shield_locked
</span>
                                Privacy Policy
                            </Link>
                            <Link
                                to="tel:+8801760686162"
                                onClick={closeSidebar}
                                className={subMenuClass}
                            >
               <span className="material-symbols-outlined">
support_agent
</span>
                                Customer Care
                            </Link>
                        </div>

                        {/* LOGOUT */}
                        <button
                            type="button"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="absolute w-full left-0 bottom-0 p-3 px-5 flex items-center gap-2 text-[#07277F] border-t border-blue-900"
                        >
                            <span className="material-symbols-outlined">logout</span>
                            {isLoggingOut ? "Logging out..." : "Logout"}
                        </button>
                    </nav>
                </aside>
            </div>
        </>
    );
};

export default Sidebar;
