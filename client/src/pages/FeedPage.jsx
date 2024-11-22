import Feed from "../components/Feed";
import "../styles/FeedPage.css";

const FeedPage = () => {

  return (
    <div className="feed-page-container">
      <div className="feed-header">
      </div>
      <div className="feed-container">
        <Feed />
      </div>
    </div>
  );
};

export default FeedPage;
