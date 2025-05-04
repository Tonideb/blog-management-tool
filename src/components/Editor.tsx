import { Block } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { useState } from "react";

export default function Editor() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [title, setTitle] = useState("");
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
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title || "Untitled Post",
          content: content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save post");
      }

      const result = await response.json();
      console.log("Post saved:", result);
      alert("Post saved successfully!");
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Error saving post");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <div className="wrapper w-full p-12">
        <div className="editor-container">
          <input
            type="text"
            placeholder="Post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 mb-12 border rounded"
          />

          <div className="mb-16">
            <BlockNoteView
              editor={editor}
              onChange={() => {
                // Saves the document JSON to state.
                setBlocks(editor.document);
              }}
            />
          </div>
        </div>

        {/* <div className="json-container">
        <pre>
        <code>{JSON.stringify(blocks, null, 2)}</code>
        </pre>
      </div> */}
        <div className="flex justify-self-end mb-12">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isSubmitting ? "Saving..." : "Save Post"}
          </button>
        </div>

        <div className="mt-4 p-4 rounded">
          <h3 className="font-bold mb-2">Content Preview (JSON):</h3>
          <pre className="text-xs overflow-auto max-h-40">
            {JSON.stringify(blocks, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
