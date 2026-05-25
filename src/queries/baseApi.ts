import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;

  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
};

export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "/api";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
    credentials: "include",
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      headers.set("X-Requested-With", "XMLHttpRequest");

      const xsrfToken = getCookie("XSRF-TOKEN");
      if (xsrfToken) {
        headers.set("X-XSRF-TOKEN", xsrfToken);
      }

      return headers;
    },
  }),
  tagTypes: [
    "Session",
    "Profile",
    "Projects",
    "Project",
    "Bookings",
    "Earnings",
    "Payments",
    "Payouts",
    "Promotion",
    "Tree",
    "Customers",
  ],
  endpoints: () => ({}),
});
