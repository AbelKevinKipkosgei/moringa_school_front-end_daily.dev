import { useEffect, useState } from 'react';
// import { useDispatch, } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
// import { fetchUsers } from '../slices/userSlice';

const ManageUser = () => {
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);  // Set loading state to true initially
  const [errorMessage, setErrorMessage] = useState(null);

  const mockUsers = [
    {
      id: 1,
      username: 'abel_soi',
      email: 'abelkevinkipkosgei@gmail.com',
      role: 'admin',
      activated: true,
    },
    // Add more users here for testing
  ];

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.log('No token found. Redirecting to Login...');
      navigate('/login');
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      console.log('Decoded Token:', decodedToken);

      if (decodedToken.sub.role === 'admin') {
        // Simulating API call delay
        setTimeout(() => {
          setUsers(mockUsers);
          setLoading(false); // Set loading to false once data is fetched
        }, 1000);
      }
    } catch (err) {
      console.error('Failed to decode token:', err);
      setErrorMessage('Failed to decode token. Please log in again.');
      navigate('/login');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const handleDeactivate = (user_id) => {
    setUsers(users.map(user =>
      user.id === user_id ? { ...user, activated: false } : user
    ));
  };

  const handleActivate = (user_id) => {
    setUsers(users.map(user =>
      user.id === user_id ? { ...user, activated: true } : user
    ));
  };

  const renderUsers = () => {
    return (
      <div className="user-card-container">
        <h2>All Users</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="user-table-container">
            <table className="user-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.activated ? 'Activated' : 'Deactivated'}</td>
                    <td>
                      <button
                        onClick={() => handleDeactivate(user.id)}
                        disabled={!user.activated}
                        className="deactivate-btn"
                      >
                        Deactivate
                      </button>
                      <button
                        onClick={() => handleActivate(user.id)}
                        disabled={user.activated}
                        className="activate-btn"
                      >
                        Activate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {errorMessage && <p className="error">{errorMessage}</p>}
      </div>
    );
  };

  return renderUsers();
};

export default ManageUser;
