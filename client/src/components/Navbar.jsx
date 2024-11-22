import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Logout from "./Logout"; 
import { useState } from "react";
import "../styles/Navbar.css";
import { FaUserCircle } from "react-icons/fa"; // Importing a user icon from react-icons

function Navbar() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // Get login status from Redux
  const profilePicture = useSelector((state) => state.auth.profilePicture); // Get profile picture from Redux
  const userId = useSelector((state) => state.auth.userId); // Get user ID from Redux
  const [menuOpen, setMenuOpen] = useState(false); // State to control the mobile menu

  const toggleMenu = () => {
    setMenuOpen(!menuOpen); // Toggle the menu visibility on mobile
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        {isLoggedIn && profilePicture ? (
          <Link to={`/profile/${userId}`}>
            {" "}
            {/* Use userId from Redux state */}
            <img
              src={profilePicture} // Use profilePicture from Redux state
              alt="User Profile"
              className="navbar-profile-picture"
            />
          </Link>
        ) : (
          <Link to="/login">
            <FaUserCircle size={40} className="navbar-user-icon" />{" "}
            {/* Default user icon */}
          </Link>
        )}
      </div>

      <div
        className={`navbar-toggle ${menuOpen ? "open" : ""}`}
        onClick={toggleMenu}
      >
        <span className="navbar-icon"></span>
      </div>

      <ul className={`navbar-list ${menuOpen ? "active" : ""}`}>
        {isLoggedIn && (
          <li className="navbar-item">
            <Link to="/admin/manageusers">Admin</Link>
          </li>
        )}
        <li className="navbar-item">
          <Link to="/">Feed</Link>
        </li>
        {!isLoggedIn ? (
          <>
            <li className="navbar-item">
              <Link to="/login">Login</Link>
            </li>
            <li className="navbar-item">
              <Link to="/signup">Sign up</Link>
            </li>
          </>
        ) : (
          <>
            <li className="navbar-item">
              <Link to="/techwriter">Techwriter</Link>
            </li>
            <li className="navbar-item">
              <Logout className="logout-btn" /> {/* Styled Logout button */}
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
