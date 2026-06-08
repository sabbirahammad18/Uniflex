import { useState } from "react";
import { Link } from "react-router-dom";
import img from "../../assets/images/download.jpg";
import { useGetCurrentUserQuery } from "@/queries/authQuery";
import {
  useGetEarningBreakdownQuery,
  useLazyGetPlotSearchQuery,
} from "@/queries/dashboardQuery";
import { useGetPaymentSummaryQuery } from "@/queries/paymentQuery";
import { useGetProfileQuery } from "@/queries/profileQuery";
import {
  formatCurrency,
  formatPlainNumber,
  getApiErrorMessage,
} from "@/utils/format";
import { getDataScopeLabel, isCustomerUser } from "@/utils/userAccess";
import ProfileMapButton from "@/components/UniplexMap/ProfileMapButton";

type PlotBreakdown = {
  sector: string;
  block: string;
  road: string;
  plotShare: string;
  normalized: string;
};

const parsePlotCode = (value: string): PlotBreakdown | null => {
  const normalized = value.trim().toUpperCase().replace(/\s+/g, "");

  if (normalized.length < 6) {
    return null;
  }

  const sector = normalized.slice(0, 2);
  const block = normalized.slice(2, 3);

  if (!/^\d{2}$/.test(sector) || !/^[A-Z]$/.test(block)) {
    return null;
  }

  const remaining = normalized.slice(3);

  let road = "";
  let plotShare = "";

  const firstPattern = remaining.match(/^(\d{2,3}\/[A-Z])(\d+(?:\/\d+)?)$/);
  const secondPattern = remaining.match(/^(\d{4,5})\/(\d+)$/);
  const thirdPattern = remaining.match(/^(\d{2,3})(\d+)$/);

  if (firstPattern) {
    road = firstPattern[1];
    plotShare = firstPattern[2];
  } else if (secondPattern) {
    road = secondPattern[1].slice(0, -2);
    plotShare = `${secondPattern[1].slice(-2)}/${secondPattern[2]}`;
  } else if (thirdPattern) {
    road = thirdPattern[1];
    plotShare = thirdPattern[2];
  } else {
    road = remaining;
    plotShare = "N/A";
  }

  return {
    sector,
    block,
    road,
    plotShare,
    normalized,
  };
};

