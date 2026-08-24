/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { 
  LayoutDashboard, ChevronRight, Save, Plus, 
  Image as ImageIcon, Code2, Link as Type, Loader2 
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

export default function Addknowledge() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  // const [images, setImages] = useState<string[]>([]); // Gallery images URLs if any
  
  const [formData, setFormData] = useState({
    title: "",
    category: "Logic",
    shortDescription: "",
    fullContent: "",
    logicSnippet: "",
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.title || !thumbnail) {
      return toast.error("Please provide a title and thumbnail image");
    }

    setLoading(true);
    try {
      const payload = new FormData();
      
      // আপনার রিকোয়ারমেন্ট অনুযায়ী JSON ডাটা "data" ফিল্ডে পাঠানো হচ্ছে
      const dataContent = {
        ...formData,
        isActive: true,
      };
      payload.append("data", JSON.stringify(dataContent));
      
      // মেইন থাম্বনেইল ইমেজ যোগ করা হচ্ছে
      payload.append("images", thumbnail);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/knowledge/create-knowledge`, {
        method: "POST",
        body: payload,
      });

      const result = await res.json();
      if (result.status) {
        toast.success("Insight added successfully!");
        router.push("/dashboard/knowledge");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <nav className="flex items-center space-x-2 text-sm bg-[#212121]/30 w-fit px-5 py-2.5 rounded-full border border-zinc-800">
          <Link href="/dashboard" className="flex items-center text-zinc-400 hover:text-[#c7d300]">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <ChevronRight className="h-4 w-4 text-zinc-600" />
          <span className="text-white font-semibold tracking-wide text-[12px] uppercase">New Insight</span>
        </nav>

        <button 
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 bg-[#c7d300] text-black px-8 py-3 rounded-xl font-bold text-base hover:shadow-[0_0_20px_rgba(199,211,0,0.3)] disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />} 
          Save Insight
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <section className="bg-[#1a1b14] border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-[#c7d300] text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
              <ImageIcon className="h-4 w-4" /> Thumbnail
            </h3>
            <div className="space-y-4">
              <label className="aspect-video relative rounded-2xl border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center bg-black group hover:border-[#c7d300] transition-all cursor-pointer overflow-hidden">
                {thumbnail ? (
                  <Image width={500} height={500} src={URL.createObjectURL(thumbnail)} className="object-cover w-full h-full" alt="preview" />
                ) : (
                  <>
                    <Plus className="text-zinc-600 group-hover:text-[#c7d300]" />
                    <span className="text-[10px] text-zinc-500 font-bold uppercase mt-2">Upload Thumbnail</span>
                  </>
                )}
                <input type="file" className="hidden" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} />
              </label>
            </div>
          </section>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <section className="bg-[#1a1b14] border border-zinc-800 rounded-3xl p-8 space-y-6">
            <h3 className="text-[#c7d300] text-xs font-black uppercase tracking-widest flex items-center gap-2 border-b border-zinc-800 pb-4">
              <Type className="h-4 w-4" /> Content Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 font-bold uppercase">Post Title</label>
                <input name="title" onChange={handleInputChange} type="text" placeholder="Title..." className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-sm text-white focus:border-[#c7d300] outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 font-bold uppercase">Category</label>
                <select name="category" onChange={handleInputChange} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-sm text-white focus:border-[#c7d300] outline-none">
                  <option value="Blog">Blog</option>
                  <option value="Logic">Logic</option>
                  <option value="Problem Solving">Problem Solving</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 font-bold uppercase">Short Description</label>
              <textarea name="shortDescription" onChange={handleInputChange} rows={2} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-400 focus:border-[#c7d300] outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 font-bold uppercase">Full Content</label>
              <textarea name="fullContent" onChange={handleInputChange} rows={6} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-400 focus:border-[#c7d300] outline-none" />
            </div>
          </section>

          <section className="bg-[#1a1b14] border border-zinc-800 rounded-3xl p-8 space-y-6">
             <div className="flex items-center gap-2 text-[#c7d300] text-xs font-black uppercase tracking-widest">
                <Code2 size={16} /> Implementation Logic
             </div>
             <textarea name="logicSnippet" onChange={handleInputChange} rows={5} placeholder="Paste code here..." className="w-full bg-black border border-zinc-800 rounded-2xl p-6 text-xs text-[#c7d300] font-mono focus:border-[#c7d300] outline-none" />
          </section>
        </div>
      </div>
    </div>
  );
}