// queries/withdrawQuery.ts
import { baseApi } from "@/queries/baseApi";
import type { ApiMessageResponse } from "@/queries/types";

export type WithdrawRequestPayload = {
    amount: number;
    road_no: string;
    block_no: string;
    sector_no: string;
    property_no: string;
    category_id: number;
};

export const withdrawQuery = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        withdrawRequest: builder.mutation<ApiMessageResponse, WithdrawRequestPayload>({
            query: (body) => ({
                url: "withdraw-request",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const { useWithdrawRequestMutation } = withdrawQuery;