import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { fetchUsers, deactivateUser, activateUser } from '../slices/userSlice';

const ManageUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector((state) => state.users.users);
  const loading = useSelector((state) => state.users.loading);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setErrorMessage('No token found. Redirecting to login...');
      navigate('/login');
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken.sub.role === 'admin') {
        dispatch(fetchUsers()).then((action) => {
          if (action.payload) {
            console.log('Fetched Users:', action.payload);
          } else if (action.error) {
            setErrorMessage('Error fetching users: ' + action.error.message);
          }
        });
      }
    } catch (err) {
      console.error('Failed to decode token:', err);
      setErrorMessage('Token expired. Redirecting to login...');
      navigate('/login');
    }
  }, [navigate, dispatch]);

  const handleDeactivate = (user_id) => {
    dispatch(deactivateUser(user_id)).then((action) => {
      if (action.error) {
        setErrorMessage('Error deactivating user: ' + action.error.message);
      }
    });
  };

  const handleActivate = (user_id) => {
    dispatch(activateUser(user_id)).then((action) => {
      if (action.error) {
        setErrorMessage('Error activating user: ' + action.error.message);
      }
    });
  };

  const renderUsers = () => {
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
                  <td>{user.activated ? 'Yes' : 'No'}</td>
                  <td>
                    {user.activated ? (
                      <button onClick={() => handleDeactivate(user.id)}>Deactivate</button>
                    ) : (
                      <button onClick={() => handleActivate(user.id)}>Activate</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {errorMessage && <p>{errorMessage}</p>}
      </div>
    );
  };

  return <div>{renderUsers()}</div>;
};

export default ManageUser;
