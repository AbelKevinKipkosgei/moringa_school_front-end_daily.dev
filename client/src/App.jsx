import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import Admin from "./pages/Admin";
import FeedPage from "./pages/FeedPage";
import LogInPage from "./pages/LogInPage";
import SignUpPage from "./pages/SignUpPage";
import Techwriter from './pages/Techwriter';
import AdminTechwriterProtectedRoute from "./components/AdminTechwriterProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute"
import ManagePosts from "./components/ManagePosts";
import ApprovedPosts from "./components/ApprovedPosts";
import PostPage from "./pages/PostPage";
import ManageUser from "./components/ManageUser"
import ManageCategory from "./components/ManageCategory";
import CreatePostPage from "./pages/CreatePostPage";




function App() {
  const { isLoggedIn, userRole } = useSelector((state) => state.auth);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<FeedPage />} />
        <Route path="/post/:postId" element={<PostPage />} />
        <Route path="/create-post" element={<CreatePostPage />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/Techwriter" element={<Techwriter />} />

        {/* Admin Route */}
        <Route
          path="/Admin/*"
          element={
            <AdminProtectedRoute
              isLoggedIn={isLoggedIn}
              userRole={userRole}
              allowedRoles={["admin"]}
            >
              <Admin />
            </AdminProtectedRoute>
          }
        >

          <Route path="manageusers" element={<ManageUser />} />
          <Route path="managecategory" element={<ManageCategory />} />
          <Route path="approvedposts" element={<ApprovedPosts />} />
          
        </Route>

   
        
        
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
          <Route path="approvedposts" element={<ApprovedPosts />} />
          <Route path="managecategory" element={<ManageCategory />} />
        </Route> 
      </Routes>
    </Router>
  );
}

export default App;
