import type { ApiUser } from "@/queries/types";

export const getUserUid = (user: Pick<ApiUser, "uid"> | null | undefined) =>
  (user?.uid || "").trim();

export const isCustomerUser = (user: ApiUser | null | undefined) => {
  const uid = getUserUid(user).toUpperCase();
  const roleId = String(user?.role_id ?? "");
  const designation = (user?.designation || "").toLowerCase();

  return uid.startsWith("UC") || roleId === "2" || designation === "customer";
};

export const isSuperAdminUser = (user: ApiUser | null | undefined) => {
  const roleId = String(user?.role_id ?? "");
  const designation = (user?.designation || "").toLowerCase();

  return roleId === "1" || designation === "admin" || designation === "super admin";
};

export const isTeamUser = (user: ApiUser | null | undefined) => {
  const uid = getUserUid(user).toUpperCase();
  const firstLetter = uid.charAt(0);

  return ["M", "E", "A", "G"].includes(firstLetter);
};

export const getDataScopeLabel = (user: ApiUser | null | undefined) => {
  if (isSuperAdminUser(user)) return "All company data";
  if (isCustomerUser(user)) return "Your booking and payment data";
  if (isTeamUser(user)) return "Your assigned data";

  return "Your data";
};
