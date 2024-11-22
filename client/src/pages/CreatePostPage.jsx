import { useDispatch, useSelector } from "react-redux";
import {
  setFormData,
  setLoading,
  setError,
  resetForm,
} from "../slices/createPostSlice";
import { useNavigate } from "react-router-dom";
import { FaRegFileImage, FaMicrophone, FaVideo } from "react-icons/fa"; // Icons for audio/video
import { useState } from "react";
import "../styles/CreatePostPage.css"; // Custom styling for the form


const CreatePostPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { title, body, category, post_type, error, isLoading } = useSelector(
    (state) => state.createPost
  );

  // Local state for file uploads
  const [thumbnail, setThumbnail] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === "thumbnail") {
      setThumbnail(file);
    } else if (type === "media_file") {
      setMediaFile(file);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  // Prepare the form data
  const formData = new FormData();
  formData.append("title", title);
  formData.append("body", body);
  formData.append("category", category);
  formData.append("post_type", post_type);

  if (thumbnail) formData.append("thumbnail", thumbnail);
  if (mediaFile) formData.append("media_file", mediaFile);

  dispatch(setLoading(true));

  try {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      throw new Error("Authentication token is missing");
    }

    const response = await fetch("/api/posts/createpost", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: formData,
    });

    // Handle response
    const data = await response.json();
    console.log(data);

    if (response.ok) {
      dispatch(resetForm());
      navigate(`/post/${data.post.id}`); // Use post.id, assuming data.post contains the full post data with ID
    } else {
      dispatch(setError(data.message || "Failed to create post"));
    }
  } catch (error) {
    dispatch(
      setError(error.message || "An error occurred while creating the post")
    );
  } finally {
    dispatch(setLoading(false));
  }
};

  return (
    <div className="create-post-page-container">
      <h2 className="create-post-header">Create a New Post</h2>
      {error && <div className="error-message">{error}</div>}
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="create-post-form"
      >
        {/* Title */}
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Title:
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={(e) =>
              dispatch(setFormData({ name: "title", value: e.target.value }))
            }
            placeholder="Enter title"
            required
            className="form-input"
          />
        </div>

        {/* Body */}
        <div className="form-group">
          <label htmlFor="body" className="form-label">
            Body:
          </label>
          <textarea
            name="body"
            id="body"
            value={body}
            onChange={(e) =>
              dispatch(setFormData({ name: "body", value: e.target.value }))
            }
            placeholder="Write your post content..."
            required
            className="form-textarea"
          />
        </div>

        {/* Category Dropdown */}
        <div className="form-group">
          <label htmlFor="category" className="form-label">
            Category:
          </label>
          <select
            name="category"
            id="category"
            value={category}
            onChange={(e) =>
              dispatch(setFormData({ name: "category", value: e.target.value }))
            }
            required
            className="form-input"
          >
            <option value="">Select Category</option>
            <option value="Fullstack">Fullstack</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Data Science">Data Science</option>
            <option value="DevOps">DevOps</option>
            <option value="Machine Learning">Machine Learning</option>
          </select>
        </div>

        {/* Post Type Dropdown */}
        <div className="form-group">
          <label htmlFor="post_type" className="form-label">
            Post Type:
          </label>
          <select
            name="post_type"
            id="post_type"
            value={post_type}
            onChange={(e) =>
              dispatch(
                setFormData({ name: "post_type", value: e.target.value })
              )
            }
            required
            className="form-input"
          >
            <option value="">Select Post Type</option>
            <option value="blog">Blog</option>
            <option value="audio">Audio</option>
            <option value="video">Video</option>
          </select>
        </div>

        {/* Conditional File Upload for Audio/Video */}
        {(post_type === "audio" || post_type === "video") && (
          <div className="form-group file-upload">
            <label htmlFor="media-file" className="file-label">
              {post_type === "audio" ? <FaMicrophone /> : <FaVideo />} Media
              File
            </label>
            <div className="file-upload-wrapper">
              <input
                type="file"
                name="media_file"
                accept={post_type === "audio" ? "audio/mp3" : "video/mp4"}
                onChange={(e) => handleFileChange(e, "media_file")}
                id="media-file"
                required
                className="file-input"
              />
              {mediaFile && <span className="file-name">{mediaFile.name}</span>}
            </div>
          </div>
        )}

        {/* Thumbnail Upload */}
        <div className="form-group file-upload">
          <label htmlFor="thumbnail" className="file-label">
            <FaRegFileImage /> Thumbnail (JPG only)
          </label>
          <div className="file-upload-wrapper">
            <input
              type="file"
              name="thumbnail"
              accept="image/jpeg"
              onChange={(e) => handleFileChange(e, "thumbnail")}
              id="thumbnail"
              required
              className="file-input"
            />
            {thumbnail && <span className="file-name">{thumbnail.name}</span>}
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={isLoading} className="submit-button">
          {isLoading ? "Creating Post..." : "Create Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePostPage;
