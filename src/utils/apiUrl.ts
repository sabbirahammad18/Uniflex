import { apiBaseUrl } from "@/queries/baseApi";

export const getApiUrl = (path: string) => {
  if (/^https?:\/\//i.test(path)) return path;

  const normalizedBase = apiBaseUrl.replace(/\/$/, "");
  const normalizedPath = path.replace(/^\//, "");

  return `${normalizedBase}/${normalizedPath}`;
};
