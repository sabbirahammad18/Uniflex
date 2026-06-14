import { baseApi } from "@/queries/baseApi";
import type {
  ManagementBookingsParams,
  ManagementBookingsResponse,
  ManagementUsersParams,
  ManagementUsersResponse,
} from "@/queries/types";

export const managementQuery = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getManagementUsers: builder.query<
      ManagementUsersResponse,
      ManagementUsersParams | void
    >({
      query: (params) => ({
        url: "management-users",
        method: "GET",
        params: {
          page: params?.page ?? 1,
          per_page: params?.per_page ?? 10,
          ...(params?.search ? { search: params.search } : {}),
          ...(params?.role_id !== undefined && params?.role_id !== ""
            ? { role_id: params.role_id }
            : {}),
          ...(params?.status !== undefined && params?.status !== ""
            ? { status: params.status }
            : {}),
        },
      }),
      providesTags: ["ManagementUsers"],
    }),

    getManagementBookings: builder.query<
      ManagementBookingsResponse,
      ManagementBookingsParams | void
    >({
      query: (params) => ({
        url: "management-bookings",
        method: "GET",
        params: {
          page: params?.page ?? 1,
          per_page: params?.per_page ?? 10,
          ...(params?.search ? { search: params.search } : {}),
          ...(params?.payment_status ? { payment_status: params.payment_status } : {}),
        },
      }),
      providesTags: ["ManagementBookings"],
    }),
  }),
});

export const {
  useGetManagementUsersQuery,
  useGetManagementBookingsQuery,
} = managementQuery;
