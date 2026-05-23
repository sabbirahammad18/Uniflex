import { baseApi } from "@/queries/baseApi";
import type {
  PayoutBalanceResponse,
  PayoutHistoryResponse,
  PayoutRequestPayload,
  PayoutRequestResponse,
} from "@/queries/types";

export const payoutQuery = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayoutBalance: builder.query<PayoutBalanceResponse, void>({
      query: () => "payout-balance",
      providesTags: ["Payouts"],
    }),
    createPayoutRequest: builder.mutation<
      PayoutRequestResponse,
      PayoutRequestPayload
    >({
      query: (body) => ({
        url: "payout-request",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Payouts", "Payments", "Profile"],
    }),
    getPayoutHistory: builder.query<PayoutHistoryResponse, void>({
      query: () => "payout-request-history",
      providesTags: ["Payouts"],
    }),
    getPayoutRequest: builder.query<PayoutRequestResponse, number | string>({
      query: (id) => `payout-request/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Payouts", id }],
    }),
  }),
});

export const {
  useCreatePayoutRequestMutation,
  useGetPayoutBalanceQuery,
  useGetPayoutHistoryQuery,
  useGetPayoutRequestQuery,
} = payoutQuery;
