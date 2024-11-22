import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Function to get the token from localStorage or Redux store
const getAuthToken = () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    console.error("No token found in localStorage");
    return null; // Return null if no token is found
  }
  return token; // Return the token if it exists
};

// Initial state for the post slice
const initialState = {
  post: null,
  isLoading: false,
  error: null,
};

// Fetch a post by ID
const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const fetchPostById = createAsyncThunk(
  "post/fetchById",
  async (postId, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${backendUrl}/api/post/read/${postId}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch post");
      const data = await response.json();
      return data.post;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Toggle like/unlike a post
export const toggleLikePostThunk = createAsyncThunk(
  "post/toggleLikePost",
  async ({ postId }, { rejectWithValue }) => {
    try {
      // Ensure postId is present
      if (!postId) {
        return rejectWithValue("Post ID is required");
      }

      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const token = getAuthToken(); // Retrieve the JWT token
      const url = `${backendUrl}/api/post/likeunlike/${postId}`; // Backend route

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "", // Include token if available
        },
      });

      // Check if response is not OK
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to toggle like status");
      }

      // Parse JSON response
      const data = await response.json();

      // Ensure backend returns the expected structure
      if (!data || typeof data.isLiked === "undefined") {
        throw new Error("Invalid response from server");
      }

      // Return postId and new like status
      return { postId, isLiked: data.isLiked };
    } catch (error) {
      // Reject with detailed error message
      return rejectWithValue(error.message || "An error occurred");
    }
  }
);


// Toggle add/remove post to/from wishlist
export const toggleWishlistPostThunk = createAsyncThunk(
  "post/toggleWishlistPost",
  async ({ postId }, { rejectWithValue }) => {
    try {
      // Ensure postId is present
      if (!postId) {
        return rejectWithValue("Post ID is required");
      }
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const token = getAuthToken(); // Retrieve the JWT token
      const url = `${backendUrl}/api/post/wishlisttoggle/${postId}`; // Backend route

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "", // Include token if available
        },
      });

      // Check if response is not OK
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to toggle wishlist status");
      }

      // Parse JSON response
      const data = await response.json();

      // Ensure backend returns the expected structure
      if (!data || typeof data.isInWishlist === "undefined") {
        throw new Error("Invalid response from server");
      }

      // Return postId and new wishlist status
      return { postId, isInWishlist: data.isInWishlist };
    } catch (error) {
      // Reject with detailed error message
      return rejectWithValue(error.message || "An error occurred");
    }
  }
);


// Add a comment to a post
export const addCommentThunk = createAsyncThunk(
  "post/addComment",
  async ({ postId, body, page = 1, per_page = 10 }, { rejectWithValue }) => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const token = getAuthToken();
      const response = await fetch(`${backendUrl}/api/post/comment/${postId}?page=${page}&per_page=${per_page}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ body }), // Sending 'body' instead of 'comment'
      });

      if (!response.ok) throw new Error("Failed to add comment");

      const data = await response.json();
      
      // Returning the updated list of comments and pagination data
      return {
        new_comment: data.new_comment, // The ID of the newly added comment
        comments: data.comments, // Updated list of comments with replies
        pagination: data.pagination, // Pagination data
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// Add a reply to a comment
export const addReplyThunk = createAsyncThunk(
  "post/addReply",
  async ({ commentId, body }, { rejectWithValue }) => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const token = getAuthToken();
      const response = await fetch(`${backendUrl}/api/comments/${commentId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ body }),
      });

      if (!response.ok) throw new Error("Failed to add reply");
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create the slice
const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    // Local reducers to handle direct state changes
    likePost(state, action) {
      if (state.post) {
        state.post.likes_count = action.payload.likes_count;
        state.post.isLiked = action.payload.isLiked;
      }
    },
    unlikePost(state, action) {
      if (state.post) {
        state.post.likes_count = action.payload.likes_count;
        state.post.isLiked = action.payload.isLiked;
      }
    },
    wishlistPost(state, action) {
      if (state.post) {
        state.post.wishlist_count = action.payload.wishlist_count;
        state.post.isInWishlist = action.payload.isInWishlist;
      }
    },
    addComment(state, action) {
      if (state.post) {
        state.post.comments = action.payload.comments;
        state.post.pagination = action.payload.pagination;
      }
    },
    addReply(state, action) {
      if (state.post) {
        const comment = state.post.comments.find(
          (c) => c.id === action.payload.parent_comment_id
        );
        if (comment) {
          comment.replies.push(action.payload);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch post
      .addCase(fetchPostById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.post = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Toggle like/unlike post
      .addCase(toggleLikePostThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(toggleLikePostThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update the post's like information
        if (state.post) {
          state.post.likes_count = action.payload.likes_count;
          state.post.isLiked = action.payload.isLiked;
        }
      })
      .addCase(toggleLikePostThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Wishlist post
      .addCase(toggleWishlistPostThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(toggleWishlistPostThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update the post's wishlist information
        if (state.post) {
          state.post.wishlist_count = action.payload.wishlist_count;
          state.post.isInWishlist = action.payload.isInWishlist;
        }
      })
      .addCase(toggleWishlistPostThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add comment
      .addCase(addCommentThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addCommentThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.post) {
          state.post.comments = action.payload.comments;
          state.post.pagination = action.payload.pagination;
        }
      })
      .addCase(addCommentThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add reply
      .addCase(addReplyThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addReplyThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.post) {
          const comment = state.post.comments.find(
            (c) => c.id === action.payload.parent_comment_id
          );
          if (comment) {
            comment.replies.push(action.payload);
          }
        }
      })
      .addCase(addReplyThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { likePost, unlikePost, wishlistPost, addComment, addReply } =
  postSlice.actions;
export default postSlice.reducer;
