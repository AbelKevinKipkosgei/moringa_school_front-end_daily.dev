import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Logout from "./Logout"; // Import the Logout component
import "../styles/Navbar.css";

function Navbar() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // Get login status from Redux

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        {isLoggedIn && ( // Show only for logged-in users
          <li className="navbar-item">
            <Link to="/admin">Admin</Link>
          </li>
        )}
        <li className="navbar-item">
          <Link to="/feed">Feed</Link>
        </li>
        {!isLoggedIn ? ( // Show Login and Signup if user is not logged in
          <>
            <li className="navbar-item">
              <Link to="/login">Login</Link>
            </li>
            <li className="navbar-item">
              <Link to="/signup">Sign up</Link>
            </li>
          </>
        ) : (
          // Show Logout and Techwriter if user is logged in
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
