import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // For navigation
import {
  fetchPostsStart,
  fetchPostsSuccess,
  fetchPostsFailure,
} from "../slices/feedSlice";
import "../styles/Feed.css"; // Import the CSS for styling

const Feed = () => {
  const dispatch = useDispatch();
  const { posts, isLoading, error } = useSelector((state) => state.feed);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchPosts = async () => {
      dispatch(fetchPostsStart());
      try {
        const response = await fetch("/api/allposts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        dispatch(fetchPostsSuccess(data.posts)); // Accessing the posts array directly
      } catch (error) {
        dispatch(fetchPostsFailure(error.message));
      }
    };

    fetchPosts();
  }, [dispatch]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // Handle navigation to detailed post page using navigate
  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`); // Correct way to navigate with react-router v6
  };

  return (
    <div className="feed">
      {posts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            className="post-card"
            onClick={() => handlePostClick(post.id)}
          >
            <div className="post-card-header">
              <img
                src={post.thumbnail_url || "default-thumbnail.jpg"}
                alt={post.title}
                className="post-card-thumbnail"
              />
              <h3 className="post-card-title">{post.title}</h3>
            </div>
            <div className="post-card-body">
              <p className="post-card-category">
                <strong>Category:</strong> {post.category || "Uncategorized"}{" "}
                {/* Directly using the category string */}
              </p>
              <p className="post-card-description">{post.body}</p>
              <div className="post-card-footer">
                {post.post_type === "blog" && (
                  <button className="post-card-button">Read Post</button>
                )}
                {post.post_type === "video" && (
                  <button className="post-card-button">Watch</button>
                )}
                {post.post_type === "audio" && (
                  <button className="post-card-button">Listen</button>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Feed;
