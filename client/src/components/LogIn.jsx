import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { loginStart, loginSuccess, loginFailure } from "../slices/signUpSlice";
import "../styles/LogIn.css";
import { useState } from "react"; // Import useState

const Login = () => {
  const dispatch = useDispatch();

  // Local state to track loading state for the login process
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Formik setup for login form
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
      setIsLoggingIn(true); // Set loading state to true when submitting

      dispatch(loginStart());

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
          // Handle specific error for email not found
          const errorData = await response.json();
          if (errorData.message === "Invalid credentials") {
            throw new Error("Invalid credentials");
          }
          throw new Error("Login failed");
        }

        const data = await response.json();
        dispatch(loginSuccess(data)); // Handle user data or token

        // Reset the form on successful login
        formik.resetForm();
        alert("Login successful!");
      } catch (error) {
        dispatch(loginFailure(error.message)); // Handle error
        alert(error.message);
      } finally {
        setIsLoggingIn(false); // Reset loading state
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

        <button type="submit" className="submit-button" disabled={isLoggingIn}>
          {isLoggingIn ? "Logging in..." : "Login"}{" "}
          {/* Conditional button text */}
        </button>
      </form>
    </div>
  );
};

export default Login;
