import { baseApi } from "@/queries/baseApi";
import type {
  ManagementBookingsParams,
  ManagementBookingsResponse,
  ManagementUserProfileResponse,
  ManagementUsersParams,
  ManagementUsersResponse,
  PendingBookingEditResponse,
  PendingBookingPropertyCheckPayload,
  PendingBookingPropertyCheckResponse,
  PendingBookingUpdatePayload,
  UpdateManagementUserPayload,
  ApiMessageResponse,
} from "@/queries/types";

const toManagementUserFormData = (payload: UpdateManagementUserPayload) => {
  const formData = new FormData();

  const append = (key: string, value: unknown) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    formData.append(key, String(value));
  };

  append("name", payload.name);
  append("email", payload.email);
  append("role_id", payload.role_id);
  append("designation", payload.designation);
  append("phone_number", payload.phone_number);
  append("uid", payload.uid);
  append("reference", payload.reference);
  append("mo", payload.mo);
  append("agm", payload.agm);
  append("gm", payload.gm);
  append("ed", payload.ed);
  append("status", Number(payload.status ?? 0));
  append("father_name", payload.father_name);
  append("mother_name", payload.mother_name);
  append("husband_spouse", payload.husband_spouse);
  append("nid", payload.nid);
  append("dob", payload.dob);
  append("education", payload.education);
  append("permanent_address", payload.permanent_address);
  append("present_address", payload.present_address);
  append("bank_name", payload.bank_name);
  append("branch_name", payload.branch_name);
  append("bank_account_no", payload.bank_account_no);
  append("bank_routing_no", payload.bank_routing_no);
  append("mobile_banking_portal", payload.mobile_banking_portal);
  append("mobile_banking_ac_no", payload.mobile_banking_ac_no);
  append("nominee_name1", payload.nominee_name1);
  append("nominee_relation1", payload.nominee_relation1);
  append("nominee_age1", payload.nominee_age1);
  append("nominee_mobile1", payload.nominee_mobile1);
  append("nominee_percentage1", payload.nominee_percentage1);
  append("nominee_name2", payload.nominee_name2);
  append("nominee_relation2", payload.nominee_relation2);
  append("nominee_age2", payload.nominee_age2);
  append("nominee_mobile2", payload.nominee_mobile2);
  append("nominee_percentage2", payload.nominee_percentage2);

  if (payload.password) {
    formData.append("password", payload.password);
  }

  if (payload.avatar) {
    formData.append("avatar", payload.avatar);
  }

  return formData;
};

const toPendingBookingFormData = (payload: PendingBookingUpdatePayload) => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (key === "id" || value === undefined || value === null || value === "") {
      return;
    }

    if (value instanceof File) {
      formData.append(key, value);
      return;
    }

    formData.append(key, String(value));
  });

  return formData;
};

export const managementQuery = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getManagementUsers: builder.query<
      ManagementUsersResponse,
      ManagementUsersParams | void
    >({
      query: (params) => ({
        url: "management-users",
        method: "GET",
        params: {
          page: params?.page ?? 1,
          per_page: params?.per_page ?? 10,
          ...(params?.search ? { search: params.search } : {}),
          ...(params?.role_id !== undefined && params?.role_id !== ""
            ? { role_id: params.role_id }
            : {}),
          ...(params?.status !== undefined && params?.status !== ""
            ? { status: params.status }
            : {}),
        },
      }),
      providesTags: ["ManagementUsers"],
    }),

    getManagementUser: builder.query<ManagementUserProfileResponse, number>({
      query: (id) => ({
        url: `users/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "ManagementUsers", id }],
    }),

    updateManagementUser: builder.mutation<
      ApiMessageResponse,
      UpdateManagementUserPayload
    >({
      query: ({ id, ...payload }) => ({
        url: `users/${id}/update`,
        method: "POST",
        body: toManagementUserFormData(payload),
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "ManagementUsers",
        { type: "ManagementUsers", id },
      ],
    }),

    getManagementBookings: builder.query<
      ManagementBookingsResponse,
      ManagementBookingsParams | void
    >({
      query: (params) => ({
        url: "management-bookings",
        method: "GET",
        params: {
          page: params?.page ?? 1,
          per_page: params?.per_page ?? 10,
          ...(params?.search ? { search: params.search } : {}),
          ...(params?.status !== undefined && params?.status !== ""
            ? { status: params.status }
            : {}),
          ...(params?.payment_status ? { payment_status: params.payment_status } : {}),
        },
      }),
      providesTags: ["ManagementBookings"],
    }),

    getPendingBookingEdit: builder.query<PendingBookingEditResponse, number>({
      query: (id) => ({
        url: `pending-bookings/${id}/edit`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "ManagementBookings", id }],
    }),

    checkPendingBookingProperty: builder.mutation<
      PendingBookingPropertyCheckResponse,
      PendingBookingPropertyCheckPayload
    >({
      query: (payload) => ({
        url: "pending-bookings/property-check",
        method: "POST",
        body: payload,
      }),
    }),

    updatePendingBooking: builder.mutation<
      ApiMessageResponse,
      PendingBookingUpdatePayload
    >({
      query: ({ id, ...payload }) => ({
        url: `pending-bookings/${id}/update`,
        method: "POST",
        body: toPendingBookingFormData(payload),
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "ManagementBookings",
        { type: "ManagementBookings", id },
      ],
    }),
  }),
});

export const {
  useGetManagementUsersQuery,
  useGetManagementUserQuery,
  useUpdateManagementUserMutation,
  useGetManagementBookingsQuery,
  useGetPendingBookingEditQuery,
  useCheckPendingBookingPropertyMutation,
  useUpdatePendingBookingMutation,
} = managementQuery;
