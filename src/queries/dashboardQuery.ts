import { baseApi } from "@/queries/baseApi";
import type {
  EarningBreakdownResponse,
  PromotionStatus,
} from "@/queries/types";

export const dashboardQuery = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEarningBreakdown: builder.query<EarningBreakdownResponse, void>({
      query: () => "earning-breakdown",
      providesTags: ["Earnings"],
    }),
    getPromotionStatus: builder.query<PromotionStatus, void>({
      query: () => "my-promotion-status",
      providesTags: ["Promotion"],
    }),
  }),
});

export const { useGetEarningBreakdownQuery, useGetPromotionStatusQuery } =
  dashboardQuery;
