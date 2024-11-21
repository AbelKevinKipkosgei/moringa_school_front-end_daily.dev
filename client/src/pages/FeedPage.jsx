import Feed from "../components/Feed";
import "../styles/FeedPage.css";
import { useNavigate } from "react-router-dom";

const FeedPage = () => {
  const navigate = useNavigate();

  // Navigate to create post page
  const handleCreatePost = () => {
    navigate("/create-post");
  };

  return (
    <div className="feed-page-container">
      <div className="feed-header">
        <h2 className="feed-page-title">Feed Page</h2>
        <button className="create-post-button" onClick={handleCreatePost}>
          Create Post
        </button>
      </div>
      <div className="feed-container">
        <Feed />
      </div>
    </div>
  );
};

export default FeedPage;
