import React from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import "../styles/Techwriter.css";

const Techwriter = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Function to check active link
  const isActive = (path) => location.pathname === path;

  // Handlers for navigation
  const handleManagePosts = () => navigate("/techwriter/manageposts");
  const handleApprovedPosts = () => navigate("/techwriter/approvedposts");
  const handleCategory = () => navigate("/techwriter/managecategory");

  return (
    <div className="techwriter-page">
      {/* Sidebar Navigation */}
      <nav className="sidebar">
        <h2 className="sidebar-heading">Techwriter Dashboard</h2>
        <ul className="sidebar-nav">
          <li
            className={isActive("/techwriter/manageposts") ? "active" : ""}
            onClick={handleManagePosts}
          >
            Manage Posts
          </li>
          <li
            className={isActive("/techwriter/approvedposts") ? "active" : ""}
            onClick={handleApprovedPosts}
          >
            Approved Posts
          </li>
          <li
            className={isActive("/techwriter/managecategory") ? "active" : ""}
            onClick={handleCategory}
          >
            Categories
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        <Outlet /> {/* Renders nested routes */}
      </div>
    </div>
  );
};

export default Techwriter;
