import img from "../assets/images/download.jpg";
import { useGetPromotionStatusQuery } from "@/queries/dashboardQuery";
import { useGetProfileQuery } from "@/queries/profileQuery";
import { formatCurrency, formatPlainNumber } from "@/utils/format";

export default function TeamDashboard() {
  const { data: profile } = useGetProfileQuery();
  const { data: promotion, isLoading, isError } = useGetPromotionStatusQuery();
  const progress = Math.min(Number(promotion?.progress_percent || 0), 100);

  return (
    <section className="w-full max-w-107 mx-auto p-4 min-h-screen">
      <div className="grid grid-cols-[96px_1fr] items-center gap-5">
        <div className="relative">
          <img
            alt="Agent Profile"
            className="w-21 h-21 rounded-full object-cover border-2 border-blue-900 mb-5 shadow-lg"
            src={profile?.data.avatar_url || img}
          />
        </div>
        <div>
          <h2 className="text-h2 leading-6 font-extrabold text-[#00176b] tracking-tight mb-9 -ml-3">
            {profile?.data.name || "User"}
          </h2>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-blue-100 p-4">
        {isLoading && (
          <p className="rounded-xl bg-blue-50 p-4 text-sm font-bold text-[#07277F]">
            Loading achievement...
          </p>
        )}

        {isError && (
          <p className="rounded-xl bg-red-50 p-4 text-sm font-bold text-red-700">
            Could not load achievement.
          </p>
        )}

        {promotion && (
          <>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-slate-500">Current Position</p>
                <h2 className="text-xl font-bold text-[#00176b]">
                  {promotion.current_position}
                </h2>
              </div>

              <div className="text-right">
                <p className="text-xs text-slate-500">Target</p>
                <h2 className="text-xl font-bold text-[#07277F]">
                  {formatPlainNumber(promotion.target_katha)} Katha
                </h2>
              </div>
            </div>

            <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4 mb-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Achieved Land</p>
                  <h3 className="text-lg font-bold text-green-600">
                    {formatPlainNumber(promotion.achieved_katha)} Katha
                  </h3>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-500">Remaining Target</p>
                  <h3 className="text-lg font-bold text-red-500">
                    {formatPlainNumber(promotion.remaining_katha)} Katha
                  </h3>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500">Progress</span>
                  <span className="font-semibold text-[#07277F]">
                    {formatPlainNumber(progress)}%
                  </span>
                </div>

                <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#07277F] rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="rounded-xl border border-blue-100 bg-white p-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-[#07277F]">
                  Target Down Payment
                </span>
                <span className="text-sm font-bold text-[#07277F]">
                  {formatCurrency(promotion.target_down_payment)}
                </span>
              </div>
              <div className="rounded-xl border border-blue-100 bg-white p-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-[#07277F]">
                  Achieved Down Payment
                </span>
                <span className="text-sm font-bold text-green-600">
                  {formatCurrency(promotion.achieved_down_payment)}
                </span>
              </div>
              <div className="rounded-xl border border-blue-100 bg-white p-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-[#07277F]">
                  Remaining Down Payment
                </span>
                <span className="text-sm font-bold text-red-500">
                  {formatCurrency(promotion.remaining_down_payment)}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
