import { useState } from "react";
import { Link } from "react-router-dom";
import img from "../assets/images/2024-06-06.webp";
import { useGetProjectsQuery } from "@/queries/projectQuery";

type ProjectFilter = "all" | "running" | "completed";

const ProjectPortfolio = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ProjectFilter>("all");
  const { data: projects = [], isLoading, isError } = useGetProjectsQuery({
    search,
  });

  const visibleProjects = projects.filter((project) => {
    if (filter === "running") return project.status;
    if (filter === "completed") return !project.status;
    return true;
  });

  const filterClass = (value: ProjectFilter) =>
    value === filter
      ? "rounded-xl bg-white px-5 py-2 text-sm font-bold text-[#00176b] shadow-sm"
      : "rounded-xl px-5 py-2 text-sm font-bold text-slate-500";

  return (
    <div className="bg-white min-h-screen pb-24 font-sans text-slate-950 -mt-5">
      <main className="mx-auto w-full max-w-107.5 px-4 py-8 grid grid-cols-1 gap-5 ">
        <section className="grid grid-cols-1 gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-[#00176b] tracking-tight">
              Project Portfolio
            </h2>
            <p className="mt-1 text-sm leading-5 text-slate-500">
              Live project listings from the backend.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[21px] text-slate-400">
                search
              </span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-13 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-secondary focus:ring-4 focus:ring-sky-100"
                placeholder="Search by project name..."
                type="text"
              />
            </div>
          </div>
        </section>

        <section className="grid grid-flow-col auto-cols-max gap-2 overflow-x-auto rounded-2xl bg-slate-100 p-1.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button onClick={() => setFilter("all")} className={filterClass("all")}>
            All
          </button>
          <button
            onClick={() => setFilter("running")}
            className={filterClass("running")}
          >
            Running
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={filterClass("completed")}
          >
            Completed
          </button>
        </section>

        <section className="grid grid-cols-1 gap-5">
          {isLoading && (
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 text-sm font-bold text-[#00176b]">
              Loading projects...
            </div>
          )}

          {isError && (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-sm font-bold text-red-700">
              Could not load projects.
            </div>
          )}

          {!isLoading && !isError && visibleProjects.length === 0 && (
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 text-sm font-bold text-slate-600">
              No projects found.
            </div>
          )}

          {visibleProjects.map((project) => (
            <article
              key={project.id}
              className="overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-sm grid grid-cols-1"
            >
              <div className="h-44 overflow-hidden bg-slate-100">
                <img
                  className="h-full w-full object-cover"
                  alt={project.title}
                  src={project.image || img}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 p-5">
                <div className="grid grid-cols-[1fr_auto] gap-3 items-start">
                  <div className="min-w-0">
                    <span
                      className={`inline-flex w-fit rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide ${
                        project.status
                          ? "bg-blue-100 text-[#00176b]"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {project.status ? "Active" : "Completed"}
                    </span>
                    <h3 className="mt-3 text-xl leading-6 font-extrabold text-[#00176b]">
                      {project.title}
                    </h3>
                    <div className="mt-1 grid grid-cols-[auto_1fr] items-start gap-1 text-slate-500">
                      <span className="material-symbols-outlined text-body-md">
                        location_on
                      </span>
                      <p className="text-sm leading-5">{project.location}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <div className="grid grid-cols-2 text-sm">
                    <span className="text-slate-500">Project Status</span>
                    <span className="text-right font-extrabold text-[#00176b]">
                      {project.status ? "Running" : "Completed"}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full bg-[#07277f] ${
                        project.status ? "w-3/4" : "w-full"
                      }`}
                    />
                  </div>
                </div>

                <Link
                  to={`/project/${project.id}`}
                  className="justify-self-end grid grid-cols-[auto_auto] items-center gap-1 text-sm font-bold text-[#00176b]"
                >
                  View Details
                  <span className="material-symbols-outlined text-body-lg">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
};

export default ProjectPortfolio;
