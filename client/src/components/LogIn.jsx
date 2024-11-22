import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { login } from "../slices/authSlice"; // Import the login action from authSlice
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // To check login status
import "../styles/LogIn.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Check if the user is already logged in via Redux state
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/"); // Redirect to the feed if the user is already logged in
    }
  }, [isLoggedIn, navigate]);

  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await fetch(`${backendUrl}/api/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "An error occurred during login"
          );
        }

        const data = await response.json();
        const { access_token, refresh_token, role, userId, profilePicture } = data;
        console.log(data)

        // Dispatch login action with token, role, and userId
        dispatch(login({ token: access_token, role, userId, profilePicture }));

        // Optionally, store tokens and user info in localStorage
        localStorage.setItem("authToken", access_token);
        localStorage.setItem("refreshToken", refresh_token);
        localStorage.setItem("userRole", role);
        localStorage.setItem("userId", userId);
        localStorage.setItem("profilePicture", profilePicture);

        // Redirect to feed after successful login
        navigate("/feed");

        // Reset form
        formik.resetForm();
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={formik.handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className="input-field"
          />
          {formik.touched.email && formik.errors.email && (
            <div className="error">{formik.errors.email}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            className="input-field"
          />
          {formik.touched.password && formik.errors.password && (
            <div className="error">{formik.errors.password}</div>
          )}
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
