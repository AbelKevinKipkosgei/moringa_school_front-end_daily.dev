import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setApprovedPosts, setLoading, setError } from '../slices/postsSlice';

const ApprovedPosts = () => {
  const dispatch = useDispatch();
  const { approvedPosts, loading, error } = useSelector((state) => state.posts);

  useEffect(() => {
    const fetchApprovedPosts = async () => {
      dispatch(setLoading(true));
      try {
        const response = await fetch('/api/posts/approved');
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        dispatch(setApprovedPosts(data));
      } catch (err) {
        dispatch(setError(err.message));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchApprovedPosts();
  }, [dispatch]);

  if (loading) return <p>Loading approved posts...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Approved Posts</h2>
      <ul>
        {approvedPosts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default ApprovedPosts;
