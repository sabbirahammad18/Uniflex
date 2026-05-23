import { baseApi } from "@/queries/baseApi";
import type { UserTreeResponse } from "@/queries/types";

export const userTreeQuery = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyTree: builder.query<UserTreeResponse, void>({
      query: () => "my-tree",
      providesTags: ["Tree"],
    }),
  }),
});

export const { useGetMyTreeQuery } = userTreeQuery;
