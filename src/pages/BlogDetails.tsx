import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";

interface BlogPost {
  id: number;
  title: string;
  content: any[];
  createdAt: string;
  updatedAt: string;
}

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const editor = useCreateBlockNote();

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_BASE_URL;
        if (!apiUrl) {
          throw new Error("API base URL is not configured");
        }

        const res = await fetch(`${apiUrl}/posts/${id}`);

        if (!res.ok) {
          throw new Error(`Failed to fetch blog post (HTTP ${res.status})`);
        }

        const data = await res.json();
        setPost(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [id]);

  // Update editor content when post data is available
  useEffect(() => {
    if (post?.content) {
      editor.replaceBlocks(editor.document, post.content);
    }
  }, [post, editor]);

  const handleSave = async () => {
    if (!post) return;

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      if (!apiUrl) {
        throw new Error("API base URL is not configured");
      }

      const currentContent = await editor.document;

      const response = await fetch(`${apiUrl}/posts/${post.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: post.title,
          content: currentContent,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update post (HTTP ${response.status})`);
      }

      const updatedPost = await response.json();
      setPost(updatedPost);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Failed to save changes"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!post) return;

    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      if (!apiUrl) {
        throw new Error("API base URL is not configured");
      }

      const response = await fetch(`${apiUrl}/posts/${post.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete post (HTTP ${response.status})`);
      }

      // Redirect to blog list after successful deletion
      navigate("/all-blogs");
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete post"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading blog post...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error loading blog post: {error}
      </div>
    );
  }

  if (!post) {
    return <div className="text-center py-8">Blog post not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-500 mb-8">
        Published: {new Date(post.createdAt).toLocaleDateString()}
      </p>

      <div className="prose max-w-none mb-8">
        <BlockNoteView editable={true} editor={editor} />
      </div>

      <div className="flex justify-end space-x-4">
        {saveSuccess && (
          <div className="text-green-500 mr-4">Post saved successfully!</div>
        )}
        {(saveError || deleteError) && (
          <div className="text-red-500 mr-4">{saveError || deleteError}</div>
        )}
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className={`px-4 py-2 rounded text-white ${
            isDeleting ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {isDeleting ? "Deleting..." : "Delete Post"}
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`px-4 py-2 rounded text-white ${
            isSaving ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
