import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import { login } from "../slices/authSlice"; // Import the login action from authSlice
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // To check login status
import "../styles/LogIn.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Check if the user is already logged in via Redux state
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/feed"); // Redirect to the feed if the user is already logged in
    }
  }, [isLoggedIn, navigate]);

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
      try {
        const response = await fetch("/api/login", {
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
          throw new Error(errorData.message || "Login failed");
        }

        const data = await response.json();
        const { token, role } = data;

        // Dispatch login action
        dispatch(login({ token, role }));

        // Redirect to feed after successful login
        navigate("/feed");

        // Reset form
        formik.resetForm();
      } catch (error) {
        alert(error.message);
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

        <button type="submit" className="submit-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
