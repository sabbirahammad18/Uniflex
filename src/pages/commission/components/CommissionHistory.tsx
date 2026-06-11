// CommissionHistory.tsx
type Item = {
  id: string;
  customerId: string;
  customer: string;
  project: string;
  amount: string;
  date: string;
};

const CommissionHistory = ({ item }: { item: Item }) => {
  return (
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div>
          <h3 className="font-semibold text-slate-900">{item.customer}</h3>
          <p className="text-sm text-slate-500 mt-0.5">{item.project}</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <div>
            <p className="text-xs text-slate-400">Customer ID</p>
            <p className="text-sm font-semibold text-[#07277F] mt-0.5">{item.customerId}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Commission ID</p>
            <p className="text-sm font-medium mt-0.5">{item.id}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Date</p>
            <p className="text-sm font-medium mt-0.5">{item.date}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t pt-3">
          <p className="text-sm text-slate-500">Amount</p>
          <p className="text-lg font-bold text-blue-600">{item.amount}</p>
        </div>
      </div>
  );
};

export default CommissionHistory;