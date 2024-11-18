import Post from "../components/Post"; // Import the Post component
import "../styles/PostPage.css"; // Add your CSS styling here

const PostPage = () => {
  return (
    <div className="post-page-container">
      <h2 className="post-page-title">Post Details</h2>
      <div className="post-container">
        <Post />
      </div>
    </div>
  );
};

export default PostPage;
