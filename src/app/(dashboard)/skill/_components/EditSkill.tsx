"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ChevronRight,
  Save,
  Zap,
  Type,
  Palette,
  Target,
  Info,
  ImageIcon,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Image from "next/image";

export default function EditSkill() {
  const { id } = useParams(); // URL থেকে ID নেওয়ার জন্য
  const router = useRouter();
  const queryClient = useQueryClient();

  // স্টেট ম্যানেজমেন্ট
  const [skillColor, setSkillColor] = useState("#c7d300");
  const [proficiency, setProficiency] = useState(80);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // ১. নির্দিষ্ট স্কিলের ডাটা ফেচ করা (Default Value এর জন্য)
  const { data: skillData, isLoading } = useQuery({
    queryKey: ["skill", id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/skill/getsingleSkill/${id}`,
      );
      const result = await res.json();
      return result.data;
    },
    enabled: !!id,
  });

  // ডাটা আসার পর স্টেট আপডেট করা
  useEffect(() => {
    if (skillData) {
      setSkillColor(skillData.color);
      setProficiency(skillData.proficiency);
    }
  }, [skillData]);

  // ২. আপডেট মিউটেশন (Edit Logic)
  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/skill/updateSkill/${id}`,
        {
          method: "PUT", // বা PUT আপনার API অনুযায়ী
          body: formData,
        },
      );
      if (!res.ok) throw new Error("Failed to update skill");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      queryClient.invalidateQueries({ queryKey: ["skill", id] });
      toast.success("Skill updated successfully");
      router.push("/skill");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("color", skillColor);
    formData.set("proficiency", proficiency.toString());

    // যদি নতুন ইমেজ সিলেক্ট করা হয় তবেই অ্যাড হবে, না হলে আগেরটাই থাকবে
    if (imageFile) {
      formData.append("skillImage", imageFile);
    }

    mutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#c7d300]" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <nav className="flex items-center space-x-2 text-sm bg-[#212121]/30 w-fit px-5 py-2.5 rounded-full border border-zinc-800">
          <Link
            href="/"
            className="flex items-center text-zinc-400 hover:text-[#c7d300] transition-colors"
          >
            <LayoutDashboard className="h-4 w-4 mr-2" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <ChevronRight className="h-4 w-4 text-zinc-600" />
          <Link
            href="/dashboard/skills"
            className="text-zinc-400 hover:text-[#c7d300]"
          >
            Skills
          </Link>
          <ChevronRight className="h-4 w-4 text-zinc-600" />
          <div className="flex items-center">
            <span className="text-white font-semibold tracking-wide text-[12px] uppercase">
              Edit Skill
            </span>
            <span className="ml-2 h-1.5 w-1.5 rounded-full bg-[#c7d300]"></span>
          </div>
        </nav>

        <button
          disabled={mutation.isPending}
          type="submit"
          className="flex items-center gap-2 bg-[#c7d300] text-black px-8 py-3 rounded-xl font-bold text-base hover:shadow-[0_0_20px_rgba(199,211,0,0.3)] transition-all disabled:opacity-50"
        >
          {mutation.isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          Update Skill
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Image & Color */}
        <div className="space-y-6">
          <section className="bg-[#212121] border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-[#c7d300] text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
              <ImageIcon className="h-4 w-4" /> Skill Image
            </h3>
            <div className="space-y-4">
              {/* ইমেজ প্রিভিউ (আগের ইমেজ) */}
              {!imageFile && skillData?.image && (
                <div className="w-16 h-16 mb-4 bg-zinc-900 p-2 rounded-lg border border-zinc-800">
                  <Image
                    width={500}
                    height={500}
                    src={skillData.image}
                    alt="preview"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#c7d300] file:text-black"
              />
              <p className="text-[10px] text-zinc-500 italic">
                * Leave empty to keep the current image.
              </p>
            </div>
          </section>

          {/* Color Picker Section */}
          <section className="bg-[#212121] border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-[#c7d300] text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
              <Palette className="h-4 w-4" /> Theme Color
            </h3>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={skillColor}
                onChange={(e) => setSkillColor(e.target.value)}
                className="h-12 w-12 rounded-lg bg-transparent border border-zinc-800 cursor-pointer"
              />
              <input
                type="text"
                value={skillColor}
                readOnly
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-mono text-white focus:border-[#c7d300] outline-none"
              />
            </div>
          </section>
        </div>

        {/* Right Column: Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-[#212121] border border-zinc-800 rounded-2xl p-8 space-y-8">
            <h3 className="text-[#c7d300] text-xs font-bold uppercase tracking-widest flex items-center gap-2 border-b border-zinc-800 pb-4">
              <Zap className="h-4 w-4" /> Skill Identification
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-2">
                  <Type className="h-3.5 w-3.5" /> Skill Name
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={skillData?.name}
                  required
                  placeholder="e.g. Next.js"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-sm text-white focus:border-[#c7d300] outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-2">
                  <Target className="h-3.5 w-3.5" /> Proficiency ({proficiency}
                  %)
                </label>
                <div className="flex items-center gap-4 py-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={proficiency}
                    onChange={(e) => setProficiency(parseInt(e.target.value))}
                    className="flex-1 accent-[#c7d300] h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-2">
                <Info className="h-3.5 w-3.5" /> Short Description
              </label>
              <textarea
                name="description"
                defaultValue={skillData?.description}
                required
                rows={4}
                placeholder="e.g. Next.js — The React Framework for the Web."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-sm text-white focus:border-[#c7d300] outline-none transition-all resize-none"
              />
            </div>
          </section>
        </div>
      </div>
    </form>
  );
}
