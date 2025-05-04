import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface BlogPost {
  id: number;
  title: string;
  content: any[];
  createdAt: string;
  updatedAt: string;
}

export default function AllBlogs() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_BASE_URL;
        if (!apiUrl) {
          throw new Error("API base URL is not configured");
        }

        const res = await fetch(`${apiUrl}/posts`);

        if (!res.ok) {
          throw new Error(`Failed to fetch blog posts (HTTP ${res.status})`);
        }

        const data = await res.json();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading blogs...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error loading blog posts: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-2xl font-bold mb-8">All blogs</header>

      {posts.length === 0 ? (
        <div className="text-center text-gray-500">No blog posts found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/blogs/${post.id}`}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow block"
            >
              <h2 className="text-lg font-semibold">{post.title}</h2>
              <p className="text-sm text-gray-500 mt-2">
                Created: {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
