import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-lg">
          <h1 className="text-5xl font-bold text-center">Edit your blogs</h1>
          <p className="py-6">
            Create, edit, and manage your blog posts with our intuitive
            rich-text editor. Format your content easily with real-time
            previews, save drafts automatically, and publish with confidence.
            Perfect for writers, marketers, and content creators.
          </p>
          <button className="btn btn-primary">
            <Link to="/all-blogs">All Blogs</Link>
          </button>
        </div>
      </div>
    </div>
  );
}
