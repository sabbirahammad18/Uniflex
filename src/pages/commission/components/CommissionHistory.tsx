import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { BsCash } from "react-icons/bs";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { useWithdrawRequestMutation } from "@/queries/withdrawQuery";

export type CommissionItem = {
    id: string;
    customerId: string;
    customer: string;
    project: string;
    amount: string;
    rawAmount: number;
    withdraw: number;
    pending_withdraw_amount: number;
    date: string;
    road_no: string;
    block_no: string;
    sector_no: string;
    property_no: string;
    category_id: number;
    total_amount:number;
};

type BalanceInfo = {
    total_earning: number;
    already_withdraw: number;
    available_balance: number;
    current_request_amount: number;
    pending_withdraw_amount: number;
};

const fmt = (n: number) =>
    "৳ " + Number(n).toLocaleString("en-BD", { minimumFractionDigits: 0 });

const CommissionHistory = ({ item }: { item: CommissionItem }) => {
    const availableBalance =
        item.rawAmount - (item.withdraw ?? 0) - (item.pending_withdraw_amount ?? 0);
    const isLocked = availableBalance <= 0;

    const [modalOpen, setModalOpen] = useState(false);
    const [payoutAmount, setPayoutAmount] = useState<number>(
        Math.max(0, availableBalance)
    );
    const [submitErr, setSubmitErr] = useState("");
    const [balanceInfo, setBalanceInfo] = useState<BalanceInfo | null>(null);

    const [withdrawRequest, { isLoading }] = useWithdrawRequestMutation();

    useEffect(() => {
        document.body.style.overflow = modalOpen ? "hidden" : "unset";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [modalOpen]);

    const openModal = () => {
        setPayoutAmount(Math.max(0, availableBalance));
        setSubmitErr("");
        setBalanceInfo(null);
        setModalOpen(true);
    };

    const handlePayout = async () => {
        setSubmitErr("");
        setBalanceInfo(null);

        if (!payoutAmount || payoutAmount <= 0) {
            setSubmitErr("Enter a valid amount.");
            return;
        }

        if (payoutAmount > availableBalance) {
            setSubmitErr(
                `Amount exceeds your available balance of ${fmt(availableBalance)}.`
            );
            return;
        }

        try {
            await withdrawRequest({
                amount: payoutAmount,
                road_no: item.road_no,
                block_no: item.block_no,
                sector_no: item.sector_no,
                property_no: item.property_no,
                category_id: item.category_id,
            }).unwrap();
            setModalOpen(false);
        } catch (err: any) {
            const errData: BalanceInfo | undefined = err?.data?.data;
            if (errData) setBalanceInfo(errData);
            setSubmitErr(
                err?.data?.message ?? "Payout failed. Please try again."
            );
        }
    };

    /* ── helpers ── */
    const paidPct = Math.min(
        100,
        Math.round(((item.withdraw ?? 0) / item.rawAmount) * 100)
    );
    const pendingPct = Math.min(
        100 - paidPct,
        Math.round(
            ((item.pending_withdraw_amount ?? 0) / item.rawAmount) * 100
        )
    );

    return (
        <>
            {/* ── Card ── */}
            <div
                className={`bg-white border rounded-xl p-4 transition-opacity ${
                    isLocked
                        ? "border-slate-200 opacity-80"
                        : "border-slate-200"
                }`}
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <h3 className="font-semibold text-slate-900 truncate">
                            {item.customer}
                        </h3>
                        <p className="text-sm text-slate-500 mt-0.5">
                            {item.project}
                        </p>
                    </div>

                    {isLocked ? (
                        <div className="shrink-0 flex items-center gap-1.5 bg-slate-100 text-slate-400 px-3 py-1.5 rounded-md text-sm cursor-not-allowed select-none">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M17 8h-1V6A4 4 0 0 0 8 6v2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2Zm-5 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4Zm3-9h-6V6a3 3 0 0 1 6 0v2Z" />
                            </svg>
                            <span>Locked</span>
                        </div>
                    ) : (
                        <button
                            onClick={openModal}
                            className="shrink-0 bg-green-600 hover:bg-green-700 transition-colors px-3 py-1.5 rounded-md text-white text-sm flex items-center gap-1.5"
                        >
                            <BsCash size={14} />
                            <span>Payout</span>
                        </button>
                    )}
                </div>

                {/* IDs & Date */}
                <div className="grid grid-cols-3 gap-x-2 gap-y-1 mt-4">
                    <div>
                        <p className="text-xs text-slate-400">Customer ID</p>
                        <p className="text-sm font-semibold text-[#07277F] mt-0.5 truncate">
                            {item.customerId}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400">Commission ID</p>
                        <p className="text-sm font-medium mt-0.5 truncate">
                            {item.id}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400">Date</p>
                        <p className="text-sm font-medium mt-0.5">{item.date}</p>
                    </div>
                </div>

                {/* Location */}
                <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                    <HiOutlineLocationMarker className="shrink-0 text-slate-400" />
                    <span>
                        Road {item.road_no || "—"} · Block {item.block_no || "—"} · Sector{" "}
                        {item.sector_no || "—"} · Property {item.property_no || "—"}
                    </span>
                </div>

                {/* Balance bar */}
                <div className="mt-3">
                    <div className="flex h-1.5 rounded-full overflow-hidden bg-slate-100">
                        {paidPct > 0 && (
                            <div
                                className="bg-amber-400 h-full"
                                style={{ width: `${paidPct}%` }}
                            />
                        )}
                        {pendingPct > 0 && (
                            <div
                                className="bg-red-400 h-full"
                                style={{ width: `${pendingPct}%` }}
                            />
                        )}
                    </div>
                    <div className="flex gap-3 mt-1.5">
                        <span className="flex items-center gap-1 text-[10px] text-slate-400">
                            <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
                            Paid
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-slate-400">
                            <span className="inline-block w-2 h-2 rounded-full bg-red-400" />
                            Pending
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-slate-400">
                            <span className="inline-block w-2 h-2 rounded-full bg-slate-200" />
                            Available
                        </span>
                    </div>
                </div>

                {/* Amount summary */}
                <div className="mt-3 border-t pt-3 border-gray-100 grid grid-cols-3 gap-2 text-center">
                    <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                            Total
                        </p>
                        <p className="text-sm font-semibold text-[#07277F] mt-0.5">
                            {item.total_amount}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                            Paid
                        </p>
                        <p className="text-sm font-semibold text-amber-600 mt-0.5">
                            {fmt(item.withdraw ?? 0)}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                            Available
                        </p>
                        <p
                            className={`text-sm font-semibold mt-0.5 ${
                                availableBalance <= 0
                                    ? "text-red-500"
                                    : "text-green-600"
                            }`}
                        >
                            {fmt(Math.max(0, availableBalance))}
                        </p>
                    </div>
                </div>

                {/* Locked notice */}
                {isLocked && (
                    <div className="mt-3 flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#DC2626"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <p className="text-xs text-red-600 leading-snug">
                            {item.pending_withdraw_amount > 0
                                ? `৳${item.pending_withdraw_amount.toLocaleString()} is pending approval. Payout is locked until resolved.`
                                : "No available balance. All earnings have been paid out."}
                        </p>
                    </div>
                )}
            </div>

            {/* ── Modal Portal ── */}
            {modalOpen &&
                createPortal(
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm pointer-events-auto"
                            onClick={() => setModalOpen(false)}
                        />

                        {/* Sheet */}
                        <div className="fixed inset-0 z-[10001] flex items-end justify-center sm:items-center px-0 sm:px-4 pointer-events-none">
                            <div
                                className="w-full sm:max-w-[448px] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[92vh] pointer-events-auto overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Drag handle (mobile only) */}
                                <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
                                    <div className="w-10 h-1 rounded-full bg-slate-200" />
                                </div>

                                {/* Header */}
                                <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100 shrink-0">
                                    <div>
                                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                                            Confirm Payout
                                        </p>
                                        <h2 className="text-lg font-extrabold text-[#00176b]">
                                            {item.customer}
                                        </h2>
                                    </div>
                                    <button
                                        onClick={() => setModalOpen(false)}
                                        className="h-9 w-9 rounded-xl bg-slate-100 grid place-items-center text-slate-500 hover:bg-slate-200 transition"
                                    >
                                        <span className="material-symbols-outlined text-base">
                                            close
                                        </span>
                                    </button>
                                </div>

                                {/* Scrollable body */}
                                <div className="px-5 py-5 flex flex-col gap-4 overflow-y-auto pb-8">

                                    {/* Project + location info */}
                                    <div className="rounded-xl bg-blue-50 px-4 py-3 flex flex-col gap-1">
                                        <p className="text-xs font-bold text-[#07277F]">
                                            {item.project}
                                        </p>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                            <HiOutlineLocationMarker className="shrink-0 text-slate-400" />
                                            <span>
                                                Road {item.road_no || "—"} · Block{" "}
                                                {item.block_no || "—"} · Sector{" "}
                                                {item.sector_no || "—"} · Property{" "}
                                                {item.property_no || "—"}
                                            </span>
                                        </div>
                                    </div>



                                    {/* Balance breakdown — always visible in modal */}
                                    <div className="rounded-xl border border-slate-100 overflow-hidden">
                                        <div className="bg-slate-50 px-4 py-2 border-b border-slate-100">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                                Balance breakdown
                                            </p>
                                        </div>
                                        <div className="divide-y divide-slate-100">
                                            <div className="flex items-center justify-between px-4 py-2.5">
                                                <span className="text-xs text-slate-500">
                                                    Total earned
                                                </span>
                                                <span className="text-xs font-bold text-[#00176b]">
                                                    {item.total_amount}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between px-4 py-2.5">
                                                <span className="text-xs text-slate-500">
                                                    Already paid
                                                </span>
                                                <span className="text-xs font-semibold text-amber-600">
                                                    − {fmt(item.withdraw ?? 0)}
                                                </span>
                                            </div>
                                            {(item.pending_withdraw_amount ?? 0) > 0 && (
                                                <div className="flex items-center justify-between px-4 py-2.5 bg-orange-50">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-xs text-orange-600">
                                                            Pending approval
                                                        </span>
                                                        <span className="text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full font-semibold">
                                                            on hold
                                                        </span>
                                                    </div>
                                                    <span className="text-xs font-semibold text-orange-600">
                                                        − {fmt(item.pending_withdraw_amount)}
                                                    </span>
                                                </div>
                                            )}
                                            <div
                                                className={`flex items-center justify-between px-4 py-2.5 ${
                                                    availableBalance <= 0
                                                        ? "bg-red-50"
                                                        : "bg-green-50"
                                                }`}
                                            >
                                                <span
                                                    className={`text-xs font-bold ${
                                                        availableBalance <= 0
                                                            ? "text-red-600"
                                                            : "text-green-700"
                                                    }`}
                                                >
                                                    Available to withdraw
                                                </span>
                                                <span
                                                    className={`text-xs font-extrabold ${
                                                        availableBalance <= 0
                                                            ? "text-red-600"
                                                            : "text-green-700"
                                                    }`}
                                                >
                                                    {fmt(Math.max(0, availableBalance))}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Server-side error balance info (returned from API) */}
                                    {balanceInfo && (
                                        <div className="rounded-xl bg-red-50 border border-red-200 overflow-hidden">
                                            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-red-200 bg-red-100">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="#B91C1C"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <circle cx="12" cy="12" r="10" />
                                                    <line x1="12" y1="8" x2="12" y2="12" />
                                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                                </svg>
                                                <p className="text-xs font-bold text-red-700 uppercase tracking-wide">
                                                    Server rejected — balance detail
                                                </p>
                                            </div>
                                            <div className="divide-y divide-red-100">
                                                {[
                                                    {
                                                        label: "Total earning",
                                                        value: balanceInfo.total_earning,
                                                        color: "text-slate-700",
                                                    },
                                                    {
                                                        label: "Already withdrawn",
                                                        value: balanceInfo.already_withdraw,
                                                        color: "text-amber-700",
                                                    },
                                                    {
                                                        label: "Pending requests",
                                                        value: balanceInfo.pending_withdraw_amount,
                                                        color: "text-orange-700",
                                                    },

                                                ].map(({ label, value, color }) => (
                                                    <div
                                                        key={label}
                                                        className="flex justify-between items-center px-4 py-2"
                                                    >
                                                        <span className="text-xs text-slate-500">
                                                            {label}
                                                        </span>
                                                        <span className={`text-xs ${color}`}>
                                                            {fmt(value)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Amount input */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">
                                            Payout Amount (BDT)
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm pointer-events-none">
                                                ৳
                                            </span>
                                            <input
                                                type="number"
                                                min="1"
                                                max={Math.max(0, availableBalance)}
                                                value={payoutAmount}
                                                onChange={(e) =>
                                                    setPayoutAmount(Number(e.target.value))
                                                }
                                                placeholder="0.00"
                                                className="w-full h-12 pl-8 pr-4 rounded-xl border border-slate-200 text-[#00176b] font-extrabold text-base focus:outline-none focus:border-[#07277f] focus:ring-2 focus:ring-[#07277f]/10"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setPayoutAmount(
                                                    Math.max(0, availableBalance)
                                                )
                                            }
                                            className="mt-1.5 text-xs text-[#07277f] font-bold hover:underline"
                                        >
                                            Use available balance ({fmt(Math.max(0, availableBalance))})
                                        </button>
                                    </div>

                                    {/* Error message */}
                                    {submitErr && (
                                        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                                            {submitErr}
                                        </p>
                                    )}

                                    {/* CTA */}
                                    <div className="mt-2 shrink-0">
                                        <button
                                            type="button"
                                            onClick={handlePayout}
                                            disabled={isLoading || availableBalance <= 0}
                                            className="h-14 w-full rounded-xl bg-[#07277f] text-white font-extrabold text-base flex items-center justify-center gap-3 px-5 disabled:opacity-40 active:scale-[0.98] transition"
                                        >
                                            <BsCash size={20} />
                                            <span className="flex-1 text-center">
                                                {isLoading ? "Processing…" : "Confirm Payout"}
                                            </span>
                                            <span className="material-symbols-outlined text-lg">
                                                arrow_forward
                                            </span>
                                        </button>

                                        {availableBalance <= 0 && (
                                            <p className="text-center text-xs text-slate-400 mt-2">
                                                Payout unavailable — cancel a pending request first.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>,
                    document.body
                )}
        </>
    );
};

export default CommissionHistory;