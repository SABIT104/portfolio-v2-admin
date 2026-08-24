/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo } from "react";
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
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import Image from "next/image";

// Dynamic import for ReactQuill
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";
export default function EditProject() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  // State Management
  const [tags, setTags] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [links, setLinks] = useState([{ name: "", url: "" }]);

  // Images State
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newPreviewUrls, setNewPreviewUrls] = useState<string[]>([]);

  // Video State
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [hasExistingVideo, setHasExistingVideo] = useState(false);
  const [removeVideo, setRemoveVideo] = useState(false);

  // Fetch Project Data
  const { data: projectData, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/project/getsingleproject/${id}`,
      );
      const result = await res.json();
      return result.data;
    },
    enabled: !!id,
  });

  // Sync data to states
  useEffect(() => {
    if (projectData) {
      setTags(projectData.tags || []);
      setDescription(projectData.description || "");
      setLinks(projectData.links || [{ name: "", url: "" }]);
      setExistingImages(projectData.images || []);
      setHasExistingVideo(!!projectData.video?.url);
    }
  }, [projectData]);

  const mutation = useMutation({
    mutationFn: async (fd: FormData) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/project/updateProject/${id}`,
        {
          method: "POST",
          body: fd,
        },
      );
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project updated successfully!");
      router.push("/dashboard/projects");
    },
    onError: () => toast.error("Update failed!"),
  });

  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewImageFiles((prev) => [...prev, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setNewPreviewUrls((prev) => [...prev, ...previews]);
  };

  const removeExistingImage = (publicId: string) => {
    setExistingImages((prev) =>
      prev.filter((img) => img.publicId !== publicId),
    );
  };

  const removeNewImage = (index: number) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const form = e.target;
    const fd = new FormData();

    // New Images & Video
    newImageFiles.forEach((file) => fd.append("images", file));
    if (videoFile) fd.append("video", videoFile);

    const updateData = {
      title: form.title.value,
      category: form.category.value,
      links: links.filter((l) => l.name && l.url),
      tags: tags.filter((t) => t),
      description: description,
      logicSnippet: form.logic.value,
      isActive: projectData?.isActive,
      existingImages: existingImages, // Backend filters based on this
      removeVideo: removeVideo,
    };

    fd.append("data", JSON.stringify(updateData));
    mutation.mutate(fd);
  };

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "clean"],
      ],
    }),
    [],
  );

  if (isLoading)
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-[#c7d300]" />
      </div>
    );

  return (
    <form onSubmit={handleSubmit}>
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
            Edit Project
          </span>
        </nav>
        <button
          disabled={mutation.isPending}
          className="flex items-center gap-2 bg-[#c7d300] text-black px-10 py-3 rounded-xl font-extrabold hover:shadow-[0_0_20px_rgba(199,211,0,0.2)] transition-all disabled:opacity-50"
        >
          {mutation.isPending ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          SAVE CHANGES
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <section className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-[#c7d300] text-[10px] font-black uppercase mb-6 flex items-center gap-2">
              <ImageIcon className="h-4 w-4" /> Media Assets
            </h3>

            <div className="space-y-4">
              {/* Existing Images */}
              <div className="grid grid-cols-2 gap-2">
                {existingImages.map((img, i) => (
                  <div
                    key={i}
                    className="relative aspect-video rounded-lg overflow-hidden border border-zinc-800 group"
                  >
                    <Image
                      width={200}
                      height={200}
                      src={img.url}
                      alt="existing"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(img.publicId)}
                      className="absolute top-1 right-1 bg-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Upload New Images */}
              <div className="relative aspect-video rounded-xl border-2 border-dashed border-zinc-800 bg-zinc-900/30 flex flex-col items-center justify-center hover:border-[#c7d300]/40 transition-all">
                <Plus className="h-6 w-6 text-zinc-500 mb-2" />
                <span className="text-[10px] text-zinc-500 uppercase font-bold">
                  Add More Images
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleNewImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>

              {/* New Previews */}
              <div className="grid grid-cols-2 gap-2">
                {newPreviewUrls.map((url, i) => (
                  <div
                    key={i}
                    className="relative aspect-video rounded-lg overflow-hidden border border-[#c7d300]/30 group"
                  >
                    <Image
                      width={200}
                      height={200}
                      src={url}
                      alt="new preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(i)}
                      className="absolute top-1 right-1 bg-zinc-900 p-1 rounded-full"
                    >
                      <X className="h-3 w-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Video Section */}
              <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                <label className="text-[9px] text-zinc-500 font-black uppercase mb-2 block">
                  Video Demo
                </label>
                {hasExistingVideo && !removeVideo ? (
                  <div className="flex items-center justify-between bg-zinc-800 p-2 rounded mb-2">
                    <span className="text-[10px] text-white">
                      Existing Video
                    </span>
                    <button
                      type="button"
                      onClick={() => setRemoveVideo(true)}
                      className="text-red-500 text-[10px] font-bold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-zinc-500 file:bg-zinc-800 file:text-white file:border-0 file:rounded file:px-2 file:py-1 cursor-pointer"
                  />
                )}
              </div>
            </div>
          </section>

          <section className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[#c7d300] text-[10px] font-black uppercase flex items-center gap-2">
                <Hash className="h-4 w-4" /> Tech Stack
              </h3>
              <button
                type="button"
                onClick={() => setTags([...tags, ""])}
                className="p-1 bg-[#c7d300]/10 text-[#c7d300] rounded-md"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1 bg-zinc-900/80 border border-zinc-800 rounded-lg px-2 py-1"
                >
                  <input
                    value={tag}
                    onChange={(e) => {
                      const t = [...tags];
                      t[i] = e.target.value;
                      setTags(t);
                    }}
                    className="bg-transparent text-xs text-zinc-300 outline-none w-16"
                  />
                  <X
                    onClick={() => setTags(tags.filter((_, idx) => idx !== i))}
                    className="h-3 w-3 text-zinc-600 cursor-pointer hover:text-red-500"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 space-y-6 shadow-xl">
            <h3 className="text-[#c7d300] text-[10px] font-black uppercase flex items-center gap-2 border-b border-zinc-800 pb-4">
              <Type className="h-4 w-4" /> Essentials
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 font-bold uppercase ml-1">
                  Title
                </label>
                <input
                  name="title"
                  defaultValue={projectData?.title}
                  className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 text-sm text-white focus:border-[#c7d300] outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 font-bold uppercase ml-1">
                  Category
                </label>
                <select
                  name="category"
                  defaultValue={projectData?.category}
                  className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 text-sm text-white outline-none"
                >
                  <option>Frontend</option>
                  <option>Fullstack</option>
                  <option>Mobile App</option>
                  <option>UI/UX</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 font-bold uppercase ml-1">
                Description
              </label>
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl overflow-hidden [&_.ql-editor]:min-h-[200px] [&_.ql-container]:text-zinc-300">
                <ReactQuill
                  theme="snow"
                  value={description}
                  onChange={setDescription}
                  modules={modules}
                />
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-[#c7d300] text-[10px] font-black uppercase mb-4 flex items-center gap-2">
                <Code2 className="h-4 w-4" /> Logic Snippet
              </h3>
              <textarea
                name="logic"
                defaultValue={projectData?.logicSnippet}
                className="w-full bg-zinc-900/20 border border-zinc-800 rounded-xl p-5 text-xs text-[#c7d300] font-mono outline-none min-h-[250px] resize-none"
              />
            </section>

            <section className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[#c7d300] text-[10px] font-black uppercase flex items-center gap-2">
                  <Globe className="h-4 w-4" /> Live Links
                </h3>
                <button
                  type="button"
                  onClick={() => setLinks([...links, { name: "", url: "" }])}
                  className="text-[9px] bg-zinc-800 text-white px-3 py-1.5 rounded-md hover:bg-[#c7d300] hover:text-black transition-all"
                >
                  + Add New
                </button>
              </div>
              <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-800">
                {links.map((link, i) => (
                  <div
                    key={i}
                    className="p-4 bg-zinc-900/30 rounded-xl border border-zinc-800 relative group transition-all"
                  >
                    <input
                      placeholder="Link Name"
                      value={link.name}
                      onChange={(e) => {
                        const l = [...links];
                        l[i].name = e.target.value;
                        setLinks(l);
                      }}
                      className="w-full bg-transparent text-[11px] font-bold text-zinc-200 outline-none border-b border-zinc-800 mb-2 pb-1"
                    />
                    <input
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) => {
                        const l = [...links];
                        l[i].url = e.target.value;
                        setLinks(l);
                      }}
                      className="w-full bg-transparent text-[10px] text-zinc-500 outline-none italic"
                    />
                    <X
                      onClick={() =>
                        setLinks(links.filter((_, idx) => idx !== i))
                      }
                      className="absolute top-2 right-2 h-3 w-3 text-zinc-600 cursor-pointer hover:text-red-500"
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
