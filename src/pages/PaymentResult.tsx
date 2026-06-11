import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

type ResultState = "success" | "failed" | "already" | "error";

function detectState(params: URLSearchParams): ResultState {
    if (params.get("payment_id")) return "success";
    if (params.get("already"))    return "already";
    if (params.get("status"))     return "failed";
    if (params.get("reason"))     return "error";
    return "error";
}

const config: Record<
    ResultState,
    {
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
    }
> = {
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
        primaryTo: "/customerpayment",
        secondaryLabel: "Go to profile",
        secondaryTo: "/profile",
    },
    failed: {
        icon: "cancel",
        iconBg: "#FCEBEB",
        iconColor: "#A32D2D",
        ringBorder: "#F09595",
        title: "Payment not completed",
        subtitle:
            "The transaction was cancelled or declined. No amount was charged.",
        badge: "Declined",
        badgeBg: "#FCEBEB",
        badgeColor: "#791F1F",
        primaryLabel: "Try again",
        primaryTo: "/customerpayment",
        secondaryLabel: "Go to profile",
        secondaryTo: "/profile",
    },
    already: {
        icon: "info",
        iconBg: "#E6F1FB",
        iconColor: "#185FA5",
        ringBorder: "#85B7EB",
        title: "Already processed",
        subtitle:
            "This payment was already recorded. No duplicate charge was made.",
        badge: "Duplicate request",
        badgeBg: "#E6F1FB",
        badgeColor: "#0C447C",
        primaryLabel: "View payments",
        primaryTo: "/customerpayment",
    },
    error: {
        icon: "warning",
        iconBg: "#FAEEDA",
        iconColor: "#854F0B",
        ringBorder: "#EF9F27",
        title: "Something went wrong",
        subtitle:
            "We could not verify your payment. Please try again or contact support.",
        badge: "Verification error",
        badgeBg: "#FAEEDA",
        badgeColor: "#633806",
        primaryLabel: "Try again",
        primaryTo: "/customerpayment",
        secondaryLabel: "Go to profile",
        secondaryTo: "/profile",
    },
};

const PaymentResult = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const state = detectState(params);
    const paymentId = params.get("payment_id");
    const status    = params.get("status");
    const reason    = params.get("reason");
    const c = config[state];

    // Optional: auto-redirect away from success after N seconds
    useEffect(() => {
        if (state === "success") {
            const t = setTimeout(() => navigate(c.primaryTo), 8000);
            return () => clearTimeout(t);
        }
    }, [state, c.primaryTo, navigate]);

    const detailRows: { label: string; value: string }[] = [];
    if (paymentId) detailRows.push({ label: "Payment ID", value: `#PP-${paymentId}` });
    if (status)    detailRows.push({ label: "Gateway status", value: status });
    if (reason)    detailRows.push({ label: "Reason", value: reason.replace(/_/g, " ") });

    return (
        <div className="min-h-screen bg-slate-50 flex items-start justify-center px-4 py-14">
            <div className="w-full max-w-md flex flex-col items-center gap-6">

                {/* Icon */}
                <div
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ background: c.iconBg, border: `2px solid ${c.ringBorder}` }}
                >
          <span
              className="material-symbols-outlined text-5xl"
              style={{ color: c.iconColor }}
          >
            {c.icon}
          </span>
                </div>

                {/* Heading */}
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-extrabold text-[#00176b]">{c.title}</h1>
                    <p className="text-sm text-slate-500 leading-relaxed">{c.subtitle}</p>
                </div>

                {/* Card */}
                <div className="w-full rounded-2xl bg-white border border-slate-100 p-5 shadow-sm">
                    {/* Badge */}
                    <div className="flex justify-center mb-4">
            <span
                className="inline-flex items-center gap-1.5 px-4 py-1 rounded-lg text-xs font-semibold"
                style={{ background: c.badgeBg, color: c.badgeColor }}
            >
              {state === "success" && (
                  <span className="material-symbols-outlined text-sm">check</span>
              )}
                {c.badge}
            </span>
                    </div>

                    {/* Detail rows */}
                    {detailRows.length > 0 && (
                        <div className="divide-y divide-slate-100">
                            {detailRows.map((row) => (
                                <div
                                    key={row.label}
                                    className="flex items-center justify-between py-3 text-sm"
                                >
                                    <span className="text-slate-500 font-medium">{row.label}</span>
                                    <span className="font-semibold text-slate-800 capitalize">
                    {row.value}
                  </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Success note */}
                    {state === "success" && (
                        <p className="mt-4 text-xs text-slate-400 text-center">
                            Redirecting to your payments in a few seconds…
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="w-full flex flex-col gap-3">
                    <button
                        onClick={() => navigate(c.primaryTo)}
                        className="w-full h-13 flex items-center justify-center gap-2 rounded-2xl bg-[#07277F] text-white text-sm font-bold shadow-md active:scale-[0.98] transition"
                    >
            <span className="material-symbols-outlined text-[20px]">
              {state === "success" ? "receipt_long" : "refresh"}
            </span>
                        {c.primaryLabel}
                    </button>

                    {c.secondaryLabel && c.secondaryTo && (
                        <button
                            onClick={() => navigate(c.secondaryTo!)}
                            className="w-full h-13 flex items-center justify-center gap-2 rounded-2xl bg-white border border-slate-200 text-[#00176b] text-sm font-semibold active:scale-[0.98] transition"
                        >
              <span className="material-symbols-outlined text-[20px]">
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