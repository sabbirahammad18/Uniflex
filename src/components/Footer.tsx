import {Link} from "react-router-dom";

const Footer = () => {
    return (
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

    );
};

export default Footer;