import { Link } from "react-router-dom";
import "../styles/UnauthorizedPage.css"; // Import the CSS file for styles

const UnauthorizedPage = () => {
  return (
    <div className="unauthorized-container">
      <h1 className="unauthorized-title">Unauthorized Access</h1>
      <p className="unauthorized-message">
        You do not have permission to view this page.
      </p>
      <Link to="/login" className="unauthorized-link">
        Go to Login
      </Link>
    </div>
  );
};

export default UnauthorizedPage;
