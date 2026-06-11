import { baseApi } from "@/queries/baseApi";
import type {
  EarningBreakdownResponse,
  PlotSearch,
  PromotionStatus,
} from "@/queries/types";

type EarningBreakdownQuery = {
  date?: string;
};

export const dashboardQuery = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEarningBreakdown: builder.query<
        EarningBreakdownResponse,
        EarningBreakdownQuery | void
    >({
      query: ({ date } = {}) => ({
        url: "earning-breakdown",
        method: "GET",
        params: { date },
      }),
      providesTags: ["Earnings"],
    }),

    getPromotionStatus: builder.query<PromotionStatus, void>({
      query: () => "my-promotion-status",
      providesTags: ["Promotion"],
    }),

    getPlotSearch: builder.query<PlotSearch, {
      sector_no: string;
      block: string;
      road_no: string;
      plot: string;
    }>({
      query: (body) => ({
        url: "plot-search",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetEarningBreakdownQuery,
  useGetPromotionStatusQuery,
  useLazyGetPlotSearchQuery,
} = dashboardQuery;
