import React from "react";
import { Navigate } from "react-router-dom";
import { getRoleHome } from "../service/authService";

function ProtectedRoute({ children, allowedRoles }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const role = localStorage.getItem("role");

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={getRoleHome()} replace />;
  }

  return children;
}

export default ProtectedRoute;
