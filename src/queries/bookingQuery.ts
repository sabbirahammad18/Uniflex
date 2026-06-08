import { baseApi } from "@/queries/baseApi";
import type { BookingListResponse } from "@/queries/types";

export const bookingQuery = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Updated query endpoint that dynamically targets server filter keys
    getBookings: builder.query<
        BookingListResponse,
        { payment_status?: string; status?: string } | void
    >({
      query: (params) => ({
        url: "my-bookings",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["Bookings"],
    }),

    // New mutation endpoint to post action payloads to the project status controller
    updateBookingStatus: builder.mutation<
        void,
        { bookingId: number; project_status: "1" | "2" }
    >({
      query: ({ bookingId, project_status }) => ({
        url: `my-bookings/${bookingId}/change-status`,
        method: "POST",
        body: {
          status: project_status,
        },
      }),
      invalidatesTags: ["Bookings"], // Automatically refetches updated listings lists
    }),
  }),
});

export const { useGetBookingsQuery, useUpdateBookingStatusMutation } = bookingQuery;