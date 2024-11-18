import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Admin from "./pages/Admin";
import FeedPage from "./pages/FeedPage";
import LogInPage from "./pages/LogInPage"
import SignUpPage from "./pages/SignUpPage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<LogInPage/>} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </Router>
  );
}

export default App;
