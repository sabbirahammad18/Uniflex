import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useGetCurrentUserQuery } from "@/queries/authQuery";
import { hasUserRole, type UserRole } from "@/utils/userAccess";

const FullPageLoader = () => (
  <div className="grid min-h-screen place-items-center bg-white text-[#07277F]">
    <div className="grid place-items-center gap-3">
      <span className="material-symbols-outlined animate-pulse text-4xl">
        progress_activity
      </span>
      <p className="text-sm font-semibold">Loading account</p>
    </div>
  </div>
);

type ProtectedRouteProps = {
  allowedRoles?: UserRole[];
  unauthorizedRedirectTo?: string;
};

export const ProtectedRoute = ({
  allowedRoles,
  unauthorizedRedirectTo = "/profile",
}: ProtectedRouteProps = {}) => {
  const location = useLocation();
  const { data, isLoading, isFetching } = useGetCurrentUserQuery();

  if (isLoading || (isFetching && !data)) {
    return <FullPageLoader />;
  }

  if (!data?.user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles?.length && !hasUserRole(data.user, allowedRoles)) {
    return (
      <Navigate
        to={unauthorizedRedirectTo}
        state={{ from: location, unauthorized: true }}
        replace
      />
    );
  }

  return <Outlet />;
};

export const GuestRoute = () => {
  const { data, isLoading, isFetching } = useGetCurrentUserQuery();

  if (isLoading || (isFetching && !data)) {
    return <FullPageLoader />;
  }

  if (data?.user) {
    return <Navigate to="/profile" replace />;
  }

  return <Outlet />;
};
