import { baseApi } from "@/queries/baseApi";
import type {
  EarningBreakdownQuery,
  EarningBreakdownResponse,
  PromotionStatus,
} from "@/queries/types";


export const dashboardQuery = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEarningBreakdown: builder.query<
        EarningBreakdownResponse,
        EarningBreakdownQuery | void
    >({
      query: ({ date, date_from, date_to, category_id, page, per_page } = {}) => ({
        url: "earning-breakdown",
        method: "GET",
        params: {
          date,
          date_from,
          date_to,
          category_id: Array.isArray(category_id)
              ? category_id.join(",")
              : category_id,
          page,
          per_page,
        },
      }),
      providesTags: ["Earnings"],
    }),

    getPromotionStatus: builder.query<PromotionStatus, void>({
      query: () => "my-promotion-status",
      providesTags: ["Promotion"],
    }),

    getPlotSearch: builder.query<number, {
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
