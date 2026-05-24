import { Link } from "react-router-dom";
import { useGetPaymentSummaryQuery } from "@/queries/paymentQuery";
import { formatCurrency, formatPlainNumber } from "@/utils/format";

const CustomerPayment = () => {
  const { data: summary, isLoading, isError } = useGetPaymentSummaryQuery();

  return (
    <div className="bg-white mx-auto w-full max-w-107.5 pb-24 font-sans text-slate-950">
      <main className="mx-auto w-full max-w-107.5 px-4 py-6 grid grid-cols-1 gap-5">
        <section className="relative overflow-hidden rounded-3xl bg-white border border-blue-100 p-5 -mt-3">
          <div className="relative z-10 grid grid-cols-1 gap-5">
            <div>
              <p className="grid grid-cols-[auto_1fr] items-center gap-2 text-sm text-slate-500">
                <span className="material-symbols-outlined text-body-lg">
                  account_balance_wallet
                </span>
                Due Balance
              </p>
              <h2 className="mt-2 text-numeral-xl leading-none font-extrabold tracking-tight text-[#00176b]">
                {isLoading
                  ? "Loading..."
                  : formatCurrency(summary?.remaining_amount)}
              </h2>
              <div className="mt-3 grid grid-cols-1 gap-2">
                <span className="w-fit rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                  Paid {formatCurrency(summary?.total_paid_amount)}
                </span>
                <span className="text-xs text-slate-400">
                  Customer ID: {summary?.user_id || "N/A"}
                </span>
              </div>
            </div>

            <Link to="/PaymentDetails">
              <button className="h-13 w-full rounded-2xl bg-linear-to-r from-[#07277f] to-blue-700 text-white font-extrabold shadow-lg grid grid-cols-[auto_auto] items-center justify-center gap-2 active:scale-[0.98] transition">
                <span className="material-symbols-outlined text-[21px]">
                  receipt_long
                </span>
                Payment Details
              </button>
            </Link>
          </div>
        </section>

        {isError && (
          <p className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">
            Could not load payment summary.
          </p>
        )}

        <section className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-blue-50 p-4">
            <p className="text-xs font-bold text-slate-500">Plot Price</p>
            <p className="mt-1 font-black text-[#00176b]">
              {formatCurrency(summary?.plot_price)}
            </p>
          </div>
          <div className="rounded-xl bg-yellow-50 p-4">
            <p className="text-xs font-bold text-slate-500">Booking Money</p>
            <p className="mt-1 font-black text-yellow-700">
              {formatCurrency(summary?.booking_money)}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-bold text-slate-500">Down Payment</p>
            <p className="mt-1 font-black text-slate-700">
              {formatCurrency(summary?.down_payment)}
            </p>
          </div>
          <div className="rounded-xl bg-purple-50 p-4">
            <p className="text-xs font-bold text-slate-500">Installment</p>
            <p className="mt-1 font-black text-purple-700">
              {formatCurrency(summary?.installment_amount)}
            </p>
          </div>
          <div className="rounded-xl bg-green-50 p-4 col-span-2">
            <p className="text-xs font-bold text-slate-500">Total Paid</p>
            <p className="mt-1 font-black text-green-700">
              {formatCurrency(summary?.total_paid_amount)}
            </p>
          </div>
          <div className="rounded-xl bg-red-50 p-4 col-span-2">
            <p className="text-xs font-bold text-slate-500">Remaining</p>
            <p className="mt-1 font-black text-red-600">
              {formatCurrency(summary?.remaining_amount)}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4 col-span-2">
            <p className="text-xs font-bold text-slate-500">Plot Size</p>
            <p className="mt-1 font-black text-[#00176b]">
              {formatPlainNumber(summary?.plot_size_khata)} Khata
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CustomerPayment;
