import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";

export default function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  function addImage(file) {
    const reader = new FileReader();
    reader.onload = () => {
      editor.chain().focus().setImage({ src: reader.result }).run();
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="border rounded-md bg-white">
      {/* TOOLBAR */}
      <div className="flex flex-wrap items-center gap-1 border-b p-2">
        {/* Bold */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`toolbar-btn ${editor.isActive("bold") && "active"}`}
        >
          <strong>B</strong>
        </button>

        {/* Italic */}
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`toolbar-btn ${editor.isActive("italic") && "active"}`}
        >
          <em>I</em>
        </button>

        {/* Underline */}
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`toolbar-btn ${editor.isActive("underline") && "active"}`}
        >
          <u>U</u>
        </button>

        <span className="mx-2 text-slate-300">|</span>

        {/* Headings */}
        {[1, 2, 3, 4, 5].map((l) => (
          <button
            key={l}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: l }).run()
            }
            className={`toolbar-btn ${
              editor.isActive("heading", { level: l }) && "active"
            }`}
          >
            H{l}
          </button>
        ))}

        {/* Blockquote */}
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`toolbar-btn ${editor.isActive("blockquote") && "active"}`}
        >
          ❝
        </button>

        <span className="mx-2 text-slate-300">|</span>

        {/* Bullet List */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`toolbar-btn ${
            editor.isActive("bulletList") && "active"
          }`}
        >
          ••
        </button>

        {/* Ordered List */}
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`toolbar-btn ${
            editor.isActive("orderedList") && "active"
          }`}
        >
          1.
        </button>

        <span className="mx-2 text-slate-300">|</span>

        {/* Link */}
        <button
          onClick={() => {
            const url = prompt("Masukkan URL");
            if (url)
              editor.chain().focus().setLink({ href: url }).run();
          }}
          className={`toolbar-btn ${editor.isActive("link") && "active"}`}
        >
          🔗
        </button>

        {/* Upload Image */}
        <label className="toolbar-btn cursor-pointer">
          🖼
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => addImage(e.target.files[0])}
          />
        </label>

        <span className="mx-2 text-slate-300">|</span>

        {/* Undo */}
        <button
          onClick={() => editor.chain().focus().undo().run()}
          className="toolbar-btn"
        >
          ↺
        </button>

        {/* Redo */}
        <button
          onClick={() => editor.chain().focus().redo().run()}
          className="toolbar-btn"
        >
          ↻
        </button>
      </div>

      {/* EDITOR */}
      <EditorContent
        editor={editor}
        className="p-4 min-h-[180px] prose max-w-none"
      />
    </div>
  );
}
