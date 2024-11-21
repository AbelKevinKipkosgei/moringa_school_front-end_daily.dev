import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  approvePost,
  setApprovedPosts,
  setLoading,
  setError,
  deletePost,
} from '../slices/approvalSlice';
import { flagPost } from '../slices/flaggingSlice';
import { useNavigate } from 'react-router-dom';
import '../styles/ApprovedPosts.css';

const ApprovedPosts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State for managing the flag reason and confirmation dialogs
  const [reason, setReason] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [flaggedPostId, setFlaggedPostId] = useState(null);
  const [postToDelete, setPostToDelete] = useState(null);

  // Fetching posts from Redux state
  const { approvedPosts, loading, error } = useSelector((state) => state.approvals);

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
  if (error) return <p>Error: {error}</p>;

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

  // Handle delete post
  const handleDelete = (post_id) => {
    setPostToDelete(post_id);
    setShowDeleteModal(true);
  };

  // Confirm delete action
  const confirmDelete = () => {
    dispatch(deletePost(postToDelete)).then(() => {
      alert('Post deleted successfully');
      setPostToDelete(null); // Reset the state
      setShowDeleteModal(false); 
      navigate('/admin/approvedposts')
    });
  };

  // Cancel delete action
  const cancelDelete = () => {
    setPostToDelete(null); // Reset the state
    setShowDeleteModal(false);
  };

  // To handle no posts or incorrect data structure
  if (!approvedPosts || !Array.isArray(approvedPosts) || approvedPosts.length === 0) {
    return <div>No posts available.</div>;
  }

  // Render all posts
  return (
    <div className="approved-posts-list">
      <h2 className="approved-posts-title">Approved Posts</h2>
      {approvedPosts.map((post) => (
        <div className="approved-post-card" key={post.id}>
          <h3>{post.title}</h3>
          <img src={post.thumbnail_url} alt={post.title} />
          <p>{post.body}</p>
          <div className="approved-post-info">
            <span>{post.approved ? 'Approved' : 'Pending Approval'}</span>
            <br />
            <span>{post.flagged ? 'Flagged' : 'Not Flagged'}</span>
          </div>
          <div>
            {!post.approved ? (
              <button onClick={() => handleApprove(post.id)}>Approve</button>
            ) : (
              <button onClick={() => handleFlag(post.id)}>Flag</button>
            )}
            <button
              className="delete-btn"
              onClick={() => handleDelete(post.id)}
            >
              Delete
            </button>
          </div>
  
          {flaggedPostId === post.id && (
            <div className="flagging-reason">
              <textarea
                placeholder="Provide reason for flagging"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <button onClick={handleSubmitFlag}>Submit Flag</button>
            </div>
          )}
        </div>
      ))}
  
      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <p>Are you sure you want to delete this post?</p>
            <button onClick={confirmDelete}>Yes, Delete</button>
            <button onClick={cancelDelete}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovedPosts;
