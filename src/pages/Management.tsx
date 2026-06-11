const managementData = [
    {
        name: "Md. Ripon Majumder",
        designation: "Managing Director",
        image:
            "https://uniflexlimited.com/image/WhatsApp-Image-2024-07-07-at-3.23.41-PM-768x578.jpeg",
        description:
            "Planning the smooth completion of independent Green Zones, VIP Zones and modern satellite towns equipped with the latest facilities while leading highly qualified architects and engineers to ensure successful project delivery.",
    },
    {
        name: "Md. Sojib Hoshain",
        designation: "Finance Director",
        image:
            "https://uniflexlimited.com/image/WhatsApp-Image-2024-07-07-at-1.13.37-PM-1-768x576.jpeg",
        description:
            "Driving financial excellence while ensuring sustainable growth through innovation, technology adaptation, customer satisfaction and strategic development initiatives.",
    },
];

const Management = () => {
    return (
        <div className="w-full max-w-118.75 space-y-6">
            {managementData.map((item) => (
                <div
                    key={item.name}
                    className="group relative overflow-hidden rounded-4xl border border-white/10 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(0,0,0,0.35)]"
                >
                    {/* Glow */}
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />
                    <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />

                    {/* Image */}
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="relative mb-5">
                            <div className="absolute inset-0 rounded-full bg-linear-to-r from-cyan-400 to-blue-500 blur-md opacity-60" />

                            <img
                                src={item.image}
                                alt={item.name}
                                className="relative h-32 w-32 rounded-full border-4 border-white/20 object-cover"
                            />
                        </div>

                        {/* Badge */}
                        <span className="mb-3 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Leadership Team
            </span>

                        {/* Name */}
                        <h3 className="text-2xl font-bold text-white">
                            {item.name}
                        </h3>

                        {/* Designation */}
                        <p className="mt-1 text-sm font-medium text-cyan-400">
                            {item.designation}
                        </p>

                        {/* Divider */}
                        <div className="my-5 h-px w-20 bg-linear-to-r from-transparent via-cyan-400 to-transparent" />

                        {/* Description */}
                        <p className="leading-7 text-slate-300 text-sm">
                            {item.description}
                        </p>

                        {/* Quote Icon */}
                        <div className="mt-5 text-5xl font-serif text-cyan-500/20">
                            "
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Management;