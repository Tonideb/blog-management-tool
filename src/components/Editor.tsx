import { Block } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { useState } from "react";

export default function Editor() {
  const [_blocks, setBlocks] = useState<Block[]>([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [cardColor, setCardColor] = useState("#FF5733"); // Default color
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editor = useCreateBlockNote();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const content = await editor.document;
      const apiUrl = import.meta.env.VITE_API_BASE_URL;

      if (!apiUrl) {
        throw new Error("API base URL is not configured");
      }

      const response = await fetch(`${apiUrl}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title || "Untitled Post",
          content: content,
          author: author || "Anonymous",
          category: category || "Uncategorized",
          coverImage: coverImage || null,
          cardColor: cardColor || "#FF5733",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save post");
      }

      const result = await response.json();
      console.log("Post saved:", result);

      // Reset form after successful submission
      setTitle("");
      setAuthor("");
      setCategory("");
      setCoverImage("");
      setCardColor("#FF5733");
      editor.replaceBlocks(editor.document, []);

      alert("Post saved successfully!");
    } catch (error) {
      console.error("Error saving post:", error);
      alert(
        `Error saving post: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <div className="wrapper w-full p-12">
        <div className="editor-container space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Color</label>
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
          
         
        </div>
      </div>

          {/* Editor Content */}
          <div className="my-8">
            <BlockNoteView
              editor={editor}
              onChange={() => {
                setBlocks(editor.document);
              }}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !title}
              className={`px-6 py-3 rounded text-white font-medium ${
                isSubmitting || !title
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Publishing..." : "Publish Post"}
            </button>
          </div>

          {/* Content Preview (optional) */}
          {/* <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-bold mb-2 text-sm">Content Preview (JSON):</h3>
            <pre className="text-xs overflow-auto max-h-40 bg-white p-2 rounded">
              {JSON.stringify(blocks, null, 2)}
            </pre>
          </div> */}
        </div>
      </div>
    </div>
  );
}
