import {Link} from "react-router-dom";
import type { HeaderProps } from "@/types/types";
import { useNotificationStream } from "@/hooks/useNotificationStream";
import { useGetNotificationsQuery } from "@/queries/notificationQuery";

const Header = ({ setSidebarOpen }: HeaderProps) => {
    useNotificationStream();
    const { data: notifications } = useGetNotificationsQuery({ per_page: 1 });
    const unreadCount = notifications?.unread_count || 0;

    return (
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

            <div className="flex items-center gap-2">
                <Link
                    to="tel:+8801760686162"
                    className="relative w-9 h-9 rounded-full grid place-items-center hover:bg-slate-100 active:scale-95 transition"
                    aria-label="Notifications"
                >
            <span className="material-symbols-outlined text-[#07277f] text-h3">
              support_agent
            </span>
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 min-w-4 h-4 rounded-full bg-red-500 px-1 text-[9px] font-bold leading-4 text-white text-center">
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                    )}
                </Link>
                <Link
                    to="/notifications"
                    className="relative w-9 h-9 rounded-full grid place-items-center hover:bg-slate-100 active:scale-95 transition"
                    aria-label="Notifications"
                >
            <span className="material-symbols-outlined text-[#07277f] text-h3">
              notifications
            </span>
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 min-w-4 h-4 rounded-full bg-red-500 px-1 text-[9px] font-bold leading-4 text-white text-center">
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                    )}
                </Link>
            </div>
        </header>
    );
};

export default Header;
