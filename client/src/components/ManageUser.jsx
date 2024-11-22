import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUsers, deactivateUser, activateUser } from '../slices/userSlice';
import "../styles/ManageUser.css"
const ManageUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector((state) => state.users.users);
  const loading = useSelector((state) => state.users.loading);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Function to get the token from localStorage
  const getAuthToken = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No token found in localStorage");
      setErrorMessage("No access token found. Redirecting...");
      setTimeout(() => navigate("/login"), 3000); 
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
  });

  const handleDeactivate = async (user_id) => {
    try {
      const response = await dispatch(deactivateUser(user_id));
      if (response.meta.requestStatus === "fulfilled") {
        setSuccessMessage("User successfully deactivated!");
      } else {
        setErrorMessage("Failed to deactivate user."); 
      }
    } catch  {
      setErrorMessage("Error deactivating user."); 
    }
    setTimeout(() => {
      setSuccessMessage('');
      setErrorMessage('');
    }, 3000);
  };
  
  const handleActivate = async (user_id) => {
    try {
      const response = await dispatch(activateUser(user_id));
      if (response.meta.requestStatus === "fulfilled") {
        setSuccessMessage("User successfully activated!");
      } else {
        setErrorMessage("Failed to activate user."); 
      }
    } catch {
      setErrorMessage("Error activating user."); 
    }
    setTimeout(() => {
      setSuccessMessage('');
      setErrorMessage('');
    }, 3000);
  };

  const showPopup = (message, isSuccess = true) => {
    setSuccessMessage(isSuccess ? message : "");
    setErrorMessage(!isSuccess ? message : "");
    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 2000); 
  };

  return (
    <div className="manage-user-container">
      <h2 className="manage-user-header">All Users</h2>

      
      {(successMessage || errorMessage) && (
        <div className="popup-overlay">
          <div
            className={`popup-message ${
              successMessage ? "success" : "error"
            }`}
          >
            {successMessage || errorMessage}
          </div>
        </div>
      )}

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
                  <td>{user.activated ? "YES" : "NO"}</td>
                  <td className="action-btns">
                    <button
                      onClick={() => {
                        handleDeactivate(user.id);
                        showPopup("User successfully deactivated!");
                      }}
                      disabled={!user.activated}
                      className="deactivate-btn"
                    >
                      Deactivate
                    </button>
                    <button
                      onClick={() => {
                        handleActivate(user.id);
                        showPopup("User successfully activated!");
                      }}
                      disabled={user.activated}
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
};

export default ManageUser;
