type Item = {
  id: string;
  customer: string;
  project: string;
  amount: string;
  date: string;
  status: string;
};

const CommissionHistory = ({ item }: { item: Item }) => {
  return (
    <div
      key={item.id}
      className="bg-white border border-slate-200 rounded-xl p-4"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-slate-900">{item.customer}</h3>

          <p className="text-sm text-slate-500 mt-1">{item.project}</p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            item.status === "Paid"
              ? "bg-green-100 text-green-600"
              : "bg-orange-100 text-orange-600"
          }`}
        >
          {item.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div>
          <p className="text-xs text-slate-400">Commission ID</p>

          <h4 className="font-medium">{item.id}</h4>
        </div>

        <div>
          <p className="text-xs text-slate-400">Date</p>

          <h4 className="font-medium">{item.date}</h4>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t pt-3">
        <p className="text-sm text-slate-500">Amount</p>

        <h2 className="text-lg font-bold text-blue-600">{item.amount}</h2>
      </div>
    </div>
  );
};

export default CommissionHistory;
