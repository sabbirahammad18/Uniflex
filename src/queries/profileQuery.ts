import { baseApi } from "@/queries/baseApi";
import { setCredentials } from "@/store/authSlice";
import type {
  ProfileResponse,
  UpdateProfilePayload,
  UserProfile,
} from "@/queries/types";

const toProfileFormData = (payload: UpdateProfilePayload) => {
  const formData = new FormData();

  if (payload.name !== undefined) {
    formData.append("name", payload.name);
  }

  if (payload.phone_number !== undefined) {
    formData.append("phone_number", payload.phone_number);
  }

  if (payload.avatar) {
    formData.append("avatar", payload.avatar);
  }

  return formData;
};

export const profileQuery = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<ProfileResponse, void>({
      query: () => "profile",
      providesTags: ["Profile"],
    }),
    updateProfile: builder.mutation<UserProfile, UpdateProfilePayload>({
      query: (payload) => ({
        url: "update-profile",
        method: "POST",
        body: toProfileFormData(payload),
      }),
      invalidatesTags: ["Profile", "Session"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setCredentials(data));
      },
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = profileQuery;
