
// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// const AdminTechwriterProtectedRoute = ({ children }) => {
//   const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
//   const userRole = useSelector((state) => state.auth.userRole);

//   const allowedRoles = ["Admin", "techwriter"];

//   if (!isLoggedIn || !allowedRoles.includes(userRole)) {
//     return <Navigate to="/login" />;
//   }
//   return children;
// };

import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const AdminTechwriterProtectedRoute = ({ allowedRoles = [], children }) => {
  const { isLoggedIn, userRole } = useSelector((state) => state.auth); // userRole is the Redux value
  const location = useLocation(); // Get the current location

  console.log("User is logged in:", isLoggedIn);
  console.log("User role:", userRole); 
  console.log("Allowed roles:", allowedRoles);

  // If the user is not logged in or does not have the required role
  if (!isLoggedIn || !userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children; // Render the children if authorized
};

AdminTechwriterProtectedRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.node.isRequired,
};


// export default AdminTechwriterProtectedRoute;
