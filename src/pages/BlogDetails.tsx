import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";

interface BlogPost {
  id: number;
  title: string;
  content: any[];
  author: string;
  cardColor: string;
  coverImage: string | null;
  category: string;
  category2: string | null;
  category3: string | null;
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

  // Form state
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [category2, setCategory2] = useState("");
  const [category3, setCategory3] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [cardColor, setCardColor] = useState("#FF5733");

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
        // Initialize form fields
        setTitle(data.title);
        setAuthor(data.author);
        setCategory(data.category);
        setCategory2(data.category2 || "");
        setCategory3(data.category3 || "");
        setCoverImage(data.coverImage || "");
        setCardColor(data.cardColor);
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
          title: title,
          content: currentContent,
          author: author,
          category: category,
          category2: category2 || null,
          category3: category3 || null,
          coverImage: coverImage || null,
          cardColor: cardColor,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Failed to update post (HTTP ${response.status})`
        );
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

    if (
      !window.confirm(
        "Are you sure you want to delete this post? This action cannot be undone."
      )
    ) {
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
      {/* Post Metadata Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title*
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Categories Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Main Category*
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                2nd Category
              </label>
              <input
                type="text"
                value={category2}
                onChange={(e) => setCategory2(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                3rd Category
              </label>
              <input
                type="text"
                value={category3}
                onChange={(e) => setCategory3(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Optional"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cover Image URL
            </label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={cardColor}
                onChange={(e) => setCardColor(e.target.value)}
                className="h-10 w-10 p-1 rounded border"
              />
              <input
                type="text"
                value={cardColor}
                onChange={(e) => setCardColor(e.target.value)}
                className="flex-1 p-2 border rounded"
              />
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Created: {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500">
              Last Updated: {new Date(post.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Content Editor */}
      <div className="prose max-w-none mb-8">
        <BlockNoteView editable={true} editor={editor} />
      </div>

      {/* Action Buttons */}
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
          disabled={isSaving || !title || !category}
          className={`px-4 py-2 rounded text-white ${
            isSaving || !title || !category
              ? "bg-gray-400"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
