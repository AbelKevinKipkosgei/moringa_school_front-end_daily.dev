import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/Profile.css";

function Profile() {
  const { userId } = useParams(); // Get userId from the route
  const [user, setUser] = useState(null); // State to store user data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Fetch user data by userId
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setUser(data); // Set the user data in state
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="profile-container">
      {user && (
        <>
          <div className="profile-header">
            <img
              src={user.profile_pic_url}
              alt={`${user.username}'s profile`}
              className="profile-picture"
            />
            <h1>{user.username}</h1>
            <p>{user.bio}</p>
          </div>
          <div className="profile-details">
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Role:</strong> {user.role}
            </p>
            <p>
              <strong>Joined:</strong>{" "}
              {new Date(user.created_at).toLocaleDateString()}
            </p>
            <p>
              <strong>Last Updated:</strong>{" "}
              {new Date(user.updated_at).toLocaleDateString()}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default Profile;
