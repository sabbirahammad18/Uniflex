import { baseApi } from "@/queries/baseApi";
import type {
  NotificationListParams,
  NotificationListResponse,
  NotificationMutationResponse,
} from "@/queries/types";

export const notificationQuery = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<
      NotificationListResponse,
      NotificationListParams | void
    >({
      query: (params) => ({
        url: "notifications",
        params: {
          page: params?.page ?? 1,
          per_page: params?.per_page ?? 20,
        },
      }),
      providesTags: ["Notifications"],
    }),
    markNotificationAsRead: builder.mutation<
      NotificationMutationResponse,
      string
    >({
      query: (id) => ({
        url: `notifications/${id}/read`,
        method: "POST",
      }),
      invalidatesTags: ["Notifications"],
    }),
    markAllNotificationsAsRead: builder.mutation<
      NotificationMutationResponse,
      void
    >({
      query: () => ({
        url: "notifications/read-all",
        method: "POST",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
} = notificationQuery;
