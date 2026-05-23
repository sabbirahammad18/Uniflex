import { baseApi } from "@/queries/baseApi";
import type { ProjectDetails, ProjectSummary } from "@/queries/types";

type ProjectListParams = {
  search?: string;
};

export const projectQuery = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<ProjectSummary[], ProjectListParams | void>({
      query: (params) => ({
        url: "projects",
        params: params?.search ? { search: params.search } : undefined,
      }),
      providesTags: ["Projects"],
    }),
    getProject: builder.query<ProjectDetails, number | string>({
      query: (id) => `projects/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Project", id }],
    }),
  }),
});

export const { useGetProjectQuery, useGetProjectsQuery } = projectQuery;
