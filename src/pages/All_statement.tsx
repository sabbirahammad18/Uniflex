import { Link } from "react-router";

function AllStatement() {
  const statements = [
    {
      date: "24 Oct 2023",
      project: "Project Phoenix",
      type: "Bank Transfer",
      no: "01",
      due: 50000,
    },
    {
      date: "22 Oct 2023",
      project: "Project Phoenix",
      type: "Cash Payment",
      no: "02",
      due: 20000,
    },
    {
      date: "19 Oct 2023",
      project: "Client A Booking",
      type: "Getway Payment",
      no: "03",
      due: 10000,
    },
  ];

  const typeColor = (type: string | string[]) => {
    if (type.includes("Cash")) return "bg-green-100 text-green-700";
    if (type.includes("Bank")) return "bg-blue-100 text-blue-700";
    if (type.includes("Getway")) return "bg-pink-100 text-pink-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="w-full min-h-screen bg-slate-100 flex justify-center">
      <div className="w-107 min-h-screen bg-white flex flex-col">
        {/* HEADER */}
        <div className="bg-linear-to-r from-blue-900 to-indigo-800 text-white px-5 py-6">
          <h1 className="text-xl font-bold">Statement History</h1>
          <p className="text-xs opacity-80 mt-1">
            All payment transactions overview
          </p>
        </div>

        {/* TIMELINE LIST */}
        <div className="p-4 space-y-4">
          {statements.map((item, i) => (
            <div
              key={i}
              className="relative bg-white border border-slate-100 rounded-2xl p-4 pl-6"
            >
              {/* LEFT DOT TIMELINE */}
              <div className="absolute left-2 top-6 w-2 h-2 bg-blue-600 rounded-full"></div>
              <div className="absolute left-2 top-0 bottom-0 w-px bg-slate-200"></div>

              {/* TOP ROW */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[11px] text-slate-400">{item.date}</p>
                  <h2 className="text-sm font-bold text-blue-900">
                    {item.project}
                  </h2>
                </div>

                <span
                  className={`text-[10px] px-2 py-1 rounded-full font-semibold ${typeColor(
                    item.type,
                  )}`}
                >
                  {item.type}
                </span>
              </div>

              {/* BOTTOM ROW */}
              <div className="flex justify-between items-center mt-3">
                <div className="text-xs text-slate-500">
                  Installment No:{" "}
                  <span className="font-semibold text-slate-700">
                    {item.no}
                  </span>
                </div>

                <div className="text-right">
                  <p className="text-[11px] text-slate-400">Due</p>
                  <p className="text-sm font-bold text-red-600">
                    ৳{item.due.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* BUTTON */}
        <div className="p-4 mt-auto">
          <Link to="/profilecustomer">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold">
              Back
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AllStatement;
