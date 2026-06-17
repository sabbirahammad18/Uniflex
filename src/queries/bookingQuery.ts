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
  payment_type: "installment" | "down payment";
  amount: number;
  account_id: number;
}

export interface InitiatePaymentResponse {
  checkout_url: string;
  project_payment_id: number;
}

// ── New types ──────────────────────────────────────────────────
export interface PaymentEntry {
  payment_id: number;
  amount: number;
  payment_type: string | null;
  is_approved: number;       // 0 pending | 1 approved | 2 rejected
  payment_date: string;
  payment_month: string;
  note: string | null;
  transaction_id: string | null;
}

interface ReceiptData {
  company: {
    name: string;
    address: string;
    website: string;
    mobile: string;
    logo: string;
  };
  receipt: {
    copy_type: string;
    receipt_no: string;
    receipt_date: string;
    start_date: string;
  };
  customer: {
    employee_uid: string;
    customer_name: string;
    mobile_number: string;
    email: string;
  };
  plot: {
    property_no: string | null;
    katha: string | null;
    block_no: string | null;
    road_no: string | null;
    description: string;
  };
  payment: {
    type: string;
    received_amount: number;
    amount_in_word: string;
    total_paid: number;
    next_date: string;
  };
  project: {
    project_id: number;
    project_name: string;
  };
}

export interface BookingDetailResponse {
  status: boolean;
  booking: {
    booking_id: number;
    project_id: number;
    is_approved: number;
    user_id: number;
    customer_uid: string;
    user_name: string;
    project_name: string;
    project_status: string;
    plot_price: number;
    booking_money: number;
    down_payment: number;
    installment_amount: number;
    total_paid_amount: number;
    remaining_amount: number;
    plot_size_khata: string | null;
  };
  payments: PaymentEntry[];
}

type BookingDetailsParams = {
  projectId: number;
  user_id?: string | null;
};

export interface MoneyReceiptParams {
  userId: number;
  paymentId: number;
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

    getBookingDetails: builder.query<
        BookingDetailResponse,
        BookingDetailsParams
    >({
      query: ({ projectId, user_id }) => ({
        url: `my-bookings/${projectId}`,
        method: "GET",
        params: {
          user_id,
        },
      }),
      providesTags: (_result, _err, { projectId }) => [
        { type: "Bookings", id: projectId },
      ],
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

    getMoneyReceipt: builder.query<ReceiptData, MoneyReceiptParams>({
      query: ({ userId, paymentId }) => ({
        url: `money-receipt/${userId}`,
        method: "GET",
        params: { paymentId },
      }),
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
  useGetBookingDetailsQuery,
  useGetMoneyReceiptQuery,
  useUpdateBookingStatusMutation,
  useGetPaymentSummaryQuery,
  useInitiatePaymentMutation,
} = bookingQuery;