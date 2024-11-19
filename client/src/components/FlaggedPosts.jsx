import { useDispatch, useSelector } from 'react-redux';
import { unflagPost } from '../slices/flaggingSlice'; 

const FlaggedPosts = () => {
  const dispatch = useDispatch();
  const { flaggedPosts, loading, error } = useSelector((state) => state.flags); // Get flagged posts from flags slice

  // Handle unflagging a post
  const handleUnflagPost = (postId) => {
    dispatch(unflagPost(postId));  // Dispatch action to unflag a post
  };

  // Handle loading and error states
  if (loading) return <p>Loading flagged posts...</p>;
  if (error) return <p>Error: {error}</p>;

  if (flaggedPosts.length === 0) {
    return <p>No flagged posts available.</p>;
  }

  return (
    <div>
      <h2>Flagged Posts</h2>
      <ul>
        {flaggedPosts.map((post) => (
          <li key={post.post_id}>
            <strong>{post.title}</strong>
            <p>{post.body}</p>
            <small>Flagged: Yes</small>
            <button onClick={() => handleUnflagPost(post.post_id)}>Unflag</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FlaggedPosts;
