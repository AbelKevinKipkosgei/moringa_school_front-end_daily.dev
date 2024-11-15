import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, toggleUserStatus } from './slices/userSlice';

const Admin = () => {
  const dispatch = useDispatch();

  // Get users, loading, and error states from the Redux store
  const { users, loading, error } = useSelector((state) => state.users);

  // Fetch all users when the component mounts
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Function to handle activating or deactivating a user
  const handleToggleStatus = (userId, isActive) => {
    if (isActive) {
      dispatch(deactivateUser(userId));  // Deactivate user
    } else {
      dispatch(activateUser(userId));    // Activate user
    }
  };
  

  // Filter users into active and new users
  const activeUsers = users.filter((user) => user.isActive);
  const newUsers = users.filter((user) => !user.isActive);

  return (
    <div>
      <h2>Admin Panel</h2>

      {/* Display loading or error messages */}
      {loading && <p>Loading users...</p>}
      {error && <p>Error: {error}</p>}

      {/* Active Users Section */}
      <h3>Active Users</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {activeUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button
                  onClick={() => handleToggleStatus(user.id, user.isActive)}
                >
                  Deactivate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* New Users Section */}
      <h3>New Users</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {newUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button
                  onClick={() => handleToggleStatus(user.id, user.isActive)}
                >
                  Activate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
