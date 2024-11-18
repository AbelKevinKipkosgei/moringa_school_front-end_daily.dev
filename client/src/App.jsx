import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux"; // Import useSelector to access state
import Navbar from "./components/Navbar";
import Admin from "./pages/Admin";
import FeedPage from "./pages/FeedPage";
import LogInPage from "./pages/LogInPage";
import SignUpPage from "./pages/SignUpPage";
import Techwriter from './pages/Techwriter';
import AdminTechwriterProtectedRoute from "./components/AdminTechwriterProtectedRoute";
import ManagePosts from "./components/ManagePosts";
import FlaggedPosts from "./components/FlaggedPosts";
import ApprovedPosts from "./components/ApprovedPosts";
import ManageUser from "./components/ManageUser"


function App() {
  // Accessing the state using useSelector
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userRole = useSelector((state) => state.auth.userRole);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/Admin" element={<Admin />} />
        
        
        
        {/* Admin Route with Nested Routes */}
        <Route path="/admin" element={<Admin />}>
          <Route path="manageusers" element={<ManageUser />} />
          <Route path="approvedposts" element={<ApprovedPosts />} />
          <Route path="flaggedposts" element={<FlaggedPosts />} />
        </Route>
  
        
        
        {/* Techwriter protected route */}
        <Route
          path="/techwriter/*"
          element={
            <AdminTechwriterProtectedRoute isLoggedIn={isLoggedIn} userRole={userRole}>
              <Techwriter />
            </AdminTechwriterProtectedRoute>
          }
        >
          {/* Nested routes inside Techwriter */}
          <Route path="manageposts" element={<ManagePosts />} />
          <Route path="flaggedposts" element={<FlaggedPosts />} />
          <Route path="approvedposts" element={<ApprovedPosts />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;