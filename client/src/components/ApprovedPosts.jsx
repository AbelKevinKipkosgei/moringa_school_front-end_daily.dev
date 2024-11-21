import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {approvePost,setApprovedPosts,setLoading,setError,deletePost,flagPost,unflagPost} from '../slices/approvalSlice';
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

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
  const handleFlagPost = (postId) => {
    setFlaggedPostId(postId);
  };

  // Submit the flag action
  const handleSubmitFlag = () => {
    if (!reason) {
      alert('Please provide a reason for flagging the post');
      return;
    }
    dispatch(flagPost({ post_id: flaggedPostId, reason })).then(() => {
      setModalMessage("Successfully flagged post");
      setIsModalVisible(true);
      
    });
  };

  // Handle unflag post
  const handleunflagPost = (postId) => {
    dispatch(unflagPost(postId)).then(() => {
      setModalMessage("Successfully unflagged post");
      setIsModalVisible(true);
    });
  };

  // Handle delete post
  const handleDeletePost = (postId) => {
    setPostToDelete(postId);
    setShowDeleteModal(true);
  };

  // Confirm delete action
  const confirmDelete = () => {
    dispatch(deletePost(postToDelete)).then(() => {
      setModalMessage("Deleted successfully");
      setIsModalVisible(true);
      setPostToDelete(null); // Reset the state
      setShowDeleteModal(false);
      navigate('/admin/approvedposts');
    });
  };

  // Cancel delete action
  const cancelDelete = () => {
    setPostToDelete(null); // Reset the state
    setShowDeleteModal(false);
  };

  
  if (!approvedPosts || !Array.isArray(approvedPosts) || approvedPosts.length === 0) {
    return <div>No posts available.</div>;
  }

  
  return (
    <div>
      <h2 className="approved-posts-title">Approved Posts</h2>
      
      <div className="approved-posts-list">
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
                <button onClick={() => post.flagged ? handleunflagPost(post.id) : handleFlagPost(post.id)}>
                  {post.flagged ? 'Unflag' : 'Flag'}
                </button>
              )}
              <button
                className="delete-btn"
                onClick={() => handleDeletePost(post.id)}
              >
                Delete
              </button>
            </div>

            
            {flaggedPostId === post.id && !post.flagged && (
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
      </div>

      
      {isModalVisible && (
        <div className="modal-blur" onClick={() => setIsModalVisible(false)}>
          <div className="modal-content">
            <p>{modalMessage}</p>
            <button onClick={() => setIsModalVisible(false)}>Close</button>
          </div>
        </div>
      )}


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