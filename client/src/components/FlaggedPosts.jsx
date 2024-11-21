import { useDispatch, useSelector } from 'react-redux';
import { unflagPost } from '../slices/flaggingSlice';
import '../styles/FlaggedPosts.css'; 

const FlaggedPosts = () => {
  const dispatch = useDispatch();
  const { flaggedPosts, loading, error } = useSelector((state) => state.flags);

  const handleUnflagPost = (post_id) => {
    dispatch(unflagPost(post_id));
  };

  if (loading) return <p className="loading-text">Loading flagged posts...</p>;
  if (error) return <p className="error-text">Error: {error}</p>;

  if (flaggedPosts.length === 0) {
    return <p className="no-posts">No flagged posts available.</p>;
  }
  console.log(flaggedPosts);

  return (
    <div className="flagged-posts-container">
      <h2 className="flagged-posts-title">Flagged Posts</h2>
      <ul className="flagged-posts-list">
        {flaggedPosts.map((post, index) => (
          <li key={post.post_id || index} className="flagged-post-item">
            <strong className="post-title">{post.title}</strong>
            {post.thumbnail_url && (
              <img
                className="post-thumbnail"
                src={post.thumbnail_url}
                alt={post.title}
              />
            )}
            <p className="post-body">{post.body}</p>
            <span className="flagged-status">Flagged: Yes</span>
            <button
              className="unflag-button"
              onClick={() => handleUnflagPost(post.post_id)}
            >
              Unflag
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FlaggedPosts;
