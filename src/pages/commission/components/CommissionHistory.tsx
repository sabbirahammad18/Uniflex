import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { BsCash } from "react-icons/bs";
import { HiOutlineLocationMarker } from "react-icons/hi";

export type CommissionItem = {
    id: string;
    customerId: string;
    customer: string;
    project: string;
    amount: string;
    rawAmount: number;
    withdraw: number;
    date: string;
    road_no: string;
    block_no: string;
    sector_no: string;
    property_no: string;
};

const CommissionHistory = ({ item }: { item: CommissionItem }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [payoutAmount, setPayoutAmount] = useState<number>(item.rawAmount);
    const [loading, setLoading] = useState(false);
    const [submitErr, setSubmitErr] = useState("");

    // Body scroll lock
    useEffect(() => {
        if (modalOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [modalOpen]);

    const openModal = () => {
        setPayoutAmount(item.rawAmount);
        setSubmitErr("");
        setModalOpen(true);
    };

    const handlePayout = async () => {
        setSubmitErr("");
        if (!payoutAmount || payoutAmount <= 0) {
            setSubmitErr("Enter a valid amount.");
            return;
        }

        setLoading(true);
        const payload = {
            amount: payoutAmount,
            road_no: item.road_no,
            block_no: item.block_no,
            sector_no: item.sector_no,
            property_no: item.property_no,
        };

        try {
            const res = await fetch("/api/withdraw-request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                setModalOpen(false);
            } else {
                const data = await res.json().catch(() => ({}));
                setSubmitErr(data?.message ?? "Payout failed. Please try again.");
            }
        } catch {
            setSubmitErr("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* ── Card ── */}
            <div className="bg-white border border-slate-200 rounded-xl p-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <h3 className="font-semibold text-slate-900 truncate">{item.customer}</h3>
                        <p className="text-sm text-slate-500 mt-0.5">{item.project}</p>
                    </div>
                    <button
                        onClick={openModal}
                        className="shrink-0 bg-green-600 hover:bg-green-700 transition-colors px-3 py-1.5 rounded-md text-white text-sm flex items-center gap-1.5"
                    >
                        <BsCash size={14} />
                        <span>Payout</span>
                    </button>
                </div>

                {/* IDs & Date */}
                <div className="grid grid-cols-3 gap-x-2 gap-y-1 mt-4">
                    <div>
                        <p className="text-xs text-slate-400">Customer ID</p>
                        <p className="text-sm font-semibold text-[#07277F] mt-0.5 truncate">{item.customerId}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400">Commission ID</p>
                        <p className="text-sm font-medium mt-0.5 truncate">{item.id}</p>
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
                        Road {item.road_no || "—"} , Block {item.block_no || "—"} , Sector {item.sector_no || "—"} , Property {item.property_no || "—"}
                    </span>
                </div>

                {/* Amount + Withdraw */}
                <div className="mt-4 border-t pt-3 flex items-center justify-between border-gray-200">
                    <div className="flex items-center gap-1.5">
                        <p className="text-sm text-slate-500">Amount</p>
                        <p className=" text-blue-600">{item.amount}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <p className="text-sm text-red-500">Paid Amount</p>
                        <p className="text-sm text-red-400">{item.withdraw ?? 0}</p>
                    </div>
                </div>
            </div>

            {/* ── Modal Portal ── */}
            {modalOpen && createPortal(
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm pointer-events-auto"
                        onClick={() => setModalOpen(false)}
                    />

                    {/* Sheet — bottom on mobile, centered on sm+ */}
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
                                    <span className="material-symbols-outlined text-base">close</span>
                                </button>
                            </div>

                            {/* Scrollable body */}
                            <div className="px-5 py-5 flex flex-col gap-5 overflow-y-auto pb-8">

                                {/* Project + location info */}
                                <div className="rounded-xl bg-blue-50 px-4 py-3 flex flex-col gap-1">
                                    <p className="text-xs font-bold text-[#07277F]">{item.project}</p>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                        <HiOutlineLocationMarker className="shrink-0 text-slate-400" />
                                        <span>
                                            Road {item.road_no || "—"} · Block {item.block_no || "—"} · Sector {item.sector_no || "—"} · Property {item.property_no || "—"}
                                        </span>
                                    </div>
                                </div>

                                {/* Property grid */}
                                <div className="grid grid-cols-4 gap-2 text-center">
                                    {[
                                        { label: "Road", value: item.road_no },
                                        { label: "Block", value: item.block_no },
                                        { label: "Sector", value: item.sector_no },
                                        { label: "Property", value: item.property_no },
                                    ].map(({ label, value }) => (
                                        <div key={label} className="rounded-xl bg-slate-50 py-3">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">{label}</p>
                                            <p className="text-sm font-extrabold text-[#00176b] mt-0.5">{value || "—"}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Amount summary */}
                                <div className="grid grid-cols-2 gap-2 text-center">
                                    <div className="rounded-xl bg-blue-50 p-3">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Amount</p>
                                        <p className="text-sm font-extrabold text-[#00176b] mt-0.5">{item.amount}</p>
                                    </div>
                                    <div className="rounded-xl bg-amber-50 p-3">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Withdraw</p>
                                        <p className="text-sm font-extrabold text-amber-700 mt-0.5">৳ {item.withdraw ?? 0}</p>
                                    </div>
                                </div>

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
                                            value={payoutAmount}
                                            onChange={(e) => setPayoutAmount(Number(e.target.value))}
                                            placeholder="0.00"
                                            className="w-full h-12 pl-8 pr-4 rounded-xl border border-slate-200 text-[#00176b] font-extrabold text-base focus:outline-none focus:border-[#07277f] focus:ring-2 focus:ring-[#07277f]/10"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setPayoutAmount(item.rawAmount)}
                                        className="mt-1.5 text-xs text-[#07277f] font-bold hover:underline"
                                    >
                                        Use full amount ({item.amount})
                                    </button>
                                </div>

                                {/* Error */}
                                {submitErr && (
                                    <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{submitErr}</p>
                                )}

                                {/* CTA */}
                                <div className="mt-2 shrink-0">
                                    <button
                                        type="button"
                                        onClick={handlePayout}
                                        disabled={loading}
                                        className="h-14 w-full rounded-xl bg-[#07277f] text-white font-extrabold text-base flex items-center justify-center gap-3 px-5 disabled:opacity-40 active:scale-[0.98] transition"
                                    >
                                        <BsCash size={20} />
                                        <span className="flex-1 text-center">
                                            {loading ? "Processing…" : "Confirm Payout"}
                                        </span>
                                        <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                    </button>
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