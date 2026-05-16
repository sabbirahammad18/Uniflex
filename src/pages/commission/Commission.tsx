import CommissionHistory from "./components/CommissionHistory";

function CommissionPage() {
  const commissions = [
    {
      id: "CM-1001",
      customer: "Sabbir Ahmed",
      project: "Green Valley",
      amount: "৳25,000",
      date: "08 May 2026",
      status: "Paid",
    },
    {
      id: "CM-1002",
      customer: "Rakib Hasan",
      project: "Lake View City",
      amount: "৳18,500",
      date: "06 May 2026",
      status: "Pending",
    },
    {
      id: "CM-1003",
      customer: "Jannat Akter",
      project: "Royal Residence",
      amount: "৳32,000",
      date: "04 May 2026",
      status: "Paid",
    },
  ];

  return (
    <div className="bg-slate-100 min-h-screen flex justify-center">
      {/* Mobile Container */}
      <div className="w-full max-w-107 bg-white min-h-screen pb-24">
        {/* Header */}
        <div className="bg-[#07277F] px-5 pt-12 pb-6 rounded-b-lg">
          <h1 className="text-white text-2xl font-bold">Commission</h1>
          <p className="text-blue-100 text-sm mt-1">Your commission overview</p>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-gray-500 text-sm">Total Commission</p>
              <h2 className="text-xl font-bold mt-1">৳75,500</h2>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-gray-500 text-sm">Pending</p>
              <h2 className="text-xl font-bold text-orange-500 mt-1">
                ৳28,500
              </h2>
            </div>
          </div>
        </div>

        {/* Commission List */}
        <div className="px-4 mt-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">Commission History</h2>

            <button className="text-blue-600 text-sm font-medium">
              See All
            </button>
          </div>

          <div className="space-y-4">
            {commissions.map((item) => (
              <CommissionHistory key={item.id} item={item} />
            ))}
          </div>
        </div>
        {/* Bottom Button */}
      </div>
    </div>
  );
}

export default CommissionPage;
