import Feed from "../components/Feed";
import '../styles/FeedPage.css'

const FeedPage = () => {

    return (
      <div className="feed-page-container">
        <h1 className="feed-page-title">Feed page</h1>
        <div className="feed-container">
          <Feed />
        </div>
      </div>
    );
}

export default FeedPage;