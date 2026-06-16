import {useEffect} from "react";
import {useSearchParams, useNavigate} from "react-router-dom";

type ResultState = "success" | "failed" | "already" | "error";

function detectState(params: URLSearchParams): ResultState {
    if (params.get("payment_id")) return "success";
    if (params.get("already")) return "already";
    if (params.get("status")) return "failed";
    if (params.get("reason")) return "error";
    return "error";
}

type ResultConfig = {
    icon: string;
    iconBg: string;
    iconColor: string;
    ringBorder: string;
    title: string;
    subtitle: string;
    badge: string;
    badgeBg: string;
    badgeColor: string;
    primaryLabel: string;
    primaryTo: string;
    secondaryLabel?: string;
    secondaryTo?: string;
};

const config: Record<ResultState, ResultConfig> = {
    success: {
        icon: "check_circle",
        iconBg: "#eaf3de",
        iconColor: "#3B6D11",
        ringBorder: "#97C459",
        title: "Payment successful",
        subtitle: "Your payment has been confirmed and recorded.",
        badge: "Confirmed",
        badgeBg: "#eaf3de",
        badgeColor: "#27500A",
        primaryLabel: "View receipt",
        primaryTo: "/booking",
        secondaryLabel: "Go to profile",
        secondaryTo: "/profile",
    },
    failed: {
        icon: "cancel",
        iconBg: "#FCEBEB",
        iconColor: "#A32D2D",
        ringBorder: "#F09595",
        title: "Payment not completed",
        subtitle: "The transaction was cancelled or declined. No amount was charged.",
        badge: "Declined",
        badgeBg: "#FCEBEB",
        badgeColor: "#791F1F",
        primaryLabel: "Try again",
        primaryTo: "/booking",
        secondaryLabel: "Go to profile",
        secondaryTo: "/profile",
    },
    already: {
        icon: "info",
        iconBg: "#E6F1FB",
        iconColor: "#185FA5",
        ringBorder: "#85B7EB",
        title: "Already processed",
        subtitle: "This payment was already recorded. No duplicate charge was made.",
        badge: "Duplicate request",
        badgeBg: "#E6F1FB",
        badgeColor: "#0C447C",
        primaryLabel: "View payments",
        primaryTo: "/booking",
    },
    error: {
        icon: "warning",
        iconBg: "#FAEEDA",
        iconColor: "#854F0B",
        ringBorder: "#EF9F27",
        title: "Something went wrong",
        subtitle: "We could not verify your payment. Please try again or contact support.",
        badge: "Verification error",
        badgeBg: "#FAEEDA",
        badgeColor: "#633806",
        primaryLabel: "Try again",
        primaryTo: "/booking",
        secondaryLabel: "Go to profile",
        secondaryTo: "/profile",
    },
};

const PaymentResult = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const state = detectState(params);
    const paymentId = params.get("payment_id");
    const status = params.get("status");
    const reason = params.get("reason");
    const c = config[state];

    useEffect(() => {
        if (state === "success") {
            const t = setTimeout(() => navigate(c.primaryTo), 80000);
            return () => clearTimeout(t);
        }
    }, [state, c.primaryTo, navigate]);

    const detailRows: { label: string; value: string }[] = [];
    if (paymentId) detailRows.push({label: "Payment ID", value: `#PP-${paymentId}`});
    if (status) detailRows.push({label: "Gateway status", value: status});
    if (reason) detailRows.push({label: "Reason", value: reason.replace(/_/g, " ")});

    return (
        // ✅ FIX 1: overflow-x-hidden prevents any child from bleeding outside
        <div className="min-h-screen bg-slate-50  px-4 py-14 overflow-x-hidden">
            {/* ✅ FIX 2: w-full with explicit max-w, no nested centering conflicts */}
            <div className="w-full  flex flex-col items-center gap-6">

                {/* Icon */}
                <div
                    className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
                    style={{background: c.iconBg, border: `2px solid ${c.ringBorder}`}}
                >
                    <span
                        className="material-symbols-outlined text-5xl"
                        style={{color: c.iconColor}}
                    >
                        {c.icon}
                    </span>
                </div>

                {/* Heading */}
                <div className="text-center space-y-2 w-full">
                    <h1 className="text-2xl font-extrabold text-[#00176b]">{c.title}</h1>
                    <p className="text-sm text-slate-500 leading-relaxed">{c.subtitle}</p>
                </div>



                {/* Actions */}
                <div className="w-full space-y-3 mt-2">


                    {c.secondaryLabel && c.secondaryTo && (
                        <button
                            onClick={() => navigate(c.secondaryTo!)}
                            className="w-full py-3.5 rounded-2xl bg-white border border-slate-200 text-[#00176b] text-sm font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition"
                        >
            <span className="material-symbols-outlined text-h3">
                {state === "success" ? "home" : "support_agent"}
            </span>
                            {c.secondaryLabel}
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default PaymentResult;