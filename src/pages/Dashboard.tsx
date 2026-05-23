import { Link } from "react-router-dom";
import { useGetCurrentUserQuery } from "@/queries/authQuery";
import {
  useGetEarningBreakdownQuery,
  useGetPromotionStatusQuery,
} from "@/queries/dashboardQuery";
import { useGetBookingsQuery } from "@/queries/bookingQuery";
import { useGetProjectsQuery } from "@/queries/projectQuery";
import { useGetPaymentSummaryQuery } from "@/queries/paymentQuery";
import { useGetPayoutBalanceQuery } from "@/queries/payoutQuery";
import { formatCurrency, formatPlainNumber } from "@/utils/format";
import { getDataScopeLabel, isCustomerUser } from "@/utils/userAccess";

const StatCard = ({
  label,
  value,
  note,
  icon,
  colorClass,
}: {
  label: string;
  value: string | number;
  note: string;
  icon: string;
  colorClass: string;
}) => (
  <div className={`rounded-xl bg-white p-4 min-h-23 border border-l-4 ${colorClass}`}>
    <div className="flex items-start justify-between gap-3">
      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500 font-medium">
        {label}
      </p>
      <span className="material-symbols-outlined text-body-lg p-1.5 rounded-lg bg-slate-50">
        {icon}
      </span>
    </div>
    <h2 className="mt-2 text-[28px] leading-none font-extrabold tracking-tight">
      {value}
    </h2>
    <p className="mt-1 text-[11px] text-slate-500">{note}</p>
  </div>
);

