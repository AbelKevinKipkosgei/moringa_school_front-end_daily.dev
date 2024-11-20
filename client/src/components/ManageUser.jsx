import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUsers, deactivateUser, activateUser } from "../slices/userSlice";
import "../styles/ManageUser.css"
const ManageUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector((state) => state.users.users);
  const loading = useSelector((state) => state.users.loading);
  const [errorMessage, setErrorMessage] = useState(null);
  const [message, setMessage] = useState(""); 

  // Function to get the token from localStorage
  const getAuthToken = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No token found in localStorage");
      setErrorMessage("No access token found. Redirecting...");
      setTimeout(() => navigate("/login"), 3000); // Redirect to login after 3 seconds
    }
    return token;
  };

  // Fetch users 
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      dispatch(fetchUsers(token)).catch((err) =>
        setErrorMessage("Failed to fetch users: " + err.message)
      );
    }
  }, [dispatch, navigate]);

  const handleDeactivate = async (user_id) => {
    try {
      const response = await dispatch(deactivateUser(user_id)); 
      if (response.meta.requestStatus === "fulfilled") {
        setMessage({ user_id, text: "Successfully deactivated!" });
      }
    } catch (error) {
      setMessage({ user_id, text: "Error deactivating user." });
    }
  };

  const handleActivate = async (user_id) => {
    try {
      const response = await dispatch(activateUser(user_id)); 
      if (response.meta.requestStatus === "fulfilled") {
        setMessage({ user_id, text: "Successfully activated!" });
      }
    } catch (error) {
      setMessage({ user_id, text: "Error activating user." });
    }
  };
  useEffect(() => {
    console.log(users); // Log the users to ensure `activated` is set correctly
  }, [users]);

  return (
    <div>
      <h2 className="manage-user-header">All Users</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="manage-user-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Activated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.activated ? "NO" : "YES"}</td>
                  <td className="action-btns">
                    <button
                      onClick={() => handleDeactivate(user.id)}
                      disabled={user.activated}
                      className="deactivate-btn"
                    >
                      Deactivate
                    </button>
                    <button
                      onClick={() => handleActivate(user.id)}
                      disabled={!user.activated}
                      className="activate-btn"
                    >
                      Activate
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No users available</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}  

export default ManageUser;
