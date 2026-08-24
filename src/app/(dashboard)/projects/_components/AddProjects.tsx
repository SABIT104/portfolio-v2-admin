/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import {
  LayoutDashboard,
  ChevronRight,
  Save,
  Plus,
  ImageIcon,
  Type,
  Code2,
  Hash,
  Globe,
  Loader2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";
import Image from "next/image";

export default function AddProject() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // State Management
  const [tags, setTags] = useState<string[]>([""]);
  const [description, setDescription] = useState("");

  // Multiple images state
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Single video state
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [links, setLinks] = useState([{ name: "Live Preview", url: "" }]);

  const mutation = useMutation({
    mutationFn: async (fd: FormData) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/project/createProject`,
        {
          method: "POST",
          body: fd,
        },
      );
      if (!res.ok) throw new Error("Failed to create project");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project published successfully!");
      router.push("/projects");
    },
    onError: () => {
      toast.error("Something went wrong!");
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      // Add new files to existing ones
      setImageFiles((prev) => [...prev, ...selectedFiles]);

      // Create preview URLs
      const newPreviews = selectedFiles.map((file) =>
        URL.createObjectURL(file),
      );
      setPreviewUrls((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const form = e.target;
    const fd = new FormData();

    // Append multiple images
    imageFiles.forEach((file) => {
      fd.append("images", file);
    });

    // Append single video
    if (videoFile) fd.append("video", videoFile);

    const projectData = {
      title: form.title.value,
      category: form.category.value,
      links: links.filter((l) => l.name !== "" && l.url !== ""),
      tags: tags.filter((t) => t !== ""),
      description: description,
      logicSnippet: form.logic.value,
      isActive: true,
    };

    fd.append("data", JSON.stringify(projectData));
    mutation.mutate(fd);
  };

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "clean"],
      ],
    }),
    [],
  );

  return (
    <form onSubmit={handleSubmit}>
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-20 backdrop-blur-md py-4 border-b border-zinc-900 mb-6">
        <nav className="flex items-center space-x-2 text-sm bg-zinc-900/50 px-5 py-2.5 rounded-full border border-zinc-800">
          <Link
            href="/dashboard"
            className="text-zinc-400 hover:text-[#c7d300] transition-colors flex items-center"
          >
            <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
          </Link>
          <ChevronRight className="h-4 w-4 text-zinc-600" />
          <span className="text-white font-semibold text-[11px] uppercase tracking-widest">
            New Project
          </span>
        </nav>
        <button
          disabled={mutation.isPending}
          className="flex items-center gap-2 bg-[#c7d300] text-black px-10 py-3 rounded-xl font-extrabold hover:shadow-[0_0_20px_rgba(199,211,0,0.2)] active:scale-95 transition-all disabled:opacity-50"
        >
          {mutation.isPending ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          PUBLISH PROJECT
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <section className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-[#c7d300] text-[10px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <ImageIcon className="h-4 w-4" /> Media Assets
            </h3>

            <div className="space-y-6">
              {/* Multiple Images Upload */}
              <div className="relative group aspect-video rounded-xl border-2 border-dashed border-zinc-800 bg-zinc-900/30 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-[#c7d300]/40">
                <div className="text-center p-4">
                  <div className="bg-zinc-800 p-3 rounded-full mb-3 mx-auto w-fit">
                    <Plus className="h-6 w-6 text-zinc-500" />
                  </div>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">
                    Add Project Images
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple // Enabled Multiple
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>

              {/* Image Previews Grid */}
              {previewUrls.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {previewUrls.map((url, index) => (
                    <div
                      key={index}
                      className="relative aspect-video rounded-lg overflow-hidden border border-zinc-800 group"
                    >
                      <Image
                        width={200}
                        height={200}
                        src={url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 p-1 rounded-full hover:scale-110 transition-transform opacity-0 group-hover:opacity-100"
                      >
                        <X className="h-3 w-3 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Single Video Upload */}
              <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                <label className="text-[9px] text-zinc-500 font-black uppercase mb-3 block">
                  Video Demo (Optional - Single)
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  className="block w-full text-xs text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer"
                />
                {videoFile && (
                  <p className="text-[10px] text-[#c7d300] mt-2 truncate">
                    Selected: {videoFile.name}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Tech Stack Section */}
          <section className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[#c7d300] text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                <Hash className="h-4 w-4" /> Tech Stack
              </h3>
              <button
                type="button"
                onClick={() => setTags([...tags, ""])}
                className="p-1.5 bg-[#c7d300]/10 hover:bg-[#c7d300] hover:text-black rounded-lg transition-all text-[#c7d300]"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1 bg-zinc-900/80 border border-zinc-800 rounded-lg px-3 py-1.5 focus-within:border-[#c7d300] transition-colors"
                >
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => {
                      const newTags = [...tags];
                      newTags[i] = e.target.value;
                      setTags(newTags);
                    }}
                    placeholder="Skill"
                    className="bg-transparent text-xs text-zinc-300 outline-none w-16"
                  />
                  <button
                    type="button"
                    onClick={() => setTags(tags.filter((_, idx) => idx !== i))}
                    className="text-zinc-600 hover:text-red-500 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 space-y-6 shadow-xl">
            <h3 className="text-[#c7d300] text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 border-b border-zinc-800 pb-4">
              <Type className="h-4 w-4" /> Essentials
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider ml-1">
                  Title
                </label>
                <input
                  name="title"
                  required
                  type="text"
                  placeholder="Project Name"
                  className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 text-sm text-white focus:border-[#c7d300] outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider ml-1">
                  Category
                </label>
                <select
                  name="category"
                  className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 text-sm text-white focus:border-[#c7d300] outline-none appearance-none cursor-pointer"
                >
                  <option>Frontend</option>
                  <option>Fullstack</option>
                  <option>Mobile App</option>
                  <option>UI/UX</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider ml-1">
                Description
              </label>
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl overflow-hidden [&_.ql-toolbar]:border-none [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-zinc-800 [&_.ql-toolbar]:bg-zinc-950/50 [&_.ql-container]:border-none [&_.ql-container]:text-zinc-300 [&_.ql-editor]:min-h-[200px] [&_.ql-editor]:text-sm">
                <ReactQuill
                  theme="snow"
                  value={description}
                  onChange={setDescription}
                  modules={modules}
                  placeholder="Tell us about the project journey..."
                />
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-[#c7d300] text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <Code2 className="h-4 w-4" /> Key Logic Snippet
              </h3>
              <textarea
                name="logic"
                placeholder="// Paste your most impressive code block here..."
                className="w-full bg-zinc-900/20 border border-zinc-800 rounded-xl p-5 text-xs text-[#c7d300] font-mono focus:border-[#c7d300] outline-none min-h-[250px] resize-none"
              />
            </section>

            <section className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[#c7d300] text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                  <Globe className="h-4 w-4" /> Live Links
                </h3>
                <button
                  type="button"
                  onClick={() => setLinks([...links, { name: "", url: "" }])}
                  className="text-[9px] bg-zinc-800 hover:bg-[#c7d300] hover:text-black font-black uppercase px-3 py-1.5 rounded-md transition-all"
                >
                  + Add New
                </button>
              </div>
              <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-800">
                {links.map((link, i) => (
                  <div
                    key={i}
                    className="p-4 bg-zinc-900/30 rounded-xl border border-zinc-800 relative group transition-all hover:bg-zinc-900/50"
                  >
                    <input
                      placeholder="Link Name"
                      value={link.name}
                      onChange={(e) => {
                        const l = [...links];
                        l[i].name = e.target.value;
                        setLinks(l);
                      }}
                      className="w-full bg-transparent text-[11px] font-bold text-zinc-200 outline-none border-b border-zinc-800 focus:border-[#c7d300] pb-2 mb-2"
                    />
                    <input
                      placeholder="https://..."
                      value={link.url}
                      onChange={(e) => {
                        const l = [...links];
                        l[i].url = e.target.value;
                        setLinks(l);
                      }}
                      className="w-full bg-transparent text-[10px] text-zinc-500 outline-none italic"
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </form>
  );
}
