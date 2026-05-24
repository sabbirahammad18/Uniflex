import { Link, useParams } from "react-router-dom";
import { useGetProjectQuery } from "@/queries/projectQuery";
import { formatCurrency } from "@/utils/format";

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="grid grid-cols-[120px_1fr] gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm">
    <span className="font-semibold text-slate-500">{label}</span>
    <span className="font-bold text-[#00176b]">{value}</span>
  </div>
);

const ProjectDetails = () => {
  const { id } = useParams();

  const {
    data: project,
    isLoading,
    isError,
  } = useGetProjectQuery(id || "", {
    skip: !id,
  });

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-white text-[#07277F]">
        Loading project details
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="mx-auto grid min-h-screen w-full max-w-107.5 place-items-center bg-white  text-center">
        <div>
          <p className="text-lg font-extrabold text-[#00176b]">
            Project not found
          </p>

          <Link
            className="mt-4 inline-block text-sm font-bold text-secondary"
            to="/project"
          >
            Back to projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-white pb-3.75 font-sans text-slate-950">
      <main className="mx-auto grid w-full max-w-107.5 grid-cols-1 gap-5 px-4 py-6">
        {/* BACK BUTTON */}

        {/* SEARCH INPUT */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            search
          </span>

          <input
            type="text"
            placeholder="Search project..."
            className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#07277F]"
          />
        </div>

        {/* PROJECT DETAILS */}
        <section className="overflow-hidden rounded-2xl border border-blue-100 bg-white">
          {/* IMAGE */}
          <div className="h-56 bg-slate-100">
            {project.image ? (
              <img
                className="h-full w-full object-cover"
                src={project.image}
                alt={project.project_name}
              />
            ) : (
              <div className="grid h-full place-items-center text-[#07277F]">
                <span className="material-symbols-outlined text-5xl">
                  apartment
                </span>
              </div>
            )}
          </div>

          {/* CONTENT */}
          <div className="grid grid-cols-1 gap-4 p-5">
            <div>
              <h1 className="mt-1 text-2xl font-extrabold text-[#00176b]">
                {project.project_name}
              </h1>

              <p className="mt-2 grid grid-cols-[auto_1fr] items-start gap-2 text-sm leading-5 text-slate-500">
                <span className="material-symbols-outlined text-body-md">
                  location_on
                </span>

                {project.location}
              </p>
            </div>

            {/* INFO */}
            <div className="grid grid-cols-1 gap-2">
              <InfoRow label="Avenue" value={project.avenue} />

              <InfoRow label="Road" value={project.road} />

              <InfoRow label="Plot" value={project.plot} />

              <InfoRow
                label="Plot Cost"
                value={formatCurrency(project.per_share_plot_cost)}
              />

              <InfoRow
                label="Flat Cost"
                value={formatCurrency(project.per_share_flat_cost)}
              />
            </div>

            {/* DESCRIPTION */}
            {project.description && project.description !== "N/A" && (
              <p className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-slate-700">
                {project.description}
              </p>
            )}
          </div>
        </section>
        
      </main>
    </div>
  );
};

export default ProjectDetails;
