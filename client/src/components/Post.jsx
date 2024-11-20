import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPostById,
  likePostThunk,
  wishlistPostThunk,
  addCommentThunk,
  addReplyThunk,
} from "../slices/postSlice"; // Import necessary actions
import { useParams } from "react-router-dom";
import { FaThumbsUp, FaComment, FaHeart, FaPaperPlane } from "react-icons/fa";
import "../styles/Post.css";

const Post = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const { post, isLoading, error } = useSelector((state) => state.post);
  const [replyFormVisible, setReplyFormVisible] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [loadingComment, setLoadingComment] = useState(false);
  const [newReply, setNewReply] = useState("");

  useEffect(() => {
    if (postId) {
      dispatch(fetchPostById(postId));
    }
  }, [dispatch, postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setLoadingComment(true);

    try {
      await dispatch(addCommentThunk(postId, newComment));
      setNewComment("");
      setLoadingComment(false);
    } catch (error) {
      setLoadingComment(false);
      console.error("Error submitting comment:", error);
    }
  };

  const handleReplySubmit = async (e, commentId) => {
    e.preventDefault();
    if (!newReply.trim()) return;

    try {
      await dispatch(addReplyThunk(commentId, newReply));
      setNewReply("");
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  };

  const handleLikeToggle = () => {
    if (post) {
      dispatch(likePostThunk(postId));
    }
  };

  const handleWishlistToggle = () => {
    if (post) {
      dispatch(wishlistPostThunk(postId));
    }
  };

  const toggleReplyForm = (commentId) => {
    setReplyFormVisible(replyFormVisible === commentId ? null : commentId);
  };

  if (isLoading) {
    return <p className="post-message">Loading post...</p>;
  }

  if (error) {
    return <p className="post-message">Error: {error}</p>;
  }

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
        <p>
          <strong>Likes:</strong> {post.likes_count}
        </p>

        <div className="button-container">
          <button className="like-button" onClick={handleLikeToggle}>
            <FaThumbsUp /> {post.isLiked ? "Unlike" : "Like"}
          </button>
          <button className="wishlist-button" onClick={handleWishlistToggle}>
            <FaHeart />{" "}
            {post.isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          </button>
        </div>

        {post.media_url && (
          <div className="media-container">
            {post.post_type === "video" ? (
              <video controls width="100%">
                <source src={post.media_url} type="video/mp4" />
              </video>
            ) : post.post_type === "audio" ? (
              <audio controls>
                <source src={post.media_url} type="audio/mp3" />
              </audio>
            ) : null}
          </div>
        )}

        <div className="comment-section">
          <h3>Leave a Comment</h3>
          <form onSubmit={handleCommentSubmit}>
            <textarea
              className="comment-input"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              type="submit"
              className="comment-button"
              disabled={loadingComment}
            >
              {loadingComment ? "Submitting..." : <FaPaperPlane />} Submit
            </button>
          </form>
        </div>

        <div className="comments-section">
          <strong>Comments:</strong>
          <ul>
            {post.comments &&
              post.comments.map((comment) => (
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

                  <div className="button-container">
                    <button
                      className="reply-button"
                      onClick={() => toggleReplyForm(comment.id)}
                    >
                      <FaComment /> Reply
                    </button>
                  </div>

                  {replyFormVisible === comment.id && (
                    <form
                      onSubmit={(e) => handleReplySubmit(e, comment.id)}
                      className="reply-form"
                    >
                      <textarea
                        className="comment-input"
                        placeholder="Write a reply..."
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                      />
                      <button type="submit" className="comment-button">
                        Submit
                      </button>
                    </form>
                  )}

                  {comment.replies && comment.replies.length > 0 && (
                    <div className="replies-section">
                      <strong>Replies:</strong>
                      <ul>
                        {comment.replies.map((reply) => (
                          <li key={reply.id} className="reply-item">
                            <div className="reply-header">
                              <img
                                src={
                                  reply.user.profile_pic_url ||
                                  "default-avatar.jpg"
                                }
                                alt={reply.user.username}
                                className="reply-avatar"
                              />
                              <p className="reply-username">
                                {reply.user.username}
                              </p>
                            </div>
                            <p className="reply-body">{reply.body}</p>
                            <p className="reply-meta">
                              <em>
                                {new Date(
                                  reply.created_at
                                ).toLocaleDateString()}
                              </em>
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
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
