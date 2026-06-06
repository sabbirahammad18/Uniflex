import CommissionHistory from "./components/CommissionHistory";
import { useGetEarningBreakdownQuery } from "@/queries/dashboardQuery";
import { formatCurrency } from "@/utils/format";

function CommissionPage() {
    const today = new Date().toISOString().split("T")[0];

    const { data, isLoading, isError } = useGetEarningBreakdownQuery({
        date: today,
    });

    const rows =
    data?.earnings_breakdown.flatMap((category) =>
      category.customers.map((customer) => ({
        id: `${category.category_name}-${customer.customer_id}`,
        customer: customer.customer_name || "Customer",
        project: category.category_name,
        amount: formatCurrency(customer.amount),
        date: customer.date || "N/A",
        status: "Paid",
      })),
    ) || [];

  return (
    <div className="bg-slate-100 flex justify-center">
      <div className="w-full max-w-107 bg-white pb-24">
        <div className="bg-[#07277F] px-5 pt-12 pb-6 rounded-b-lg">
          <h1 className="text-white text-2xl font-bold">Commission</h1>
          <p className="text-blue-100 text-sm mt-1">Your commission overview</p>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-gray-500 text-sm">Total Commission</p>
              <h2 className="text-xl font-bold mt-1">
                {formatCurrency(data?.total_commission)}
              </h2>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-gray-500 text-sm">Categories</p>
              <h2 className="text-xl font-bold text-orange-500 mt-1">
                {data?.earnings_breakdown.length || 0}
              </h2>
            </div>
          </div>
        </div>

        <div className="px-4 mt-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">Commission History</h2>
          </div>

          <div className="space-y-4">
            {isLoading && (
              <p className="rounded-xl bg-blue-50 p-4 text-sm font-bold text-[#07277F]">
                Loading commissions...
              </p>
            )}
            {isError && (
              <p className="rounded-xl bg-red-50 p-4 text-sm font-bold text-red-700">
                Could not load commissions.
              </p>
            )}
            {!isLoading && !isError && rows.length === 0 && (
              <p className="rounded-xl bg-slate-50 p-4 text-sm font-bold text-slate-600">
                No commission found.
              </p>
            )}
            {rows.map((item) => (
              <CommissionHistory key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommissionPage;
