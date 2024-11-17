import SignUp from "../components/SignUp";
import "../styles/SignUpPage.css";

function SignUpPage() {
  return (
    <div className="signup-page">
      <div className="signup-page-header">
        <h1>Join Us</h1>
        <p>Create your account to get started</p>
      </div>
      <div className="signup-form-container">
        <SignUp />
      </div>
    </div>
  );
}

export default SignUpPage;
