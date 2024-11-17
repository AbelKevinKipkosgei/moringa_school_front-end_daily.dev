import Login from "../components/LogIn";
import "../styles/LogInPage.css";

function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-page-header">
        <h1>Welcome Back</h1>
        <p>Login to your account to continue</p>
      </div>
      <div className="login-form-container">
        <Login />
      </div>
    </div>
  );
}

export default LoginPage;
