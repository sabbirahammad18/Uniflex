import { Link } from "react-router-dom";
import { MdMap } from "react-icons/md";

export default function ProfileMapButton() {
  return (
    <Link
      to="/profile/map"
      className="rounded-xl bg-white p-4 min-h-18 grid grid-cols-[40px_1fr] items-center gap-3 border border-blue-100 active:scale-[0.98] transition"
    >
      <div className="w-10 h-10 rounded-lg bg-emerald-100 grid place-items-center text-emerald-700">
        <MdMap aria-hidden="true" size={23} />
      </div>
      <span className="text-sm leading-4 font-medium text-[#00176b]">
        Project
        <br />
        Map
      </span>
    </Link>
  );
}
