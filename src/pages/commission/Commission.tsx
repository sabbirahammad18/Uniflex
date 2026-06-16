// CommissionPage.tsx
import { useReducer } from "react";
import CommissionHistory, {type CommissionItem } from "./components/CommissionHistory";
import { useGetEarningBreakdownQuery } from "@/queries/dashboardQuery";
import { formatCurrency } from "@/utils/format";

type CategoryFilter = string | "all";

function CommissionPage() {
    const [activeCategory, setActiveCategory] = useReducer(
        (_: CategoryFilter, next: CategoryFilter) => next,
        "all",
    );

    const { data, isLoading, isError } = useGetEarningBreakdownQuery();

    const allRows: CommissionItem[] =
        data?.earnings_breakdown.flatMap((category) =>
            category.customers.map((customer, customerIndex) => ({
                // IDs — use index to guarantee uniqueness across all rows
                id: `${category.category_name}-${customer.customer_id}-${customerIndex}`,

                customerId: customer.customer_uid || "N/A",
                category_id:category?.category_id ?? null,

                // Names
                customer: (customer.customer_name || "Customer")
                    .replace(/\s+and\s+other['s]*/gi, "")
                    .trim(),
                project: category.category_name,   // ← this IS the category label shown on the card

                // Money
                amount: formatCurrency(customer.amount),
                rawAmount: customer.amount ?? 0,
                withdraw: customer.withdraw ?? 0,

                // Date
                date: customer.date || "N/A",

                // Property location
                road_no: customer.road_no || "",
                block_no: customer.block_no || "",
                sector_no: customer.sector_no || "",
                property_no: customer.property_no || "",
            })),
        ) || [];

    const categories =
        data?.earnings_breakdown.map((c) => c.category_name) || [];

    const rows =
        activeCategory === "all"
            ? allRows
            : allRows.filter((r) => r.project === activeCategory);

    const filterButtonClass = (isActive: boolean) =>
        isActive
            ? "px-3 py-1.5 rounded-full text-xs font-bold bg-white text-[#07277F] shadow-sm transition"
            : "px-3 py-1.5 rounded-full text-xs font-bold bg-white/20 text-white transition";
    console.log(rows)
    return (
        <div className="bg-slate-100 flex justify-center">
            <div className="w-full max-w-107 bg-white pb-24">
                {/* Header */}
                <div className="bg-[#07277F] px-5 pt-5 pb-6 rounded-b-lg">
                    <h1 className="text-white text-2xl font-bold">Commission</h1>
                    <p className="text-blue-100 text-sm mt-1">
                        Your commission overview
                    </p>

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
                                {categories.length}
                            </h2>
                        </div>
                    </div>

                    {/* Category filter */}
                    <div className="flex gap-2 mt-4 flex-wrap">
                        <button
                            onClick={() => setActiveCategory("all")}
                            className={filterButtonClass(activeCategory === "all")}
                        >
                            All
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`${filterButtonClass(activeCategory === cat)} whitespace-nowrap`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* List */}
                <div className="px-4 mt-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-lg">Commission History</h2>
                        <span className="text-xs font-semibold text-slate-400">
                            {rows.length} records
                        </span>
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
                            <CommissionHistory key={item.id} item={item}  />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CommissionPage;