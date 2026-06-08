import type { ApiUser } from "@/queries/types";

export type UserRole = string;

export const normalizeUserRole = (role: string | null | undefined) =>
  (role || "").trim().toLowerCase().replace(/[\s_]+/g, "-");

export const getUserUid = (user: Pick<ApiUser, "uid"> | null | undefined) =>
  (user?.uid || "").trim();

export const isCustomerUser = (user: ApiUser | null | undefined) => {
  const uid = getUserUid(user).toUpperCase();
  const roleId = String(user?.role_id ?? "");
  const role = normalizeUserRole(user?.role);
  const designation = (user?.designation || "").toLowerCase();

  return uid.startsWith("UC") || roleId === "2" || role === "customer" || designation === "customer";
};

export const isSuperAdminUser = (user: ApiUser | null | undefined) => {
  const roleId = String(user?.role_id ?? "");
  const role = normalizeUserRole(user?.role);
  const designation = (user?.designation || "").toLowerCase();

  return (
    roleId === "1" ||
    role === "super-admin" ||
    role === "admin" ||
    designation === "admin" ||
    designation === "super admin"
  );
};

export const getUserRole = (user: ApiUser | null | undefined): UserRole => {
  const role = normalizeUserRole(user?.role);

  if (role) return role;
  if (isSuperAdminUser(user)) return "super-admin";
  if (isCustomerUser(user)) return "customer";

  return normalizeUserRole(user?.designation);
};

export const hasUserRole = (
  user: ApiUser | null | undefined,
  allowedRoles: UserRole[],
) => {
  const role = getUserRole(user);

  return allowedRoles.map(normalizeUserRole).includes(role);
};

export const isMarketingUser = (user: ApiUser | null | undefined) => {
  return hasUserRole(user, ["marketing"]);
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
