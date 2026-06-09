import { useState, useEffect } from "react";
import { createPortal } from "react-dom"; // 👈 Import createPortal
import {
    useGetPaymentSummaryQuery,
    useInitiatePaymentMutation,
} from "@/queries/bookingQuery";

interface PaymentModalProps {
    bookingId: number;
    open: boolean;
    onClose: () => void;
}

type PaymentType = "installment" | "downpayment";

const fmt = (n: number) =>
    "৳ " + n.toLocaleString("en-BD", { minimumFractionDigits: 2 });

export default function PaymentModal({ bookingId, open, onClose }: PaymentModalProps) {
    const [paymentType, setPaymentType] = useState<PaymentType>("installment");
    const [amount, setAmount] = useState("");
    const [submitErr, setSubmitErr] = useState("");

    const {
        data: summary,
        isLoading: loadingSum,
        isError: hasSummaryErr,
        error: summaryErrRaw,
    } = useGetPaymentSummaryQuery(bookingId, {
        skip: !open || !bookingId,
        refetchOnMountOrArgChange: false,
    });

    const summaryErr =
        hasSummaryErr && summaryErrRaw
            ? (summaryErrRaw as { data?: { message?: string } })?.data?.message ??
            "Failed to load payment summary."
            : "";

    const [initiatePayment, { isLoading: submitting }] = useInitiatePaymentMutation();

    useEffect(() => {
        if (!open) return;
        setSubmitErr("");
        setAmount("");
        setPaymentType("installment");
    }, [open]);

    // Body scroll lock when modal is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [open]);

    const handlePay = async () => {
        setSubmitErr("");
        const amt = parseFloat(amount);

        if (!amt || amt <= 0) {
            setSubmitErr("Enter a valid amount.");
            return;
        }
        if (summary && amt > summary.remaining) {
            setSubmitErr(`Amount exceeds remaining balance of ${fmt(summary.remaining)}.`);
            return;
        }

        try {
            const data = await initiatePayment({
                booking_id: bookingId,
                payment_type: paymentType,
                amount: amt,
                account_id: 3,
            }).unwrap();

            window.location.href = data.checkout_url;
        } catch (e: unknown) {
            const msg =
                (e as { data?: { message?: string } })?.data?.message ??
                "Payment failed.";
            setSubmitErr(msg);
        }
    };

    if (!open) return null;

    // ─── Render Portal directly to document.body ──────────────────────────────
    return createPortal(
        <>
            {/* Backdrop Layer */}
            <div
                className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm pointer-events-auto"
                onClick={onClose}
            />
            <div className="fixed inset-0 z-[10001] flex items-end justify-center sm:items-center px-4 sm:p-4 pointer-events-none">
                <div
                    className="w-[calc(100vw-32px)] min-w-[320px] max-w-[448px] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[92vh] pointer-events-auto overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Mobile Drag Handle Bar */}
                    <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
                        <div className="w-10 h-1 rounded-full bg-slate-200" />
                    </div>

                    {/* Header */}
                    <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100 shrink-0">
                        <div>
                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                                Make a Payment
                            </p>
                            <h2 className="text-lg font-extrabold text-[#00176b]">
                                {summary?.project_name ?? "Loading…"}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="h-9 w-9 rounded-xl bg-slate-100 grid place-items-center text-slate-500 hover:bg-slate-200 transition"
                        >
                            <span className="material-symbols-outlined text-base">close</span>
                        </button>
                    </div>

                    {/* Scrollable Container Body */}
                    <div className="px-5 py-5 flex flex-col gap-5 overflow-y-auto pb-8">
                        {/* Summary Block Row */}
                        {loadingSum && (
                            <p className="text-sm text-slate-400 text-center py-4">Loading summary…</p>
                        )}
                        {summaryErr && (
                            <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{summaryErr}</p>
                        )}
                        {summary && (
                            <div className="grid grid-cols-3 gap-2 text-center shrink-0">
                                <div className="rounded-xl bg-blue-50 p-3">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Total</p>
                                    <p className="text-sm font-extrabold text-[#00176b] mt-0.5">
                                        {fmt(summary.total_price)}
                                    </p>
                                </div>
                                <div className="rounded-xl bg-green-50 p-3">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Paid</p>
                                    <p className="text-sm font-extrabold text-green-700 mt-0.5">
                                        {fmt(summary.total_paid)}
                                    </p>
                                </div>
                                <div className="rounded-xl bg-amber-50 p-3">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Remaining</p>
                                    <p className="text-sm font-extrabold text-amber-700 mt-0.5">
                                        {fmt(summary.remaining)}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Payment Selection Toggles */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">
                                Payment Type
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {([ "installment", "downpayment" ] as PaymentType[]).map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setPaymentType(type)}
                                        className={`h-11 rounded-xl text-sm font-bold border transition ${
                                            paymentType === type
                                                ? "bg-[#07277f] text-white border-[#07277f]"
                                                : "bg-white text-slate-600 border-slate-200 hover:border-[#07277f]"
                                        }`}
                                    >
                                        {type === "installment" ? "Installment" : "Down Payment"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Numeric Input Field Container */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">
                                Amount (BDT)
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                                    ৳
                                </span>
                                <input
                                    type="number"
                                    min="1"
                                    max={summary?.remaining}
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full h-12 pl-8 pr-4 rounded-xl border border-slate-200 text-[#00176b] font-extrabold text-base focus:outline-none focus:border-[#07277f] focus:ring-2 focus:ring-[#07277f]/10"
                                />
                            </div>
                            {summary && (
                                <button
                                    type="button"
                                    onClick={() => setAmount(String(summary.remaining))}
                                    className="mt-1.5 text-xs text-[#07277f] font-bold hover:underline"
                                >
                                    Pay full remaining ({fmt(summary.remaining)})
                                </button>
                            )}
                        </div>

                        {/* Submit Execution Error Alert Block */}
                        {submitErr && (
                            <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{submitErr}</p>
                        )}

                        {/* Action CTA Button Block */}
                        <div className="mt-2 shrink-0">
                            <button
                                type="button"
                                onClick={handlePay}
                                disabled={submitting || loadingSum || !summary}
                                className="h-14 w-full rounded-xl bg-[#07277f] text-white font-extrabold text-base flex items-center justify-center gap-3 px-5 disabled:opacity-40 active:scale-[0.98] transition"
                            >
                                <span className="material-symbols-outlined text-lg">payments</span>
                                <span className="flex-1 text-center">
                                    {submitting ? "Redirecting…" : "Pay via ShurjoPay"}
                                </span>
                                <span className="material-symbols-outlined text-lg">arrow_forward</span>
                            </button>
                            <p className="text-center text-[11px] text-slate-400 mt-3">
                                You'll be redirected to ShurjoPay's secure checkout.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>,
        document.body // Appends right onto standard web root layout context body
    );
}