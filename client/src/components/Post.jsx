import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostById } from "../slices/postSlice"; // Import fetch action
import { useParams } from "react-router-dom"; // Import useParams to get postId from URL
import "../styles/Post.css"; // Import the Post styles

const Post = () => {
  const { postId } = useParams(); // Get postId from route params
  const dispatch = useDispatch();

  // Use useSelector to access post state from Redux
  const { post, isLoading, error } = useSelector((state) => state.post);

  // Dispatch fetchPostById action when the component mounts
  useEffect(() => {
    if (postId) {
      dispatch(fetchPostById(postId));
    }
  }, [dispatch, postId]);

  // Return loading state if the post is being fetched
  if (isLoading) {
    return <p className="post-message">Loading post...</p>;
  }

  // Return error message if there was an issue fetching the post
  if (error) {
    return <p className="post-message">Error: {error}</p>;
  }

  // Return post not found message if no post exists
  if (!post) {
    return <p className="post-message">Post not found</p>;
  }

  return (
    <div className="post-container">
      <h2 className="post-title">{post.title}</h2>
      <img
        src={post.thumbnail_url || "default-thumbnail.jpg"}
        alt={post.title}
        className="post-thumbnail"
      />
      <p className="post-body">{post.body}</p>
      <div className="post-meta">
        <p>
          <strong>Category:</strong>{" "}
          {post.category ? post.category.name : "Uncategorized"}
        </p>
        <p>
          <strong>Created At:</strong>
          {new Date(post.created_at).toLocaleDateString()}
        </p>
        <p>
          <strong>Wishlist Count:</strong> {post.wishlist_count}
        </p>

        {/* Display Media URL (Video/Audio Player) */}
        {post.media_url && (
          <div className="media-container">
            {post.post_type === "video" ? (
              <video controls width="100%">
                <source src={post.media_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : post.post_type === "audio" ? (
              <audio controls>
                <source src={post.media_url} type="audio/mp3" />
                Your browser does not support the audio element.
              </audio>
            ) : null}
          </div>
        )}

        <div className="comments-section">
          <strong>Comments:</strong>
          <ul>
            {post.comments &&
              post.comments.map((comment) => (
                <li key={comment.id}>
                  <div className="comment-header">
                    <img
                      src={comment.user.profile_pic_url || "default-avatar.jpg"}
                      alt={comment.user.username}
                      className="comment-avatar"
                    />
                    <p className="comment-username">{comment.user.username}</p>
                  </div>
                  <p className="comment-body">{comment.body}</p>
                  <p className="comment-meta">
                    <em>{new Date(comment.created_at).toLocaleDateString()}</em>
                  </p>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Post;
