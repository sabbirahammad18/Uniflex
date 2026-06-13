import { baseApi } from "@/queries/baseApi";

export interface PageResponse {
    id: number;
    name: string;
    slug: string;
    content: string;
}

export const pageQuery = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getPage: builder.query<PageResponse, string>({
            query: (slug) => ({
                url: `pages/${slug}`,
                method: "GET",
            }),
            providesTags: ["Pages"],
        }),
    }),
});

export const { useGetPageQuery } = pageQuery;