const Profile = () => {
  const [openType, setOpenType] = useState<string | null>(null);
  const [plotInput, setPlotInput] = useState("");
  const [searchedPlotInput, setSearchedPlotInput] = useState("");
  const [plotSearchError, setPlotSearchError] = useState("");
  const [plotSearchResult, setPlotSearchResult] = useState<{
    status: string | number;
  } | null>(null);
  const [triggerPlotSearch, { isFetching: isPlotSearching }] =
    useLazyGetPlotSearchQuery();
  const { data: session } = useGetCurrentUserQuery();
  const { data: profileResponse, isLoading: profileLoading } =
    useGetProfileQuery();
  const currentUser = session?.user;
  const customerUser = isCustomerUser(currentUser);
  const todayDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
  }).format(new Date());
  const { data: earnings, isLoading: earningsLoading } =
    useGetEarningBreakdownQuery({ date: todayDate }, {
      skip: !currentUser || customerUser,
    });
  const { data: paymentSummary } = useGetPaymentSummaryQuery(undefined, {
    skip: !currentUser || !customerUser,
  });

  const profile = profileResponse?.data;
  const displayName = profile?.name || currentUser?.name || "User";
  const displayUid = profile?.uid || currentUser?.uid || "N/A";
  const designation = customerUser
    ? "Customer"
    : currentUser?.designation || "Team Member";
  const avatar = profile?.avatar_url || currentUser?.avatar_url || img;
  const plotBreakdown = parsePlotCode(searchedPlotInput);

  const toggleDropdown = (type: string) => {
    setOpenType(openType === type ? null : type);
  };

  const handlePlotSearch = async () => {
    const trimmed = plotInput.trim();

    if (!trimmed) {
      setPlotSearchError("Enter a plot number to search.");
      setPlotSearchResult(null);
      return;
    }

    setPlotSearchError("");
    setPlotSearchResult(null);

    try {
      const response = await triggerPlotSearch(trimmed).unwrap();
      setSearchedPlotInput(trimmed);
      setPlotSearchResult(response);
    } catch (error) {
      setPlotSearchError(getApiErrorMessage(error, "Unable to search plot."));
    }
  };

  return (
    <div className="bg-white pb-16 font-sans text-slate-950">
      <main className="mx-auto w-full max-w-107.5 px-4 py-8 space-y-6">
        <section className="grid grid-cols-1 rounded-xl bg-white -mt-9 p-6">
          <div className="grid grid-cols-[96px_1fr] items-center gap-5">
            <div className="relative">
              <img
                alt="Profile"
                className="w-21 h-21 rounded-full object-cover border-2 border-blue-900 mb-5 shadow-lg"
                src={avatar}
              />
            </div>

            <div>
              <h2 className="text-h2 leading-6 font-extrabold text-[#00176b] tracking-tight">
                {profileLoading ? "Loading..." : displayName}
              </h2>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-xs font-medium text-blue-700 capitalize">
                  {designation}
                </span>

                <span className="text-sm text-slate-400">
                  ID: {displayUid}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-xl bg-[#07277F] p-6 text-white shadow-lg -mt-10">
          <Link to={customerUser ? "/customerpayment" : "/payment"}>
            <div>
              <p className="-mt-2 text-sm opacity-80">
                {customerUser ? "Due Balance" : "Wallet Balance"}
              </p>
              <p className="font-bold text-h1">
                {customerUser
                  ? formatCurrency(paymentSummary?.remaining_amount)
                  : formatCurrency(profile?.wallet_balance)}
              </p>
              <p className="font-semibold opacity-70 text-blue-300">
                {getDataScopeLabel(currentUser)}
              </p>
            </div>
          </Link>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <ProfileMapButton />

          <Link
            to="/customer"
            className="rounded-xl bg-white p-4 min-h-18 grid grid-cols-[40px_1fr] items-center gap-3 border border-blue-100 active:scale-[0.98] transition"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-100 grid place-items-center text-blue-600">
              <span className="material-symbols-outlined text-[23px]">
                history
              </span>
            </div>
            <span className="text-sm leading-4 font-medium text-[#00176b]">
              Customer
              <br />
              History
            </span>
          </Link>

          <Link
            to="/employee"
            className="rounded-xl bg-white p-4 min-h-18 grid grid-cols-[40px_1fr] items-center border border-blue-100 gap-3 active:scale-[0.98] transition"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-100 grid place-items-center text-indigo-600">
              <span className="material-symbols-outlined text-[23px]">
                account_tree
              </span>
            </div>
            <span className="text-sm leading-4 font-medium text-[#00176b]">
              Employee
              <br />
              Tree
            </span>
          </Link>

          <Link
            to="/commission"
            className="rounded-xl bg-white p-4 min-h-18 grid grid-cols-[40px_1fr] items-center gap-3 border border-blue-100 active:scale-[0.98] transition"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-100 grid place-items-center text-blue-600">
              <span className="material-symbols-outlined text-[23px]">
                payments
              </span>
            </div>

            <span className="text-sm leading-4 font-medium text-[#00176b]">
              Commission
            </span>
          </Link>

          <Link
            to="/achievement"
            className="rounded-xl bg-white p-4 min-h-18 grid grid-cols-[40px_1fr] items-center gap-3 border border-blue-100 active:scale-[0.98] transition"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-100 grid place-items-center text-blue-600">
              <span className="material-symbols-outlined text-[23px]">
                workspace_premium
              </span>
            </div>

            <span className="text-sm leading-4 font-medium text-[#00176b]">
              Achievement
            </span>
          </Link>
        </section>

        <section>
          <div className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-extrabold text-[#00176b]">
                  Plot Search
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Search a plot number and check whether it is available.
                </p>
              </div>
              <span className="material-symbols-outlined text-3xl text-blue-200">
                travel_explore
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[22px] text-slate-400">
                  pin
                </span>
                <input
                  value={plotInput}
                  onChange={(event) => {
                    setPlotInput(event.target.value);
                    setPlotSearchError("");
                  }}
                  placeholder="Example: 01A0704/01"
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-[#07277F] focus:bg-white focus:ring-4 focus:ring-blue-100"
                  type="text"
                  autoComplete="off"
                />
              </div>

              <button
                onClick={handlePlotSearch}
                disabled={isPlotSearching}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#07277F] px-6 text-sm font-bold text-white shadow-lg transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                type="button"
              >
                {isPlotSearching ? "Searching..." : "Search"}
                <span className="material-symbols-outlined text-[22px]">
                  search
                </span>
              </button>
            </div>

            {plotSearchError && (
              <p className="mt-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {plotSearchError}
              </p>
            )}

            {plotSearchResult && (
              <div
                className={`mt-4 rounded-2xl border p-4 ${
                  String(plotSearchResult.status) === "1"
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-amber-200 bg-amber-50"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p
                      className={`text-base font-extrabold ${
                        String(plotSearchResult.status) === "1"
                          ? "text-emerald-800"
                          : "text-amber-800"
                      }`}
                    >
                      {String(plotSearchResult.status) === "1"
                        ? "Available"
                        : "Not available"}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {String(plotSearchResult.status) === "1"
                        ? "The plot exists in the system."
                        : "The plot is not available."}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-3xl text-slate-300">
                    {String(plotSearchResult.status) === "1"
                      ? "check_circle"
                      : "cancel"}
                  </span>
                </div>

                {String(plotSearchResult.status) === "1" && plotBreakdown && (
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-xl bg-white/80 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Sector
                      </p>
                      <p className="mt-1 text-sm font-extrabold text-[#00176b]">
                        {plotBreakdown.sector}
                      </p>
                    </div>
                    <div className="rounded-xl bg-white/80 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Block
                      </p>
                      <p className="mt-1 text-sm font-extrabold text-[#00176b]">
                        {plotBreakdown.block}
                      </p>
                    </div>
                    <div className="rounded-xl bg-white/80 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Road
                      </p>
                      <p className="mt-1 text-sm font-extrabold text-[#00176b]">
                        {plotBreakdown.road}
                      </p>
                    </div>
                    <div className="rounded-xl bg-white/80 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Plot / Share
                      </p>
                      <p className="mt-1 text-sm font-extrabold text-[#00176b]">
                        {plotBreakdown.plotShare}
                      </p>
                    </div>
                  </div>
                )}

                {String(plotSearchResult.status) !== "1" && (
                  <p className="mt-4 text-sm font-semibold text-amber-800">
                    Not available
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-5">
          {customerUser ? (
            <section className="rounded-3xl bg-white border border-blue-100 p-5 shadow-sm">
              <h3 className="text-xl font-extrabold text-[#00176b]">
                Payment Summary
              </h3>

              <div className="mt-5 grid grid-cols-1 gap-3">
                <div className="grid grid-cols-[1fr_auto] rounded-2xl bg-slate-50 p-4 text-sm">
                  <span className="font-bold text-slate-500">Plot Price</span>
                  <span className="font-extrabold text-[#00176b]">
                    {formatCurrency(paymentSummary?.plot_price)}
                  </span>
                </div>
                <div className="grid grid-cols-[1fr_auto] rounded-2xl bg-slate-50 p-4 text-sm">
                  <span className="font-bold text-slate-500">Booking Money</span>
                  <span className="font-extrabold text-[#00176b]">
                    {formatCurrency(paymentSummary?.booking_money)}
                  </span>
                </div>
                <div className="grid grid-cols-[1fr_auto] rounded-2xl bg-slate-50 p-4 text-sm">
                  <span className="font-bold text-slate-500">Down Payment</span>
                  <span className="font-extrabold text-[#00176b]">
                    {formatCurrency(paymentSummary?.down_payment)}
                  </span>
                </div>
                <div className="grid grid-cols-[1fr_auto] rounded-2xl bg-slate-50 p-4 text-sm">
                  <span className="font-bold text-slate-500">Installment</span>
                  <span className="font-extrabold text-[#00176b]">
                    {formatCurrency(paymentSummary?.installment_amount)}
                  </span>
                </div>
                <div className="grid grid-cols-[1fr_auto] items-center border-t border-slate-100 pt-5">
                  <span className="text-base font-extrabold text-[#00176b]">
                    Remaining
                  </span>

                  <span className="text-base font-extrabold text-red-600">
                    {formatCurrency(paymentSummary?.remaining_amount)}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-500">
                  Plot size: {formatPlainNumber(paymentSummary?.plot_size_khata)}{" "}
                  Khata
                </p>
              </div>
            </section>
          ) : (
            <section className="rounded-3xl bg-white border border-blue-100 p-5 shadow-sm">
              <h3 className="text-xl font-extrabold text-[#00176b]">
                Daily Breakdown
              </h3>

              <div className="mt-5 grid grid-cols-1 gap-4">
                {earningsLoading && (
                  <p className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">
                    Loading earnings...
                  </p>
                )}

                {(earnings?.earnings_breakdown || []).map((item) => (
                  <div
                    key={item.category_name}
                    className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm"
                  >
                    <button
                      onClick={() => toggleDropdown(item.category_name)}
                      className="w-full grid grid-cols-[1fr_auto] items-center gap-3"
                    >
                      <div className="grid grid-cols-[auto_1fr] items-center gap-3 text-left">
                        <div className="h-3 w-3 rounded-full bg-[#07277f]" />

                        <div>
                          <p className="text-sm font-bold text-slate-700">
                            {item.category_name}
                          </p>

                          <p className="text-xs text-slate-400">
                            {item.total_customers} Customers
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-[#00176b]">
                          {formatCurrency(item.total_amount)}
                        </span>

                        <span className="material-symbols-outlined text-[22px] text-slate-400">
                          {openType === item.category_name
                            ? "expand_less"
                            : "expand_more"}
                        </span>
                      </div>
                    </button>

                    {openType === item.category_name && (
                      <div className="mt-4 grid grid-cols-1 gap-3">
                        {item.customers.map((customer) => (
                          <div
                            key={`${customer.customer_id}-${customer.customer_uid}`}
                            className="rounded-2xl bg-slate-50 border border-slate-100 p-4"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex flex-col mt-2">
                                <h4 className="text-sm font-extrabold text-[#00176b]">
                                  {customer.customer_name || "Customer"}
                                </h4>

                                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                  <span>ID: {customer.customer_uid || "N/A"}</span>
                                </div>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="rounded-xl bg-blue-100 px-3 py-1 text-sm font-extrabold text-[#00176b]">
                                  {formatCurrency(customer.amount)}
                                </span>
                                <span className="text-label-md font-semibold mt-2 opacity-60">
                                  {customer.date || "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {!earningsLoading && !earnings?.earnings_breakdown?.length && (
                  <p className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">
                    No earning data found.
                  </p>
                )}

                <div className="grid grid-cols-[1fr_auto] items-center border-t border-slate-100 pt-5">
                  <span className="text-base font-extrabold text-[#00176b]">
                    Total Commission
                  </span>

                  <span className="text-base font-extrabold text-[#00176b]">
                    {formatCurrency(earnings?.total_commission)}
                  </span>
                </div>
              </div>
            </section>
          )}
        </div>
        <footer className="mt-auto flex items-center justify-center">
          <p className="text-[11px] font-mono tracking-wider text-slate-400">
            Developed by HSBLCO V2.1
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Profile;
