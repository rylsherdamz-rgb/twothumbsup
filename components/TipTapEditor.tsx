"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, List, ListOrdered, Quote, Heading2, Image as ImageIcon, Undo, Redo } from "lucide-react";
import { useCallback } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

function ToolButton({ onClick, active, children, title }: { onClick: () => void; active?: boolean; children: React.ReactNode; title: string }) {
  return (
    <button type="button" onClick={onClick} title={title}
      className={`p-2 text-sm transition-colors ${active ? "text-[var(--text)] bg-[var(--surface)]" : "text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--surface)]"}`}>
      {children}
    </button>
  );
}

export default function TipTapEditor({ content, onChange }: { content: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit, ImageExtension, Placeholder.configure({ placeholder: "Start writing..." })],
    content,
    editorProps: { attributes: { class: "focus:outline-none min-h-[300px]" } },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  const addImage = useCallback(async () => {
    if (!editor) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const supabase = createBrowserSupabaseClient();
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error, data } = await supabase.storage.from("images").upload(`posts/${fileName}`, file);
      if (error) return;
      const { data: { publicUrl } } = supabase.storage.from("images").getPublicUrl(data.path);
      editor.chain().focus().setImage({ src: publicUrl }).run();
    };
    input.click();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="border border-[var(--border)] rounded-xl overflow-hidden tiptap-editor">
      <div className="flex items-center gap-0.5 p-2 border-b border-[var(--border)] bg-[var(--surface)] flex-wrap">
        <ToolButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold"><Bold className="w-4 h-4" /></ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic"><Italic className="w-4 h-4" /></ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading")} title="Heading"><Heading2 className="w-4 h-4" /></ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Quote"><Quote className="w-4 h-4" /></ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet List"><List className="w-4 h-4" /></ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbered List"><ListOrdered className="w-4 h-4" /></ToolButton>
        <div className="w-px h-5 bg-[var(--border)] mx-1" />
        <ToolButton onClick={addImage} active={false} title="Add Image"><ImageIcon className="w-4 h-4" /></ToolButton>
        <div className="w-px h-5 bg-[var(--border)] mx-1" />
        <ToolButton onClick={() => editor.chain().focus().undo().run()} active={false} title="Undo"><Undo className="w-4 h-4" /></ToolButton>
        <ToolButton onClick={() => editor.chain().focus().redo().run()} active={false} title="Redo"><Redo className="w-4 h-4" /></ToolButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}