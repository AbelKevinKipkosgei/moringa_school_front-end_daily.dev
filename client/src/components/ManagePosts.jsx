// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   setFlaggedPosts,
//   setApprovedPosts,
//   setLoading,
//   setError,
// } from "../slices/postsSlice"; // Path is correct for your structure
// import EditPostModal from "../components/EditPostModal"; // Correct path for the EditPostModal component
// import "../styles/ManagePosts.css"; // Updated to use the styles directory for CSS

// function ManagePosts() {
//   const dispatch = useDispatch();
//   const { flaggedPosts, approvedPosts, loading, error } = useSelector(
//     (state) => state.posts
//   );

//   const [selectedPost, setSelectedPost] = useState(null);

//   useEffect(() => {
//     const fetchPosts = async () => {
//       dispatch(setLoading(true));
//       try {
//         const response = await fetch("http://127.0.0.1:5555/api/allposts", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error("Failed to fetch posts");
//         }

//         const data = await response.json();
//         const flagged = data.filter((post) => post.flagged);
//         const approved = data.filter((post) => post.approved);
//         dispatch(setFlaggedPosts(flagged));
//         dispatch(setApprovedPosts(approved));
//       } catch (err) {
//         dispatch(setError(err.message));
//       } finally {
//         dispatch(setLoading(false));
//       }
//     };

//     fetchPosts();
//   }, [dispatch]);

//   const handleApprove = async (postId) => {
//     try {
//       const response = await fetch(`/api/posts/${postId}/approve`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to approve post");
//       }

//       const updatedPost = approvedPosts.find((post) => post.id === postId);
//       dispatch(setApprovedPosts([...approvedPosts, updatedPost]));
//     } catch (err) {
//       dispatch(setError(err.message));
//     }
//   };

//   const handleFlag = async (postId) => {
//     try {
//       const response = await fetch(`/api/posts/${postId}/flag`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to flag post");
//       }

//       const flaggedPost = flaggedPosts.find((post) => post.id === postId);
//       dispatch(setFlaggedPosts([...flaggedPosts, flaggedPost]));
//     } catch (err) {
//       dispatch(setError(err.message));
//     }
//   };

//   const handleEdit = (post) => {
//     setSelectedPost(post);
//   };

//   const closeModal = () => {
//     setSelectedPost(null);
//   };

//   if (loading) {
//     return <p>Loading posts...</p>;
//   }

//   if (error) {
//     return <p>{error}</p>;
//   }

//   const allPosts = [...approvedPosts, ...flaggedPosts];

//   return (
//     <div className="manage-posts">
//       <h2>Manage Posts</h2>
//       {allPosts.length === 0 ? (
//         <p>No posts found.</p>
//       ) : (
//         <ul className="post-list">
//           {allPosts.map((post) => (
//             <li key={post.id} className="post-card">
//               <img
//                 src={post.thumbnail_url}
//                 alt={post.title}
//                 className="post-thumbnail"
//               />
//               <div className="post-details">
//                 <h3>{post.title}</h3>
//                 <p>{post.body}</p>
//                 <p>
//                   <strong>Type:</strong> {post.post_type}
//                 </p>
//                 <p>
//                   <strong>Approved:</strong> {post.approved ? "Yes" : "No"}
//                 </p>
//                 <p>
//                   <strong>Flagged:</strong> {post.flagged ? "Yes" : "No"}
//                 </p>
//               </div>
//               <div className="post-actions">
//                 <button
//                   onClick={() => handleEdit(post)}
//                   className="edit-button"
//                 >
//                   Edit
//                 </button>
//                 {!post.approved && (
//                   <button
//                     onClick={() => handleApprove(post.id)}
//                     className="approve-button"
//                   >
//                     Approve
//                   </button>
//                 )}
//                 {!post.flagged && (
//                   <button
//                     onClick={() => handleFlag(post.id)}
//                     className="flag-button"
//                   >
//                     🚩 Flag
//                   </button>
//                 )}
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//       {selectedPost && (
//         <EditPostModal
//           post={selectedPost}
//           onClose={closeModal}
//         />
//       )}
//     </div>
//   );
// }

// export default ManagePosts;


import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setLoading,
  setError,
  setApprovedPosts, // Reusing to store fetched posts
} from "../slices/postsSlice"; // Redux actions
import "../styles/ManagePosts.css"; // Updated to use the styles directory for CSS

const ManagePosts = () => {
  const dispatch = useDispatch();
  const { approvedPosts: posts, loading: isLoading, error } = useSelector(
    (state) => state.posts
  );
  const navigate = useNavigate(); // For navigation to post details

  useEffect(() => {
    const fetchPosts = async () => {
      dispatch(setLoading(true));
      try {
        const response = await fetch("/api/allposts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        dispatch(setApprovedPosts(data.posts)); // Assuming the API returns an object with a `posts` array
      } catch (err) {
        dispatch(setError(err.message));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchPosts();
  }, [dispatch]);

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`); // Navigate to the detailed post page
  };

  if (isLoading) {
    return <p>Loading posts...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="manage-posts">
      <h2>Manage Posts</h2>
      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <ul className="post-list">
          {posts.map((post) => (
            <li
              key={post.id}
              className="post-card"
              onClick={() => handlePostClick(post.id)}
            >
              <img
                src={post.thumbnail_url || "default-thumbnail.jpg"}
                alt={post.title}
                className="post-thumbnail"
              />
              <div className="post-details">
                <h3>{post.title}</h3>
                <p>{post.body}</p>
                <p>
                  <strong>Type:</strong> {post.post_type || "Uncategorized"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManagePosts;





