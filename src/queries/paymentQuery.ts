import { baseApi } from "@/queries/baseApi";
import type {
  PaymentSummary,
  RecentTransactionsResponse,
} from "@/queries/types";

type RecentTransactionParams = {
  per_page?: number;
};

export const paymentQuery = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentSummary: builder.query<PaymentSummary, void>({
      query: () => "my-payment-history",
      providesTags: ["Payments"],
    }),
    getRecentTransactions: builder.query<
      RecentTransactionsResponse,
      RecentTransactionParams | void
    >({
      query: (params) => ({
        url: "recent-transactions",
        params: params?.per_page ? { per_page: params.per_page } : undefined,
      }),
      providesTags: ["Payments"],
    }),
  }),
});

export const { useGetPaymentSummaryQuery, useGetRecentTransactionsQuery } =
  paymentQuery;
