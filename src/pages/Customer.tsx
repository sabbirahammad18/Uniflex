import { Link } from "react-router";

function CustomerHistory() {
  const history = [
    {
      customerId: "CUS-SAB-1001",
      name: "Sabbir Ahmed",
      landSize: "3 Khata",
      amount: "৳1200000",
      status: "Paid",
    },
    {
      customerId: "CUS-RAK-1002",
      name: "Rakib Hasan",
      landSize: "5 Khata",
      amount: "৳800525",
      status: "Pending",
    },
    {
      customerId: "CUS-NUS-1003",
      name: "Nusrat Jahan",
      landSize: "2.5 Khata",
      amount: "৳2102744",
      status: "Paid",
    },
    {
      customerId: "CUS-TAN-1004",
      name: "Tanvir Rana",
      landSize: "7 Khata",
      amount: "৳4523111",
      status: "Cancelled",
    },
    {
      customerId: "CUS-RUK-1005",
      name: "Ruku Khatun",
      landSize: "4 Khata",
      amount: "৳990000",
      status: "Paid",
    },
    {
      customerId: "CUS-ANI-1006",
      name: "Anika Akter",
      landSize: "6 Khata",
      amount: "৳1500000",
      status: "Pending",
    },
    {
      customerId: "CUS-ABI-1007",
      name: "Abir Mahmud",
      landSize: "2 Khata",
      amount: "৳600000",
      status: "Paid",
    },
    {
      customerId: "CUS-JAN-1008",
      name: "Jannat Islam",
      landSize: "8 Khata",
      amount: "৳300000",
      status: "Paid",
    },
    {
      customerId: "CUS-FAH-1009",
      name: "Fahim Khan",
      landSize: "1.5 Khata",
      amount: "৳4001424",
      status: "Cancelled",
    },
    {
      customerId: "CUS-SHI-1010",
      name: "Shila Roy",
      landSize: "4.5 Khata",
      amount: "৳7500004",
      status: "Pending",
    },
  ];
  return (
    <div className="w-full min-h-screen flex justify-center bg-gray-50">
      <div className="w-107 min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="p-5 bg-[#07277F] text-white">
          <h1 className="text-lg font-bold">Customer Timeline</h1>
          <p className="text-xs opacity-80">Recent transactions history</p>
        </div>

        {/* Timeline */}
        <div className="p-5 space-y-6 relative">
          <div className="absolute left-7 top-6 bottom-6 w-0.5 bg-gray-200"></div>

          {history.map((item) => (
            <div
              key={item.customerId}
              className="flex items-start gap-4 relative"
            >
              {/* Dot */}
              <div
                className={`w-4 h-4 rounded-full mt-1 z-10 border-2 border-white shadow
                ${
                  item.status === "Paid"
                    ? "bg-green-500"
                    : item.status === "Pending"
                      ? "bg-yellow-400"
                      : "bg-red-500"
                }`}
              ></div>

              {/* Card */}
              <div className="flex-1 bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-center">
                  <Link
                    to="/profilecustomer"
                    state={{
                      customerName: item.name,
                      customerId: item.customerId,
                      customerLandSize: item.landSize,
                      customerBalance: item.amount,
                      customerStatus: item.status,
                    }}
                  >
                    <h2 className="font-semibold text-[#07277F] text-sm hover:underline cursor-pointer">
                      {item.name}
                    </h2>
                  </Link>

                  <span
                    className={`text-[10px] px-2 py-1 rounded-full font-semibold
                    ${
                      item.status === "Paid"
                        ? "bg-green-100 text-green-600"
                        : item.status === "Pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="mt-2 flex justify-between text-xs text-gray-500">
                  <span>{item.customerId}</span>
                  <span>{item.landSize}</span>
                </div>

                <div className="mt-3 flex justify-between items-center">
                  <p className="font-bold text-[#07277F]">{item.amount}</p>
                  <Link to="/paymenthistory">
                    <button className="text-[10px] bg-[#07277F] text-white px-3 py-1 rounded-md">
                      Payment Details
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CustomerHistory;
