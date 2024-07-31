// PrivateRoute.js
import { useEffect } from "react";

import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("idddddd");
    return <Navigate to="/" replace />;
  } else {
    console.log("SDfsdfdsfsfdsf");
  }

  return children;
}
export default PrivateRoute;
