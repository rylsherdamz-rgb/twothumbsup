"use client";

import { useState, useCallback, useRef } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Upload, X } from "lucide-react";
import gsap from "gsap";

export default function ImageUpload({ value, onChange, folder = "posts" }: { value: string; onChange: (url: string) => void; folder?: string }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);

  const handleUpload = useCallback(async (file: File) => {
    const supabase = createBrowserSupabaseClient();
    setUploading(true);
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filePath = `${folder}/${fileName}`;
    const { error, data } = await supabase.storage.from("images").upload(filePath, file);
    if (error) { setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("images").getPublicUrl(data.path);
    onChange(publicUrl);
    setPreview(publicUrl);
    setUploading(false);
    if (zoneRef.current) gsap.fromTo(zoneRef.current, { scale: 0.98 }, { scale: 1, duration: 0.3, ease: "power2.out" });
  }, [folder, onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
      handleUpload(file);
    }
  }, [handleUpload]);

  return (
    <div>
      {preview ? (
        <div className="relative border border-[var(--border)] rounded-xl overflow-hidden">
          <img src={preview} alt="Preview" className="w-full max-h-64 object-contain bg-[var(--surface)]" />
          <button onClick={() => { onChange(""); setPreview(null); if (inputRef.current) inputRef.current.value = ""; }} className="absolute top-2 right-2 p-1.5 bg-[var(--text)] text-[var(--bg)] hover:opacity-80 transition-opacity">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          ref={zoneRef}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`field min-h-[120px] flex flex-col items-center justify-center cursor-pointer transition-colors ${
            dragOver ? "border-[var(--text)] bg-[var(--surface)]" : ""
          }`}
        >
          {uploading ? (
            <div className="space-y-3 text-center">
              <div className="w-8 h-8 mx-auto rounded-full border-2 border-[var(--text)] border-t-transparent animate-spin" />
              <p className="text-sm text-[var(--text-muted)]">Uploading...</p>
            </div>
          ) : (
            <div className="text-center space-y-1.5">
              <Upload className="w-5 h-5 text-[var(--text-dim)] mx-auto" />
              <p className="text-sm text-[var(--text-muted)]"><span className="font-semibold text-[var(--text)]">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-[var(--text-dim)]">PNG, JPG, GIF up to 10MB</p>
            </div>
          )}
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) { const reader = new FileReader(); reader.onload = (ev) => setPreview(ev.target?.result as string); reader.readAsDataURL(file); handleUpload(file); }
      }} />
    </div>
  );
}