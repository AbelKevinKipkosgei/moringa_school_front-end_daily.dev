import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Admin from "./pages/Admin";
import FeedPage from "./pages/FeedPage";
import LogInPage from "./pages/LogInPage";
import SignUpPage from "./pages/SignUpPage";
import Techwriter from "./pages/Techwriter";
import AdminTechwriterProtectedRoute from "./components/AdminTechwriterProtectedRoute";
import ManagePosts from "./components/ManagePosts";
import FlaggedPosts from "./components/FlaggedPosts";
import ApprovedPosts from "./components/ApprovedPosts";
import PostPage from "./pages/PostPage";
import ManageUser from "./components/ManageUser";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import ManageUser from "./components/ManageUser"
import ManageCategory from "./components/ManageCategory";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/post/:postId" element={<PostPage />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/unauthorized" component={UnauthorizedPage} />

        {/* Admin Route */}
        <Route path="/admin/*" element={<Admin />}>
          <Route path="manageusers" element={<ManageUser />} />
          <Route path="managecategory" element={<ManageCategory />} />
          <Route path="approvedposts" element={<ApprovedPosts />} />
          <Route path="flaggedposts" element={<FlaggedPosts />} />
        </Route>

        {/* Techwriter Protected Route with Nested Routes */}
        <Route
          path="/techwriter/*"
          element={
            <AdminTechwriterProtectedRoute
              allowedRoles={["techwriter", "admin"]}
            >
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
