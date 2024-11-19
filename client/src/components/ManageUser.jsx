import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUsers, deactivateUser, activateUser } from "../slices/userSlice";

const ManageUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector((state) => state.users.users);
  const loading = useSelector((state) => state.users.loading);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }

    dispatch(fetchUsers()).catch((err) => setErrorMessage(err.message));
  }, [dispatch, navigate]);

  const handleDeactivate = (user_id) => {
    dispatch(deactivateUser(user_id)).catch((err) => setErrorMessage(err.message));
  };

  const handleActivate = (user_id) => {
    dispatch(activateUser(user_id)).catch((err) => setErrorMessage(err.message));
  };

  return (
    <div>
      <h2>All Users</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
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
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.activated ? "Yes" : "No"}</td>
                <td>
                  <button
                    onClick={() => handleDeactivate(user.id)}
                    disabled={!user.activated}
                  >
                    Deactivate
                  </button>
                  <button
                    onClick={() => handleActivate(user.id)}
                    disabled={user.activated}
                  >
                    Activate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
};

export default ManageUser;
