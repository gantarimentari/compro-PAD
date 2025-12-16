"use client";

import { useEffect, useRef, useState } from "react";
import "quill/dist/quill.snow.css";

export default function QuillEditor({ value, onChange, placeholder = "", className = "", }) {
  const editorRef = useRef(null);
  const quillInstance = useRef(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !editorRef.current || quillInstance.current) return;

    // Dynamic import Quill hanya di client-side
    import("quill").then((QuillModule) => {
      const Quill = QuillModule.default;

      // Init Quill sekali saja
      quillInstance.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder,
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
          ],
        },
      });

      // Set initial value
      if (value) {
        quillInstance.current.root.innerHTML = value;
      }

      // Handle change
      quillInstance.current.on("text-change", () => {
        const html = quillInstance.current.root.innerHTML;
        onChange && onChange(html);
      });
    });

    // Cleanup
    return () => {
      if (quillInstance.current) {
        quillInstance.current = null;
      }
    };
  }, [isClient]);

  // Update dari luar (hanya jika value berubah dari parent)
  useEffect(() => {
    if (quillInstance.current && value !== undefined) {
      const currentContent = quillInstance.current.root.innerHTML;
      if (currentContent !== value && !quillInstance.current.hasFocus()) {
        quillInstance.current.root.innerHTML = value;
      }
    }
  }, [value]);

  if (!isClient) {
    return (
      <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 min-h-[200px] flex items-center justify-center">
        <p className="text-gray-500">Loading editor...</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div ref={editorRef} style={{ minHeight: "200px" }} />
    </div>
  );
}
