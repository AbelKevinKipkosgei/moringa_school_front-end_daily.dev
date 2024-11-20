import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPostById,
  toggleLikePostThunk,
  addCommentThunk,
  addReplyThunk,
  toggleWishlistPostThunk,
} from "../slices/postSlice"; // Import necessary actions
import { useParams } from "react-router-dom";
import { FaThumbsUp, FaHeart, FaPaperPlane, FaReply } from "react-icons/fa"; // Import the reply icon
import "../styles/Post.css";

const Post = () => {
  const { postId } = useParams(); // Extract postId from URL params
  const dispatch = useDispatch();
  const { post, isLoading, error } = useSelector((state) => state.post);
  const [replyFormVisible, setReplyFormVisible] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [loadingComment, setLoadingComment] = useState(false);
  const [newReply, setNewReply] = useState("");

  // Fetch post data when the component mounts or postId changes
  useEffect(() => {
    if (postId) {
      dispatch(fetchPostById(postId)); // Fetch post with the correct postId
    }
  }, [dispatch, postId]);

  // Handle new comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setLoadingComment(true);

    try {
      await dispatch(addCommentThunk(postId, newComment)); // Ensure postId is passed here
      setNewComment("");
      setLoadingComment(false);
    } catch (error) {
      setLoadingComment(false);
      console.error("Error submitting comment:", error);
    }
  };

  // Handle new reply submission
  const handleReplySubmit = async (e, commentId) => {
    e.preventDefault();
    if (!newReply.trim()) return;

    try {
      await dispatch(addReplyThunk(postId, commentId, newReply)); // Pass both postId and commentId
      setNewReply("");
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  };

  // Handle like button toggle
  const handleLikeToggle = () => {
    if (postId) {
      dispatch(toggleLikePostThunk({ postId })); // Wrap postId in an object
    }
  };

  // Handle wishlist toggle
  const handleWishlistToggle = () => {
    if (postId) {
      dispatch(toggleWishlistPostThunk({postId})); // Ensure postId is passed here for wishlist toggle
    }
  };

  // Toggle visibility of reply form for each comment
  const toggleReplyForm = (commentId) => {
    setReplyFormVisible(replyFormVisible === commentId ? null : commentId);
  };

  // Render loading state
  if (isLoading) {
    return <p className="post-message">Loading post...</p>;
  }

  // Render error state
  if (error) {
    return <p className="post-message">Error: {error}</p>;
  }

  // Render post not found state
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

      {post.post_type === "video" && post.media_url && (
        <video controls className="post-media">
          <source src={post.media_url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      {post.post_type === "audio" && post.media_url && (
        <audio controls className="post-media">
          <source src={post.media_url} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}

      <p className="post-body">{post.body}</p>

      <div className="post-meta">
        <p>
          <strong>Category:</strong>{" "}
          {post.category ? post.category : "Uncategorized"}
        </p>
        <p>
          <strong>Created At:</strong>
          {new Date(post.created_at).toLocaleDateString()}
        </p>
        <p>
          <strong>Wishlist Count:</strong> {post.wishlist_count}
        </p>
        <p>
          <strong>Likes:</strong> {post.likes_count}
        </p>

        <div className="button-container">
          <button className="like-button" onClick={handleLikeToggle}>
            <FaThumbsUp
              style={{ color: post.isLiked ? "blue" : "gray" }} // Reflect like status from Redux state
            />{" "}
            {post.isLiked ? "Unlike" : "Like"}
          </button>
          <button className="wishlist-button" onClick={handleWishlistToggle}>
            <FaHeart />{" "}
            {post.isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          </button>
        </div>

        <div className="comment-section">
          <h3>Comments ({post.comments.length})</h3>
          <form onSubmit={handleCommentSubmit}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
            />
            <button type="submit" disabled={loadingComment}>
              {loadingComment ? "Submitting..." : <FaPaperPlane />} Submit
            </button>
          </form>

          <ul>
            {post.comments.map((comment) => (
              <li key={comment.id} className="comment-item">
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

                <div className="reply-icon-container">
                  <FaReply
                    onClick={() => toggleReplyForm(comment.id)}
                    className="reply-icon"
                  />
                  <span className="reply-text">
                    {replyFormVisible === comment.id ? "Hide Replies" : "Reply"}
                  </span>
                </div>

                {replyFormVisible === comment.id && (
                  <form
                    onSubmit={(e) => handleReplySubmit(e, comment.id)}
                    className="reply-form"
                  >
                    <textarea
                      value={newReply}
                      onChange={(e) => setNewReply(e.target.value)}
                      placeholder="Write a reply..."
                    />
                    <button type="submit">
                      <FaPaperPlane /> Submit Reply
                    </button>
                  </form>
                )}

                {comment.replies && comment.replies.length > 0 && (
                  <ul className="replies-list">
                    {comment.replies.map((reply) => (
                      <li key={reply.id} className="reply-item">
                        <div className="reply-header">
                          <img
                            src={
                              reply.user.profile_pic_url || "default-avatar.jpg"
                            }
                            alt={reply.user.username}
                            className="reply-avatar"
                          />
                          <p className="reply-username">
                            {reply.user.username}
                          </p>
                        </div>
                        <p className="reply-body">{reply.body}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Post;
