import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="status empty-page">
      <p>This page wandered off into tall grass.</p>
      <Link to="/" className="back-link">
        ← Back to the dex
      </Link>
    </div>
  );
}

export default NotFoundPage;
