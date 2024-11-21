import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import Admin from "./pages/Admin";
import FeedPage from "./pages/FeedPage";
import LogInPage from "./pages/LogInPage";
import SignUpPage from "./pages/SignUpPage";

import Techwriter from './pages/Techwriter';
// import AdminTechwriterProtectedRoute from "./compAdminTechwriterProtectedRouteonents/";

import Techwriter from "./pages/Techwriter";
import AdminTechwriterProtectedRoute from "./components/AdminTechwriterProtectedRoute";

import ManagePosts from "./components/ManagePosts";
import FlaggedPosts from "./components/FlaggedPosts";
import ApprovedPosts from "./components/ApprovedPosts";
import PostPage from "./pages/PostPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import ManageUser from "./components/ManageUser"

import EditPostModal from "./components/EditPostModal"

import ManageCategory from "./components/ManageCategory";




function App() {
  const { isLoggedIn, userRole } = useSelector((state) => state.auth);

  return (
    <Router>
      <Navbar />
      <Routes>
        
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/post/:postId" element={<PostPage />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        <Route path="/Admin" element={<Admin />} />
        <Route path="/Techwriter" element={<Techwriter />} />
        
        
        
        {/* Admin Route with Nested Routes */}
        {/* <Route path="/admin" element={<Admin />}>

        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Admin Route */}
        <Route
          path="/Admin/*"
          element={
            <AdminTechwriterProtectedRoute
              isLoggedIn={isLoggedIn}
              userRole={userRole}  
              allowedRoles={["admin"]}
            >
              <Admin />
            </AdminTechwriterProtectedRoute>
          }
        >

          <Route path="manageusers" element={<ManageUser />} />
          <Route path="managecategory" element={<ManageCategory />} />
          <Route path="approvedposts" element={<ApprovedPosts />} />
          <Route path="flaggedposts" element={<FlaggedPosts />} />
        </Route>

   */}
        
        
        {/* Techwriter protected route */}
        {/* <Route


        {/* Techwriter Route */}
        <Route

          path="/techwriter/*"
          element={
            <AdminTechwriterProtectedRoute
              isLoggedIn={isLoggedIn}
              userRole={userRole}  
              allowedRoles={["techwriter", "admin"]}
            >
              <Techwriter />
            </AdminTechwriterProtectedRoute>
          }
        >

       
          <Route path="manageposts" element={<ManagePosts />} />
          <Route path="flaggedposts" element={<FlaggedPosts />} />
          <Route path="approvedposts" element={<ApprovedPosts />} />
        </Route> */}
      </Routes>
    </Router>
  );
}

export default App;
