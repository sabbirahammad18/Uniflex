import { baseApi } from "@/queries/baseApi";
import { clearCredentials, setCredentials } from "@/store/authSlice";
import type {
  ApiMessageResponse,
  AuthResponse,
  ForgotPasswordPayload,
  LoginCredentials,
  ResetPasswordPayload,
  VerifyOtpPayload,
} from "@/queries/types";

export const authQuery = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (body) => ({
        url: "login",
        method: "POST",
        body,
      }),
      invalidatesTags: (result) => (result ? ["Session", "Profile"] : []),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data.user));
        } catch {
          dispatch(clearCredentials());
        }
      },
    }),
    getCurrentUser: builder.query<AuthResponse, void>({
      query: () => "user",
      providesTags: ["Session"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data.user));
        } catch {
          dispatch(clearCredentials());
        }
      },
    }),
    logout: builder.mutation<ApiMessageResponse, void>({
      query: () => ({
        url: "logout",
        method: "POST",
      }),
      invalidatesTags: ["Session", "Profile", "Earnings", "Payments"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(clearCredentials());
          dispatch(baseApi.util.resetApiState());
        }
      },
    }),
    forgotPasswordSendOtp: builder.mutation<
      ApiMessageResponse,
      ForgotPasswordPayload
    >({
      query: (body) => ({
        url: "forgot-password/send-otp",
        method: "POST",
        body,
      }),
    }),
    forgotPasswordVerifyOtp: builder.mutation<
      ApiMessageResponse,
      VerifyOtpPayload
    >({
      query: (body) => ({
        url: "forgot-password/verify-otp",
        method: "POST",
        body,
      }),
    }),
    forgotPasswordReset: builder.mutation<
      ApiMessageResponse,
      ResetPasswordPayload
    >({
      query: (body) => ({
        url: "forgot-password/reset",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useForgotPasswordResetMutation,
  useForgotPasswordSendOtpMutation,
  useForgotPasswordVerifyOtpMutation,
  useGetCurrentUserQuery,
  useLoginMutation,
  useLogoutMutation,
} = authQuery;
