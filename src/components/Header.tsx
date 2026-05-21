import {Link} from "react-router-dom";
import type { HeaderProps } from "@/types/types";

const Header = ({ setSidebarOpen }: HeaderProps) => {
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

            <div className="flex items-center gap-3">
                <button className="relative w-9 h-9 rounded-full grid place-items-center hover:bg-slate-100 active:scale-95 transition">
            <span className="material-symbols-outlined text-[#07277f] text-h3">
              notifications
            </span>
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white" />
                </button>
            </div>
        </header>
    );
};

export default Header;