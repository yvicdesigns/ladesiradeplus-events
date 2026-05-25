"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}

export function ImageUpload({ value, onChange, folder = "articles" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Fichier invalide — images uniquement (JPG, PNG, WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image trop grande — 5 Mo maximum.");
      return;
    }

    setUploading(true);
    setError(null);

    const ext = file.name.split(".").pop() ?? "jpg";
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filename, file, { upsert: true });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("images").getPublicUrl(filename);
    onChange(data.publicUrl);
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleRemove = async () => {
    if (!value) return;
    const path = value.split("/images/")[1];
    if (path) {
      await supabase.storage.from("images").remove([path]);
    }
    onChange("");
  };

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative w-full h-44 rounded-xl overflow-hidden group border border-black/10 dark:border-gold/20">
          <Image src={value} alt="aperçu" fill className="object-cover" sizes="500px" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="bg-white text-gray-800 px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-gray-100 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" /> Changer
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="bg-red-500 text-white px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-red-600 transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Supprimer
            </button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`w-full h-36 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
            dragOver
              ? "border-gold bg-gold/10"
              : "border-gold/40 hover:border-gold hover:bg-gold/5"
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="w-7 h-7 text-gold animate-spin" />
              <p className="text-xs text-gray-400">Envoi en cours…</p>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-gold" />
              </div>
              <p className="text-sm font-medium text-gray-500">
                Glisser une image ou{" "}
                <span className="text-gold font-semibold">parcourir</span>
              </p>
              <p className="text-xs text-gray-400">PNG, JPG, WebP · max 5 Mo</p>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1.5">
          <X className="w-3.5 h-3.5" /> {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
