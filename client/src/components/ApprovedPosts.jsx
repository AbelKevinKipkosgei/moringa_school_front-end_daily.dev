import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { approvePost, setApprovedPosts, setLoading, setError } from '../slices/approvalSlice';
import { flagPost } from '../slices/flaggingSlice';
import { useNavigate } from 'react-router-dom';

const ApprovedPosts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State to manage the reason for flagging and the post being flagged
  const [reason, setReason] = useState('');
  const [flaggedPostId, setFlaggedPostId] = useState(null);

  // Fetching posts from Redux state
  const { approvedPosts, loading, error } = useSelector((state) => state.approvals);

  // Log the state to debug
  console.log('Approved Posts in state:', approvedPosts);

  // Fetch posts 
  useEffect(() => {
    const fetchPosts = async () => {
      dispatch(setLoading(true));
      try {
        const response = await fetch('http://127.0.0.1:5555/api/allposts');
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Fetched posts:', data);
        dispatch(setApprovedPosts(data.posts));
      } catch (err) {
        dispatch(setError(err.message));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchPosts();
  }, [dispatch]);

  // Loading state
  if (loading) return <p>Loading posts...</p>;

  
  if (error) return <p>Error.</p>;

  // To Handle no posts or wrong data structure
  if (!approvedPosts || !Array.isArray(approvedPosts) || approvedPosts.length === 0) {
    return <div>No posts available.</div>;
  }

  // Handle approve post
  const handleApprove = (post_id) => {
    dispatch(approvePost(post_id)); 
  };

  // Handle flag post
  const handleFlag = (post_id) => {
    setFlaggedPostId(post_id); 
  };

  // Submit the flag action
  const handleSubmitFlag = () => {
    if (!reason) {
      alert('Please provide a reason for flagging the post');
      return;
    }
    dispatch(flagPost({ post_id: flaggedPostId, reason })).then(() => {
      navigate('/admin/flaggedposts'); // Navigate to flagged posts page after flagging
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
            <img src={post.thumbnail_url} alt={post.title} width="100" />
            <p>{post.body}</p>
            <small>{post.approved ? 'Approved' : 'Pending'}</small><br />
            <small>{post.flagged ? 'Flagged' : 'Not Flagged'}</small>

            <div>
              {!post.approved && (
                <button onClick={() => handleApprove(post.id)}>Approve</button>
              )}
              <button onClick={() => handleFlag(post.id)}>Flag</button>
            </div>

            {/* Show reason input box when post is being flagged */}
            {flaggedPostId === post.id && (
              <div>
                <textarea
                  placeholder="Provide reason for flagging"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
                <button onClick={handleSubmitFlag}>Submit Flag</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ApprovedPosts;
