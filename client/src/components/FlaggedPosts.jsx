import { useDispatch, useSelector } from 'react-redux';
import { setFlaggedPosts, setLoading, setError } from '../slices/postsSlice';

const FlaggedPosts = () => {
  const dispatch = useDispatch();
  const { flaggedPosts, loading, error } = useSelector((state) => state.posts);

  useEffect(() => {
    const fetchFlaggedPosts = async () => {
      dispatch(setLoading(true));
      try {
        const response = await fetch('/api/posts/flag/${postId}');
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        dispatch(setFlaggedPosts(data));
      } catch (err) {
        dispatch(setError(err.message));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchFlaggedPosts();
  }, [dispatch]);

  if (loading) return <p>Loading flagged posts...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Flagged Posts</h2>
      <ul>
        {flaggedPosts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default FlaggedPosts;
