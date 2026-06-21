// CommissionPage.tsx
import { useReducer, useState } from "react";
import CommissionHistory, { type CommissionItem } from "./components/CommissionHistory";
import { useGetEarningBreakdownQuery } from "@/queries/dashboardQuery";
import { formatCurrency } from "@/utils/format";
import type {EarningCustomer} from "@/queries/types.ts";

type CategoryFilter = number | "all";

const PER_PAGE = 10;

const CATEGORY_OPTIONS: { id: number; name: string }[] = [
    { id: 1, name: "Booking Money" },
    { id: 2, name: "Down Payment" },
    { id: 3, name: "Installment" },
    { id: 4, name: "Reference Money" },
    { id: 67, name: "Bonus Commission" },
];

function toCommissionItem(
    customer: EarningCustomer,
    categoryName: string,
    customerIndex: number,
): CommissionItem {
    return {
        id: `${categoryName}-${customer.customer_id}-${customerIndex}`,

        customerId: customer.customer_uid || "N/A",
        category_id: customer.category_id,

        customer: (customer.customer_name || "Customer")
            .replace(/\s+and\s+other['s]*/gi, "")
            .trim(),
        project: categoryName,

        pending_withdraw_amount: customer.pending_withdraw_amount,
        total_amount: customer.total_amount,

        amount: formatCurrency(customer.amount),
        rawAmount: customer.amount ?? 0,
        withdraw: customer.withdraw ?? 0,

        date: customer.date || "N/A",

        road_no: customer.road_no || "",
        block_no: customer.block_no || "",
        sector_no: customer.sector_no || "",
        property_no: customer.property_no || "",
    };
}

function CommissionPage() {
    const [activeCategory, setActiveCategory] = useReducer(
        (_: CategoryFilter, next: CategoryFilter) => next,
        "all",
    );

    const [dateFrom, setDateFrom] = useState<string>("");
    const [dateTo, setDateTo] = useState<string>("");
    const [page, setPage] = useState(1);


    const { data, isLoading, isFetching, isError } = useGetEarningBreakdownQuery({
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
        category_id: activeCategory === "all" ? undefined : activeCategory,
        page,
        per_page: PER_PAGE,
    });

    const isAllView = activeCategory === "all";

    const rows: CommissionItem[] = isAllView
        ? (data?.customers ?? []).map((customer, i) =>
            toCommissionItem(customer, customer.category_name ?? "Commission", i),
        )
        : (data?.earnings_breakdown.flatMap((category) =>
            category.customers.map((customer, i) =>
                toCommissionItem(customer, category.category_name, i),
            ),
        ) ?? []);

    // Pagination block: top-level in "All" view, per-category otherwise.
    const pagination = isAllView
        ? data?.pagination
        : data?.earnings_breakdown.find((c) => c.category_id === activeCategory)?.pagination;

    const filterButtonClass = (isActive: boolean) =>
        isActive
            ? "px-3 py-1.5 rounded-full text-xs font-bold bg-white text-[#07277F] shadow-sm transition"
            : "px-3 py-1.5 rounded-full text-xs font-bold bg-white/20 text-white transition";

    return (
        <div className="bg-slate-100 flex justify-center">
            <div className="w-full max-w-107 bg-white pb-24">
                {/* Header */}
                <div className="bg-[#07277F] px-5 pt-5 pb-6 rounded-b-lg">


                    <div className="grid grid-cols-2 gap-3 mt-1">
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                            <p className="text-gray-500 text-sm">Total Commission</p>
                            <h2 className="text-xl font-bold mt-1">
                                {formatCurrency(data?.total_commission)}
                            </h2>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                            <p className="text-gray-500 text-sm">Categories</p>
                            <h2 className="text-xl font-bold text-orange-500 mt-1">
                                {CATEGORY_OPTIONS.length}
                            </h2>
                        </div>
                    </div>

                    {/* Date range filter */}
                    <div className="mt-4">
                        <label className="block text-xs font-bold text-blue-100 mb-1">
                            Filter by date range
                        </label>
                        <div className="flex gap-2 items-center">
                            <input
                                type="date"
                                value={dateFrom}
                                max={dateTo || undefined}
                                onChange={(e) => {
                                    setDateFrom(e.target.value);
                                    setPage(1);
                                }}
                                className="flex-1 h-10 px-3 rounded-lg text-sm font-semibold text-[#07277F] bg-white focus:outline-none focus:ring-2 focus:ring-white/30"
                            />
                            <span className="text-white text-xs font-bold">to</span>
                            <input
                                type="date"
                                value={dateTo}
                                min={dateFrom || undefined}
                                onChange={(e) => {
                                    setDateTo(e.target.value);
                                    setPage(1);
                                }}
                                className="flex-1 h-10 px-3 rounded-lg text-sm font-semibold text-[#07277F] bg-white focus:outline-none focus:ring-2 focus:ring-white/30"
                            />
                            {(dateFrom || dateTo) && (
                                <button
                                    onClick={() => {
                                        setDateFrom("");
                                        setDateTo("");
                                        setPage(1);
                                    }}
                                    className="shrink-0 px-3 h-10 rounded-lg text-xs font-bold bg-white/20 text-white"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Category filter */}
                    <div className="flex gap-2 mt-4 flex-wrap">
                        <button
                            onClick={() => {
                                setActiveCategory("all");
                                setPage(1);
                            }}
                            className={filterButtonClass(isAllView)}
                        >
                            All
                        </button>
                        {CATEGORY_OPTIONS.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    setActiveCategory(cat.id);
                                    setPage(1);
                                }}
                                className={`${filterButtonClass(activeCategory === cat.id)} whitespace-nowrap`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* List */}
                <div className="px-4 mt-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-lg">Commission History</h2>
                        <span className="text-xs font-semibold text-slate-400">
                            {pagination?.total ?? rows.length} records
                            {isFetching && !isLoading ? " · updating…" : ""}
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
                            <CommissionHistory key={item.id} item={item} />
                        ))}
                    </div>

                    {/* Pagination controls */}
                    {pagination && pagination.last_page > 1 && (
                        <div className="flex items-center justify-between mt-5">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page <= 1 || isFetching}
                                className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 disabled:opacity-40"
                            >
                                Previous
                            </button>
                            <span className="text-xs font-semibold text-slate-400">
                                Page {pagination.page} of {pagination.last_page}
                            </span>
                            <button
                                onClick={() => setPage((p) => p + 1)}
                                disabled={!pagination.has_more || isFetching}
                                className="px-4 py-2 rounded-lg text-xs font-bold bg-[#07277F] text-white disabled:opacity-40"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CommissionPage;