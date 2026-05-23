import { Link } from "react-router-dom";
import { useGetRecentTransactionsQuery } from "@/queries/paymentQuery";
import { useGetPayoutBalanceQuery } from "@/queries/payoutQuery";
import { formatCurrency } from "@/utils/format";

type PropsType = {
  title: string;
  amount: string;
  date: string;
};

const Payments = (props: PropsType) => {
  const { data: balance } = useGetPayoutBalanceQuery();
  const { data: transactions, isLoading } = useGetRecentTransactionsQuery({
    per_page: 10,
  });

  const currentBalance = balance?.data.remaining_balance;

  return (
    <div className="bg-white mx-auto w-full max-w-107.5 min-h-screen pb-24 font-sans text-slate-950">
      <main className="mx-auto w-full max-w-107.5 px-4 py-6 grid grid-cols-1 gap-5">
        <section className="relative overflow-hidden rounded-3xl bg-white border border-blue-100 p-5 -mt-3">
          <div className="relative z-10 grid grid-cols-1 gap-5">
            <div>
              <div>
                <h1 className="-mt-2 opacity-70 font-semibold ">
                  {props.title}
                </h1>
                <h1 className="text-h1 font-bold text-[#07277f]">
                  {currentBalance === undefined
                    ? props.amount
                    : formatCurrency(currentBalance)}
                </h1>
                <h1 className="text-sm font-bold opacity-80 text-blue-900">
                  {props.date}
                </h1>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-2">
                <span className="text-xs text-slate-400">
                  Approved: {formatCurrency(balance?.data.approved_amount)} /
                  Pending: {formatCurrency(balance?.data.pending_amount)}
                </span>
              </div>
            </div>

            <Link to="/request">
              <button className="h-13 w-full rounded-2xl bg-linear-to-r from-[#07277f] to-blue-700 text-white font-extrabold shadow-lg grid grid-cols-[auto_auto] items-center justify-center gap-2 active:scale-[0.98] transition">
                <span className="material-symbols-outlined text-[21px]">
                  payments
                </span>
                Payment Request
              </button>
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4">
          <h3 className="px-1 text-xl font-extrabold text-slate-950">
            Recent Transactions
          </h3>

          {isLoading && (
            <p className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm font-bold text-[#00176b]">
              Loading transactions...
            </p>
          )}

          {!isLoading && !transactions?.data.length && (
            <p className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-600">
              No transactions found.
            </p>
          )}

          {(transactions?.data || []).map((transaction) => (
            <article
              key={transaction.id}
              className="rounded-2xl bg-white border border-blue-100 p-4 grid grid-cols-[48px_1fr] gap-3"
            >
              <div className="h-12 w-12 rounded-xl bg-blue-50 grid place-items-center text-[#00176b]">
                <span className="material-symbols-outlined text-[23px]">
                  receipt_long
                </span>
              </div>
              <div className="min-w-0 grid grid-cols-1 gap-3">
                <div>
                  <h4 className="text-sm font-extrabold leading-5 text-[#00176b]">
                    {transaction.title}
                  </h4>
                  <div className="mt-2 grid grid-cols-1 gap-1 text-xs text-slate-500">
                    <p className="grid grid-cols-[auto_1fr] items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">
                        calendar_today
                      </span>
                      {transaction.date || "N/A"}
                    </p>
                    <p className="grid grid-cols-[auto_1fr] items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">
                        fingerprint
                      </span>
                      {transaction.transaction_id || `#${transaction.id}`}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                  <p className="text-lg font-extrabold text-[#00176b]">
                    {formatCurrency(transaction.amount)}
                  </p>
                  <span className="rounded-full bg-green-100 px-2 py-1 text-[10px] font-bold capitalize text-green-700">
                    {transaction.status}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Payments;
