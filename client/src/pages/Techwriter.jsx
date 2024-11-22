

import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import ManagePosts from "../components/ManagePosts";


import "../styles/Techwriter.css";

// Mock component for Manage Posts


const Techwriter = () => {
  const [activeTab, setActiveTab] = useState("manageposts");
  const location = useLocation();

  // Function to check active link
  const isActive = (tab) => activeTab === tab;

  // Handlers for tabs
  const handleManagePosts = () => setActiveTab("manageposts");
  const handleApprovedPosts = () => setActiveTab("approvedposts");
  const handleFlaggedPosts = () => setActiveTab("flaggedposts");

  return (
    <div className="techwriter-page">
      {/* Sidebar */}
      <nav className="sidebar">
        <h2 className="sidebar-heading">Techwriter Dashboard</h2>
        <ul className="sidebar-nav">
          <li
            className={isActive("manageposts") ? "active" : ""}
            onClick={handleManagePosts}
          >
            Manage Posts
          </li>
          <li
            className={isActive("approvedposts") ? "active" : ""}
            onClick={handleApprovedPosts}
          >
            Approved Posts
          </li>
          
        </ul>
      </nav>

      {/* Main Content */}
      <div className="main-content">

        {activeTab === "manageposts" && <ManagePosts />}
        {activeTab === "approvedposts" && (
          <div className="approved-posts">Approved Posts</div>
        )}
        

        <Outlet /> {/* Required to render nested routes */}

      </div>
    </div>
  );
};

export default Techwriter;
