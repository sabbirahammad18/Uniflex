import img from "../assets/images/download.jpg";
export default function TeamDashboard() {
  const teamList = [
    {
      name: "Rahim Uddin",
      position: "GM",
      under: "ED",
      total: 12,
    },
    {
      name: "Karim Hasan",
      position: "AGM",
      under: "GM",
      total: 8,
    },
    {
      name: "Sajib Ahmed",
      position: "MO",
      under: "AGM",
      total: 5,
    },
  ];

  return (
    <section className="w-full max-w-107 mx-auto p-4 min-h-screen">
      <div className="grid grid-cols-[96px_1fr] items-center gap-5">
        <div className="relative">
          <img
            alt="Agent Profile"
            className="w-21 h-21 rounded-full object-cover border-2 border-blue-900 mb-5 shadow-lg"
            src={img}
          />
        </div>
        <div>
          <h2 className="text-h2 leading-6 font-extrabold text-[#00176b] tracking-tight mb-9 -ml-3">
            Mr. Hasan Rohaman Sajjad
          </h2>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-blue-100 p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-slate-500">Current Position</p>
            <h2 className="text-xl font-bold text-[#00176b]">
              Executive Director
            </h2>
          </div>

          <div className="text-right">
            <p className="text-xs text-slate-500">Target</p>
            <h2 className="text-xl font-bold text-[#07277F]">120 Katha</h2>
          </div>
        </div>

        {/* Achievement Card */}
        <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4 mb-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500">Achieved Land</p>
              <h3 className="text-lg font-bold text-green-600">78 Katha</h3>
            </div>

            <div className="text-right">
              <p className="text-xs text-slate-500">Remaining Target</p>
              <h3 className="text-lg font-bold text-red-500">42 Katha</h3>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-500">Progress</span>
              <span className="font-semibold text-[#07277F]">65%</span>
            </div>

            <div className="w-full h-2 bg-white rounded-full overflow-hidden">
              <div className="h-full w-[65%] bg-[#07277F] rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Team List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[#07277F]">Team List</h3>

            <span className="text-xs text-slate-500">
              {teamList.length} Members
            </span>
          </div>

          <div className="space-y-3">
            {teamList.map((member) => (
              <div
                key={member.position}
                className="rounded-xl border border-blue-100 bg-white p-3 flex items-center justify-between active:scale-[0.98] transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-100 text-[#07277F] grid place-items-center">
                    <span className="material-symbols-outlined text-[22px]">
                      groups
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-[#07277F] leading-4">
                      {member.name}
                    </h4>

                    <p className="text-xs text-slate-500 mt-1">
                      Under {member.under}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-bold text-[#07277F]">
                    {member.position}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    {member.total} Members
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