const Dashboard = () => {
  const { data: session } = useGetCurrentUserQuery();
  const currentUser = session?.user;
  const customerUser = isCustomerUser(currentUser);
  const waitForUser = !currentUser;

  const { data: earnings } = useGetEarningBreakdownQuery(undefined, {
    skip: waitForUser || customerUser,
  });
  const { data: payoutBalance } = useGetPayoutBalanceQuery(undefined, {
    skip: waitForUser || customerUser,
  });
  const { data: promotion } = useGetPromotionStatusQuery(undefined, {
    skip: waitForUser || customerUser,
  });
  const { data: paymentSummary } = useGetPaymentSummaryQuery(undefined, {
    skip: waitForUser || !customerUser,
  });
  const { data: bookings } = useGetBookingsQuery();
  const { data: projects = [] } = useGetProjectsQuery();

  const activeProjects = projects.filter((project) => project.status).length;
  const totalBookings = bookings?.total || 0;
  const totalDue = (bookings?.data || []).reduce(
    (total, booking) => total + Math.max(booking.remaining_amount, 0),
    0,
  );

  if (customerUser) {
    return (
      <div className="bg-white min-h-screen pb-24 font-sans text-slate-950">
        <main className="mx-auto w-full max-w-107.5 px-3 py-3 space-y-4">
          <section className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#07277F] font-bold">
              {getDataScopeLabel(currentUser)}
            </p>
            <h1 className="mt-2 text-2xl font-extrabold text-[#00176b]">
              Payment Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Income and commission are hidden for customer accounts.
            </p>
          </section>

          <section className="grid grid-cols-1 gap-3">
            <StatCard
              label="Plot Price"
              value={formatCurrency(paymentSummary?.plot_price)}
              note={`${formatPlainNumber(paymentSummary?.plot_size_khata)} Khata`}
              icon="real_estate_agent"
              colorClass="border-blue-100 border-l-[#07277f]"
            />
            <StatCard
              label="Total Paid"
              value={formatCurrency(paymentSummary?.total_paid_amount)}
              note="Booking, down payment and installment"
              icon="verified"
              colorClass="border-green-100 border-l-green-500"
            />
            <StatCard
              label="Remaining"
              value={formatCurrency(paymentSummary?.remaining_amount ?? totalDue)}
              note="Payable balance"
              icon="payments"
              colorClass="border-orange-100 border-l-orange-400"
            />
          </section>

          <section className="rounded-xl bg-white p-4 border border-blue-100">
            <h3 className="text-lg font-extrabold text-[#07277f]">
              Payment Breakdown
            </h3>
            <div className="mt-4 grid grid-cols-1 gap-3">
              <div className="grid grid-cols-[1fr_auto] rounded-xl bg-slate-50 p-4 text-sm">
                <span className="font-semibold text-slate-500">Booking Money</span>
                <span className="font-extrabold text-[#00176b]">
                  {formatCurrency(paymentSummary?.booking_money)}
                </span>
              </div>
              <div className="grid grid-cols-[1fr_auto] rounded-xl bg-slate-50 p-4 text-sm">
                <span className="font-semibold text-slate-500">Down Payment</span>
                <span className="font-extrabold text-[#00176b]">
                  {formatCurrency(paymentSummary?.down_payment)}
                </span>
              </div>
              <div className="grid grid-cols-[1fr_auto] rounded-xl bg-slate-50 p-4 text-sm">
                <span className="font-semibold text-slate-500">Installment</span>
                <span className="font-extrabold text-[#00176b]">
                  {formatCurrency(paymentSummary?.installment_amount)}
                </span>
              </div>
            </div>
            <Link
              to="/customerpayment"
              className="mt-5 grid h-13 grid-cols-[auto_auto] items-center justify-center gap-2 rounded-xl bg-[#07277F] text-sm font-extrabold text-white"
            >
              <span className="material-symbols-outlined text-body-lg">
                payments
              </span>
              Pay Now
            </Link>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-24 font-sans text-slate-950">
      <main className="mx-auto w-full max-w-107.5 px-3 py-3 space-y-4">
        <section className="rounded-xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#07277F] font-bold">
            {getDataScopeLabel(currentUser)}
          </p>
          <h1 className="mt-2 text-2xl font-extrabold text-[#00176b]">
            Dashboard
          </h1>
        </section>

        <section className="grid grid-cols-1 gap-3">
          <StatCard
            label="Total Commission"
            value={formatCurrency(earnings?.total_commission)}
            note="Approved earning breakdown"
            icon="trending_up"
            colorClass="border-green-100 border-l-green-500"
          />
          <StatCard
            label="Pending Payments"
            value={formatCurrency(payoutBalance?.data.pending_amount)}
            note="Withdraw requests awaiting approval"
            icon="schedule"
            colorClass="border-orange-100 border-l-orange-400"
          />
          <StatCard
            label="Active Projects"
            value={activeProjects}
            note={`${projects.length} total projects`}
            icon="assignment"
            colorClass="border-blue-100 border-l-[#07277f]"
          />
          <StatCard
            label="Total Bookings"
            value={totalBookings}
            note="Visible from your account scope"
            icon="event_available"
            colorClass="border-blue-100 border-l-secondary"
          />
        </section>

        <section className="rounded-xl bg-white p-4 border border-blue-100">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-extrabold text-[#07277f] leading-tight">
                Earnings Breakdown
              </h3>
              <p className="mt-1 text-[11px] text-slate-500">
                Booking, down payment and installment commission
              </p>
            </div>
            <Link
              to="/profile"
              className="rounded-lg bg-blue-50 px-3 py-1 text-[10px] font-medium text-[#07277f]"
            >
              Details
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3">
            {(earnings?.earnings_breakdown || []).map((item) => (
              <div
                key={item.category_name}
                className="rounded-xl border border-blue-100 bg-slate-50 p-4"
              >
                <div className="grid grid-cols-[1fr_auto] items-center gap-3">
                  <div>
                    <p className="text-sm font-extrabold text-[#00176b]">
                      {item.category_name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.total_customers} customers
                    </p>
                  </div>
                  <p className="text-sm font-extrabold text-[#00176b]">
                    {formatCurrency(item.total_amount)}
                  </p>
                </div>
              </div>
            ))}
            {!earnings?.earnings_breakdown?.length && (
              <p className="rounded-xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">
                No earning data found.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-xl bg-linear-to-br from-white to-blue-50 p-4 border border-blue-100">
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#07277f] font-medium">
            Promotion Target
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-[#07277f]">
            <span>{promotion?.current_position || "Position"}</span>
            <span>{formatPlainNumber(promotion?.progress_percent)}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-blue-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#07277f]"
              style={{
                width: `${Math.min(Number(promotion?.progress_percent || 0), 100)}%`,
              }}
            />
          </div>
          <p className="mt-2 text-center text-[10px] text-slate-500">
            {formatPlainNumber(promotion?.remaining_katha)} katha remaining
          </p>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
