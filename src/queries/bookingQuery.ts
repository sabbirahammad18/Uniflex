import { baseApi } from "@/queries/baseApi";
import type { BookingListResponse } from "@/queries/types";

export interface PaymentSummary {
  booking_id: number;
  project_name: string;
  total_price: number;
  total_paid: number;
  remaining: number;
  payment_count: number;
}

export interface InitiatePaymentRequest {
  booking_id: number;
  payment_type: "installment" | "downpayment";
  amount: number;
  account_id: number;
}

export interface InitiatePaymentResponse {
  checkout_url: string;
  project_payment_id: number;
}

export const bookingQuery = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBookings: builder.query<
        BookingListResponse,
        { payment_status?: string; status?: string; page?: number } | void
    >({
      query: (params) => ({
        url: "my-bookings",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["Bookings"],
    }),

    updateBookingStatus: builder.mutation<
        void,
        { bookingId: number; project_status: "1" | "2" }
    >({
      query: ({ bookingId, project_status }) => ({
        url: `my-bookings/${bookingId}/change-status`,
        method: "POST",
        body: { status: project_status },
      }),
      invalidatesTags: ["Bookings"],
    }),

    getPaymentSummary: builder.query<PaymentSummary, number>({
      query: (bookingId) => ({
        url: `project-payments/${bookingId}/summary`,
        method: "GET",
      }),
      providesTags: (_result, _err, bookingId) => [
        { type: "Bookings", id: bookingId },
      ],
    }),

    initiatePayment: builder.mutation<
        InitiatePaymentResponse,
        InitiatePaymentRequest
    >({
      query: (body) => ({
        url: "project-payments/initiate",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetBookingsQuery,
  useUpdateBookingStatusMutation,
  useGetPaymentSummaryQuery,
  useInitiatePaymentMutation,
} = bookingQuery;