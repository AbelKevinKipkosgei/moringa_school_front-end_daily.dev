import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Logout from "./Logout"; // Import the Logout component
import { useState } from "react";
import "../styles/Navbar.css";

function Navbar() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // Get login status from Redux
  const [menuOpen, setMenuOpen] = useState(false); // State to control the mobile menu

  const toggleMenu = () => {
    setMenuOpen(!menuOpen); // Toggle the menu visibility on mobile
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">My App</Link> {/* Logo or brand name */}
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
            <Link to="/admin">Admin</Link>
          </li>
        )}
        <li className="navbar-item">
          <Link to="/feed">Feed</Link>
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
              <Logout /> {/* Logout button */}
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
