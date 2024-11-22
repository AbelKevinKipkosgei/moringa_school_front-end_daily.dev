
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setFlaggedPosts,
  setApprovedPosts,
  setLoading,
  setError,
} from "../slices/postsSlice"; // Path is correct for your structure
import EditPostModal from "../components/EditPostModal"; // Correct path for the EditPostModal component
import "../styles/ManagePosts.css"; // Updated to use the styles directory for CSS

function ManagePosts() {
  const dispatch = useDispatch();
  const { flaggedPosts, approvedPosts, loading, error } = useSelector(
    (state) => state.posts
  );

  const [selectedPost, setSelectedPost] = useState(null); // State for selected post for editing

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchPosts = async () => {
      dispatch(setLoading(true));
      try {
        const response = await fetch(`${backendUrl}/api/allposts`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await response.json();
        console.log("API Response:", data); // Debugging line

        // Adjusted to handle the actual API response format
        if (data.posts && Array.isArray(data.posts)) {
          const flagged = data.posts.filter((post) => post.flagged);
          const approved = data.posts.filter((post) => post.approved);
          dispatch(setFlaggedPosts(flagged));
          dispatch(setApprovedPosts(approved));
        } else {
          throw new Error("Unexpected API response format");
        }
      } catch (err) {
        dispatch(setError(err.message));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchPosts();
  }, [dispatch, backendUrl]);

  const handleApprove = async (postId) => {
    try {
      const response = await fetch(`${backendUrl}/api/posts/${postId}/approve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to approve post");
      }

      const updatedPost = flaggedPosts.find((post) => post.id === postId);
      dispatch(setApprovedPosts([...approvedPosts, updatedPost]));
      dispatch(
        setFlaggedPosts(flaggedPosts.filter((post) => post.id !== postId))
      );
    } catch (err) {
      dispatch(setError(err.message));
    }
  };

  const handleFlag = async (postId) => {
    try {
      const response = await fetch(`${backendUrl}/api/posts/${postId}/flag`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to flag post");
      }

      const flaggedPost = approvedPosts.find((post) => post.id === postId);
      dispatch(setFlaggedPosts([...flaggedPosts, flaggedPost]));
      dispatch(
        setApprovedPosts(approvedPosts.filter((post) => post.id !== postId))
      );
    } catch (err) {
      dispatch(setError(err.message));
    }
  };

  const handleEdit = async (post, updatedData) => {
    console.log("hello", localStorage.getItem("authToken"))
    try {
      const response = await fetch(`${backendUrl}/api/posts/edit/${post.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`, 
        },
        body: JSON.stringify(updatedData), // Send the updated post data
      });

      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      const updatedPost = await response.json();

      // Update the Redux store with the updated post 
      dispatch(
        setFlaggedPosts(
          flaggedPosts.map((post) =>
            post.id === updatedPost.post.id ? updatedPost.post : post
          )
        )
        
      );
      dispatch(
        setApprovedPosts(
          approvedPosts.map((post) =>
            post.id === updatedPost.post.id ? updatedPost.post : post
          )
        )
      );
      // Close the modal after the update
      setSelectedPost(null);
    } catch (err) {
      dispatch(setError(err.message));
    }
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  if (loading) {
    return <p>Loading posts...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const allPosts = [...approvedPosts, ...flaggedPosts];

  return (
    <div>ManagePosts</div>
  )
}

export default ManagePosts