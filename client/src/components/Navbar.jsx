import { Link } from "react-router-dom";
import "../styles/Navbar.css"

function Navbar() {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">
          <Link to="/admin">Admin</Link>
        </li>
        <li className="navbar-item">
          <Link to="/login">Login</Link>
        </li>
        <li className="navbar-item">
          <Link to="/signup">Sign up</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
