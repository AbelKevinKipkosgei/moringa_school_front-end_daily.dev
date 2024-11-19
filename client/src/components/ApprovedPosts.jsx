import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { approvePost, setApprovedPosts, setLoading, setError } from '../slices/approvalSlice';
import { flagPost } from '../slices/flaggingSlice';
import { useNavigate } from 'react-router-dom';

const ApprovedPosts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Import useNavigate for navigation

  // Fetching posts from Redux state
  const { approvedPosts, loading, error } = useSelector((state) => state.approvals);

  // Log the state to debug
  console.log("Approved Posts in state:", approvedPosts);

  // Fetch posts on mount
  useEffect(() => {
    const fetchPosts = async () => {
      dispatch(setLoading(true)); // Set loading state
      try {
        const response = await fetch('http://127.0.0.1:5555/api/allposts');
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Fetched posts:", data);

        dispatch(setApprovedPosts(data.posts)); 
      } catch (err) {
        dispatch(setError(err.message)); // Handle error
      } finally {
        dispatch(setLoading(false)); // Set loading to false when finished
      }
    };

    fetchPosts();
  }, [dispatch]);

  // Loading state
  if (loading) return <p>Loading posts...</p>;

  // Error state with a more user-friendly message
  if (error) return <p>Oops, something went wrong while fetching posts. Please try again later.</p>;

  // Handle no posts or wrong data structure
  if (!approvedPosts || !Array.isArray(approvedPosts) || approvedPosts.length === 0) {
    return <div>No posts available.</div>;
  }

  // Approve or flag post
  const handleApprove = (post_id) => {
    dispatch(approvePost(post_id)); // Dispatch approve action
  };

  const handleFlag = (post_id) => {
    // Pass only the post_id to the flagPost action
    dispatch(flagPost(post_id)).then(() => {
      navigate('/admin/flaggedposts'); // Redirect to flagged posts page after flagging
    });
  };
  


  // Render all posts
  return (
    <div>
      <h2>All Posts</h2>
      <ul>
        {approvedPosts.map((post) => (
          <li key={post.id}>
            <strong>{post.title}</strong><br />
            <img src={post.thumbnail_url} alt={post.title} width="100" /> {/* Thumbnail image */}
            <p>{post.body}</p>
            <small>{post.approved ? 'Approved' : 'Pending'}</small><p>{post.flagged ? 'Flagged' : 'Not Flagged'}</p>
            
            {/* Show action buttons for admin or tech writer */}
            <div>
              {!post.approved && (
                <button onClick={() => handleApprove(post.id)}>Approve</button>
              )}
              <button onClick={() => handleFlag(post.id)}>Flag</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ApprovedPosts;