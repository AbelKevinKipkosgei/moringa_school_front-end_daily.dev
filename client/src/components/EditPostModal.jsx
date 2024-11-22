
import React from "react";
import { Formik, Form, Field } from "formik";
import "../styles/EditPostModal.css";

const EditPostModal = ({ post, onClose, onSubmit }) => {
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    
    try {
    
      const response = await fetch(`${backendUrl}/api/allposts/${post.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(values),
      });
      

      if (!response.ok) {
        throw new Error("Failed to update post");
      }
     
      

      const updatedPost = await response.json();
      onSubmit(updatedPost.post); // Pass updated post back to parent
      onClose();
    } catch (error) {
      
      setErrors({ submit: "Failed to update post." });
    } finally {
      
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit Post</h2>
        <Formik
          initialValues={{
            title: post.title,
            post_type: post.post_type,
            thumbnail_url: post.thumbnail_url,
            media_url: post.media_url || "",
            body: post.body,
            approved: post.approved,
            flagged: post.flagged,
          }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <Field type="text" name="title" required />
              </div>
              <div className="form-group">
                <label htmlFor="post_type">Post Type</label>
                <Field as="select" name="post_type" required>
                  <option value="blog">Blog</option>
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                </Field>
              </div>
              <div className="form-group">
                <label htmlFor="thumbnail_url">Thumbnail URL</label>
                <Field type="text" name="thumbnail_url" required />
              </div>
              <div className="form-group">
                <label htmlFor="media_url">Media URL</label>
                <Field type="text" name="media_url" />
              </div>
              <div className="form-group">
                <label htmlFor="body">Body</label>
                <Field as="textarea" name="body" required />
              </div>
              <div className="form-group">
                <label htmlFor="approved">Approved</label>
                <Field type="checkbox" name="approved" />
              </div>
              <div className="form-group">
                <label htmlFor="flagged">Flagged</label>
                <Field type="checkbox" name="flagged" />
              </div>
              {errors.submit && <div className="error">{errors.submit}</div>}
              <div className="modal-actions">
                <button
                  type="button"
                  className="close-button"
                  onClick={onClose}
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="submit-button"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditPostModal;




