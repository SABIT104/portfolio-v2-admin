/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  ChevronRight,
  Save,
  Plus,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

export default function Editknowledge() {
  const { id } = useParams();
  const router = useRouter();
  const [fetching, setFetching] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    category: "Logic",
    shortDescription: "",
    fullContent: "",
    logicSnippet: "",
  });

  // ডাটা ফেচ করা হচ্ছে প্রি-ফিলের জন্য
  useEffect(() => {
    const fetchKnowledge = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/knowledge/single-knowledge/${id}`,
        );
        const result = await res.json();
        if (result.status) {
          const d = result.data;
          setFormData({
            title: d.title,
            category: d.category,
            shortDescription: d.shortDescription,
            fullContent: d.fullContent,
            logicSnippet: d.logicSnippet,
          });
          setPreview(d.images?.[0]?.url || "");
        }
      } catch (err) {
        toast.error("Failed to load data");
      } finally {
        setFetching(false);
      }
    };
    fetchKnowledge();
  }, [id]);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const payload = new FormData();
      payload.append("data", JSON.stringify({ ...formData, isActive: true }));
      if (thumbnail) payload.append("images", thumbnail);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/knowledge/update-knowledge/${id}`,
        {
          method: "PUT",
          body: payload,
        },
      );

      if (res.ok) {
        toast.success("Updated successfully!");
        router.push("/dashboard/knowledge");
      }
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setUpdating(false);
    }
  };

  if (fetching)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#c7d300]" />
      </div>
    );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <nav className="flex items-center space-x-2 text-sm bg-[#212121]/30 w-fit px-5 py-2.5 rounded-full border border-zinc-800">
          <Link href="/dashboard" className="flex items-center text-zinc-400">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <ChevronRight className="h-4 w-4 text-zinc-600" />
          <span className="text-white font-semibold text-[12px] uppercase">
            Edit Insight
          </span>
        </nav>

        <button
          onClick={handleUpdate}
          disabled={updating}
          className="flex items-center gap-2 bg-[#c7d300] text-black px-8 py-3 rounded-xl font-bold"
        >
          {updating ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : (
            <Save className="h-5 w-5" />
          )}{" "}
          Update Insight
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <section className="bg-[#1a1b14] border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-[#c7d300] text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
              <ImageIcon className="h-4 w-4" /> Thumbnail
            </h3>
            <label className="aspect-video relative rounded-2xl border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center bg-black overflow-hidden cursor-pointer">
              {thumbnail ? (
                <Image
                  width={500}
                  height={500}
                  alt="image"
                  src={URL.createObjectURL(thumbnail)}
                  className="object-cover w-full h-full"
                />
              ) : preview ? (
                <Image
                  width={500}
                  height={500}
                  alt="image"
                  src={preview}
                  className="object-cover w-full h-full"
                />
              ) : (
                <Plus />
              )}
              <input
                type="file"
                className="hidden"
                onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
              />
            </label>
          </section>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <section className="bg-[#1a1b14] border border-zinc-800 rounded-3xl p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 font-bold uppercase">
                  Post Title
                </label>
                <input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  type="text"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-sm text-white outline-none focus:border-[#c7d300]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 font-bold uppercase">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-sm text-white outline-none"
                >
                  <option value="Blog">Blog</option>
                  <option value="Logic">Logic</option>
                  <option value="Problem Solving">Problem Solving</option>
                </select>
              </div>
            </div>
            <textarea
              value={formData.shortDescription}
              onChange={(e) =>
                setFormData({ ...formData, shortDescription: e.target.value })
              }
              rows={2}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm text-white outline-none"
              placeholder="Short Description"
            />
            <textarea
              value={formData.fullContent}
              onChange={(e) =>
                setFormData({ ...formData, fullContent: e.target.value })
              }
              rows={6}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm text-white outline-none"
              placeholder="Full Content"
            />
            <textarea
              value={formData.logicSnippet}
              onChange={(e) =>
                setFormData({ ...formData, logicSnippet: e.target.value })
              }
              rows={5}
              className="w-full bg-black border border-zinc-800 rounded-2xl p-6 text-xs text-[#c7d300] font-mono outline-none"
              placeholder="Logic Snippet"
            />
          </section>
        </div>
      </div>
    </div>
  );
}
