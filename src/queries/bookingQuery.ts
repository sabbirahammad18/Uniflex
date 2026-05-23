import { baseApi } from "@/queries/baseApi";
import type { BookingListResponse } from "@/queries/types";

export const bookingQuery = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBookings: builder.query<BookingListResponse, void>({
      query: () => "my-bookings",
      providesTags: ["Bookings"],
    }),
  }),
});

export const { useGetBookingsQuery } = bookingQuery;
