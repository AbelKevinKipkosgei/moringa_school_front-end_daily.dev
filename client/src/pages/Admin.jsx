import React from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Function to check active link
  const isActive = (path) => location.pathname === path;

  // Handlers for navigation
  const handleManageUser = () => navigate("/admin/manageusers");
  const handleApprovedPosts = () => navigate("/admin/approvedposts");
  const handleFlaggedPosts = () => navigate("/admin/flaggedposts");
  const handleCategories = () => navigate("/admin/managecategories");

  return (
    <div className="admin-page">
      {/* Sidebar */}
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
            className={isActive("/admin/flaggedposts") ? "active" : ""}
            onClick={handleFlaggedPosts}
          >
            Flagged Posts
          </li>
          <li
            className={isActive("/admin/managecategories") ? "active" : ""}
            onClick={handleCategories}
          >
            Categories
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Admin; // Ensure default export
