import { createSlice } from "@reduxjs/toolkit";

// Initial state for the post slice
const initialState = {
  post: null,
  isLoading: false,
  error: null,
};

// Create the slice with reducers and actions
const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    fetchPostStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchPostSuccess(state, action) {
      state.isLoading = false;
      state.post = action.payload;
    },
    fetchPostFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    likePost(state, action) {
      if (state.post) {
        state.post.likes_count = action.payload.likes_count;
      }
    },
    wishlistPost(state, action) {
      if (state.post) {
        // Toggle wishlist count only if state.post exists
        if (action.payload.isAdded) {
          state.post.wishlist_count += 1;
        } else {
          state.post.wishlist_count -= 1;
        }
      }
    },
    addComment(state, action) {
      if (state.post) {
        state.post.comments.push(action.payload);
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
});

// Export actions
export const {
  fetchPostStart,
  fetchPostSuccess,
  fetchPostFailure,
  likePost,
  wishlistPost,
  addComment,
  addReply,
} = postSlice.actions;

// Export the reducer
export default postSlice.reducer;

// Thunk to fetch post by ID
export const fetchPostById = (postId) => async (dispatch) => {
  try {
    dispatch(fetchPostStart());

    const response = await fetch(`/api/post/read/${postId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch post");
    }

    const data = await response.json();
    dispatch(fetchPostSuccess(data.post));
  } catch (error) {
    dispatch(fetchPostFailure(error.message));
  }
};

// Thunk to like a post
export const likePostThunk = (postId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/post/like/${postId}`, {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error("Failed to like post");
    }
    const data = await response.json();
    dispatch(likePost(data));
  } catch (error) {
    console.error(error);
  }
};

// Thunk to add/remove post to/from wishlist
export const wishlistPostThunk =
  (postId, isAdding) => async (dispatch, getState) => {
    try {
      const state = getState();
      const post = state.post.post;

      if (!post) {
        throw new Error("Post not found");
      }

      if (isAdding) {
        const response = await fetch(
          `/api/post/addtowishlist/${postId}`,
          {
            method: "POST",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to add post to wishlist");
        }

        dispatch(wishlistPost({ isAdded: true }));
      } else {
        if (post.wishlist_count > 0) {
          const response = await fetch(`/api/post/removefromwishlist/${postId}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            throw new Error("Failed to remove post from wishlist");
          }

          dispatch(wishlistPost({ isAdded: false }));
        } else {
          throw new Error("Post is not in wishlist");
        }
      }
    } catch (error) {
      console.error(error);
      // You could dispatch a failure action here to handle errors globally.
    }
  };

// Thunk to add a comment
export const addCommentThunk = (postId, body) => async (dispatch) => {
  try {
    const response = await fetch(`/api/post/comment/${postId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    if (!response.ok) {
      throw new Error("Failed to add comment");
    }
    const data = await response.json();
    dispatch(addComment(data));
  } catch (error) {
    console.error(error);
  }
};

// Thunk to add a reply
export const addReplyThunk = (commentId, body) => async (dispatch) => {
  try {
    const response = await fetch(`/api/comments/${commentId}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    if (!response.ok) {
      throw new Error("Failed to add reply");
    }
    const data = await response.json();
    dispatch(addReply(data));
  } catch (error) {
    console.error(error);
  }
};
