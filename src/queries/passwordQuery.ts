import { baseApi } from "@/queries/baseApi";
import type { ApiMessageResponse, ChangePasswordPayload } from "@/queries/types";

export const passwordQuery = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    changePassword: builder.mutation<
      ApiMessageResponse,
      ChangePasswordPayload
    >({
      query: (body) => ({
        url: "change-password",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useChangePasswordMutation } = passwordQuery;
