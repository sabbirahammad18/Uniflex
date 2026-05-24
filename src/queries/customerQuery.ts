import { baseApi } from "@/queries/baseApi";
import type { CustomerListParams, CustomerListResponse } from "@/queries/types";

export const customerQuery = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<CustomerListResponse, CustomerListParams | void>({
      query: (params) => ({
        url: "customers",
        params: {
          page: params?.page ?? 1,
          per_page: params?.per_page ?? 10,
          ...(params?.search ? { search: params.search } : {}),
        },
      }),
      providesTags: ["Customers"],
    }),
  }),
});

export const { useGetCustomersQuery } = customerQuery;
