import React from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import "../styles/Techwriter.css";

const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Function to check active link
  const isActive = (path) => location.pathname === path;

  // Handlers for navigation
  const handleManageUser = () => navigate("/admin/manageusers");
  const handleApprovedPosts = () => navigate("/admin/approvedposts");
  const handleCategory = () => navigate("/admin/managecategory");

  return (
    <div className="admin-page">
      
      <nav className="sidebar">
        <h2 className="sidebar-heading">Admin Dashboard</h2>
        <ul className="sidebar-nav">
          <li
            className={isActive("/admin/manageusers") ? "active" : ""}
            onClick={handleManageUser}
          >
            Users
          </li>
          <li
            className={isActive("/admin/approvedposts") ? "active" : ""}
            onClick={handleApprovedPosts}
          >
            Approved Posts
          </li>
          
          <li
            className={isActive("/admin/managecategory") ? "active" : ""}
            onClick={handleCategory}
          >
            Categories
          </li>
        </ul>
      </nav>


      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;
