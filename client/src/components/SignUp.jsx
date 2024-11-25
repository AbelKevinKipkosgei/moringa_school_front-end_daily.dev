import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { signupStart, signupSuccess, signupFailure } from "../slices/authSlice"; // Import from authSlice
import "../styles/SignUp.css";

const SignUp = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
      bio: "",
      profile_pic_url: null,
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm password is required"),
      username: Yup.string().required("Username is required"),
      bio: Yup.string().required("Bio is required"),
      profile_pic_url: Yup.mixed()
        .nullable()
        .required("Profile picture is required")
        .test(
          "fileSize",
          "File size is too large",
          (value) => !value || value.size <= 5 * 1024 * 1024 // 5MB limit
        )
        .test(
          "fileType",
          "Unsupported file type",
          (value) =>
            !value ||
            ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
        ),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      dispatch(signupStart()); // Dispatch signupStart from authSlice

      try {
        const formData = new FormData();
        formData.append("email", values.email);
        formData.append("password", values.password);
        formData.append("username", values.username);
        formData.append("bio", values.bio);
        formData.append("profile_pic_url", values.profile_pic_url);

        const response = await fetch(`${backendUrl}/api/signup`, {
          method: "POST",
          body: formData, // FormData automatically sets the appropriate Content-Type
        });
        if (!response.ok) {
          const errorData = await response.json();

          // Handle specific error from backend
          if (errorData.message === "User with this email already exists") {
            formik.setFieldError("email", errorData.message);
          } else {
            throw new Error("Sign-up failed. Please try again.");
          }
        } else {
          const data = await response.json();
          dispatch(signupSuccess(data)); // Dispatch signupSuccess from authSlice
          alert("Sign-up successful!");
          formik.resetForm();

          // Clear the file input after reset
          document.getElementById("profile_pic_url").value = "";
        }
      } catch (error) {
        // Handle any errors
        dispatch(signupFailure(error.message)); // Dispatch signupFailure from authSlice
        alert(error.message);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="sign-up-container">
      <h2>Sign Up</h2>
      <form onSubmit={formik.handleSubmit} className="sign-up-form">
        {/* Email Field */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="error">{formik.errors.email}</div>
          )}
        </div>

        {/* Password Fields */}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="error">{formik.errors.password}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <div className="error">{formik.errors.confirmPassword}</div>
          )}
        </div>

        {/* Username Field */}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
          />
          {formik.touched.username && formik.errors.username && (
            <div className="error">{formik.errors.username}</div>
          )}
        </div>

        {/* Bio Field */}
        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.bio}
          />
          {formik.touched.bio && formik.errors.bio && (
            <div className="error">{formik.errors.bio}</div>
          )}
        </div>

        {/* Profile Picture Field */}
        <div className="form-group">
          <label htmlFor="profile_pic_url">Profile Picture</label>
          <input
            type="file"
            id="profile_pic_url"
            name="profile_pic_url"
            onChange={(event) => {
              const file = event.currentTarget.files[0];
              formik.setFieldValue("profile_pic_url", file);
            }}
          />
          {formik.touched.profile_pic_url && formik.errors.profile_pic_url && (
            <div className="error">{formik.errors.profile_pic_url}</div>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default SignUp;
