import { useSelector } from "react-redux";
import { useLocation, Navigate, Outlet } from "react-router-dom";

const RequireAuth = ({ allowedRoles }) => {
  const { data: auth } = useSelector((state) => state.login);
  const location = useLocation();
  // for multiple roles
  //  auth?.roles?.find((role) => allowedRoles?.includes(role)) ?
  return allowedRoles?.includes(auth.data?.role) ? (
    <Outlet />
  ) : (
    !auth.data?.accessToken && (
      <Navigate to="/" state={{ from: location }} replace />
    )
  );
};

export default RequireAuth;
