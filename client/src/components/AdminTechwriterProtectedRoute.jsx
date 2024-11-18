import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminTechwriterProtectedRoute = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userRole = useSelector((state) => state.auth.userRole);

  const allowedRoles = ["Admin", "techwriter"];

  if (!isLoggedIn || !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default AdminTechwriterProtectedRoute;
