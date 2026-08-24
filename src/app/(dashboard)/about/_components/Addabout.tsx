/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState } from 'react'
import { 
  LayoutDashboard, ChevronRight, Save, Plus, Trash2, 
  Image as ImageIcon, Type, FileText, BarChart3, 
  Link as LinkIcon, Loader2
} from "lucide-react"
import Link from 'next/link'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Image from 'next/image'

function AddAbout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // States
  const [descriptions, setDescriptions] = useState([""]);
  const [stats, setStats] = useState([{ label: "", value: "" }]);
  const [typewriterStrings, setTypewriterStrings] = useState([""]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Handlers for dynamic fields
  const addField = (setter: any, prev: any[], newItem: any) => setter([...prev, newItem]);
  const removeField = (setter: any, prev: any[], index: number) => setter(prev.filter((_, i) => i !== index));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Mutation
  const addMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/about/createAboutContent`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to create about content");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about"] });
      toast.success("About story published!");
      router.push("/about");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData();

    const data = {
      titleLine1: (form.elements.namedItem("titleLine1") as HTMLInputElement).value,
      titleLine2: (form.elements.namedItem("titleLine2") as HTMLInputElement).value,
      typewriterStrings,
      descriptions,
      stats,
      ctaText: (form.elements.namedItem("ctaText") as HTMLInputElement).value,
      ctaLink: (form.elements.namedItem("ctaLink") as HTMLInputElement).value,
      isActive: true
    };

    formData.append("data", JSON.stringify(data));
    if (image) formData.append("profileImage", image);

    addMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <nav className="flex items-center space-x-2 text-sm bg-[#212121]/30 w-fit px-5 py-2.5 rounded-full border border-zinc-800">
          <Link href="/dashboard" className="flex items-center text-zinc-400 hover:text-[#c7d300] transition-colors">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <ChevronRight className="h-4 w-4 text-zinc-600" />
          <div className="flex items-center">
            <span className="text-white font-semibold tracking-wide text-[12px] uppercase">Add New About</span>
            <span className="ml-2 h-1.5 w-1.5 rounded-full bg-[#c7d300]"></span>
          </div>
        </nav>

        <button 
          disabled={addMutation.isPending}
          type="submit" 
          className="flex items-center gap-2 bg-[#c7d300] text-black px-8 py-3 rounded-xl font-bold text-base hover:shadow-[0_0_20px_rgba(199,211,0,0.3)] transition-all disabled:opacity-50"
        >
          {addMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          Publish Story
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <section className="bg-[#212121] border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-[#c7d300] text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
              <ImageIcon className="h-4 w-4" /> Profile Media
            </h3>
            <label className="group relative w-full aspect-square rounded-xl border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center cursor-pointer hover:border-[#c7d300] transition-all overflow-hidden">
              {imagePreview ? (
                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
              ) : (
                <>
                  <Plus className="h-8 w-8 text-zinc-600 group-hover:text-[#c7d300]" />
                  <p className="text-[10px] text-zinc-500 mt-2 font-bold uppercase">Upload Profile Image</p>
                </>
              )}
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          </section>

          <section className="bg-[#212121] border border-zinc-800 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[#c7d300] text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <Type className="h-4 w-4" /> Typewriter Strings
              </h3>
              <button type="button" onClick={() => addField(setTypewriterStrings, typewriterStrings, "")} className="text-zinc-500 hover:text-[#c7d300]"><Plus className="h-4 w-4" /></button>
            </div>
            <div className="space-y-3">
              {typewriterStrings.map((str, i) => (
                <div key={i} className="flex gap-2">
                  <input 
                    type="text" 
                    value={str}
                    onChange={(e) => {
                      const newStrings = [...typewriterStrings];
                      newStrings[i] = e.target.value;
                      setTypewriterStrings(newStrings);
                    }}
                    placeholder="e.g. Next.js Developer" 
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-300 focus:border-[#c7d300] outline-none" 
                  />
                  <button type="button" onClick={() => removeField(setTypewriterStrings, typewriterStrings, i)} className="text-zinc-700 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <section className="bg-[#212121] border border-zinc-800 rounded-2xl p-8 space-y-6">
            <h3 className="text-[#c7d300] text-xs font-bold uppercase tracking-widest flex items-center gap-2 border-b border-zinc-800 pb-4">
              <FileText className="h-4 w-4" /> Story Content
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Title Line 1</label>
                <input name="titleLine1" type="text" placeholder="Hey, I'm Tanvir 👋" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:border-[#c7d300] outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Title Line 2 (Sub-title)</label>
                <input name="titleLine2" type="text" placeholder="Full Stack Developer" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:border-[#c7d300] outline-none" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Biography Paragraphs</label>
                <button type="button" onClick={() => addField(setDescriptions, descriptions, "")} className="text-[#c7d300] text-xs font-bold flex items-center gap-1 hover:underline">
                  <Plus className="h-3 w-3" /> Add Paragraph
                </button>
              </div>
              {descriptions.map((desc, i) => (
                <div key={i} className="relative group">
                  <textarea 
                    value={desc}
                    onChange={(e) => {
                      const newDesc = [...descriptions];
                      newDesc[i] = e.target.value;
                      setDescriptions(newDesc);
                    }}
                    rows={3} 
                    placeholder={`Paragraph ${i + 1}...`} 
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-400 focus:border-[#c7d300] outline-none resize-none transition-all" 
                  />
                  {i > 0 && (
                    <button type="button" onClick={() => removeField(setDescriptions, descriptions, i)} className="absolute -right-2 -top-2 bg-red-500/10 text-red-500 p-1 rounded-full border border-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-[#212121] border border-zinc-800 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[#c7d300] text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" /> Statistics
                </h3>
                <button type="button" onClick={() => addField(setStats, stats, { label: "", value: "" })} className="text-zinc-500 hover:text-[#c7d300]"><Plus className="h-4 w-4" /></button>
              </div>
              <div className="space-y-3">
                {stats.map((stat, i) => (
                  <div key={i} className="flex gap-2">
                    <input 
                      type="text" 
                      value={stat.value}
                      onChange={(e) => {
                        const newStats = [...stats];
                        newStats[i].value = e.target.value;
                        setStats(newStats);
                      }}
                      placeholder="Value (e.g. 4+)" 
                      className="w-1/3 bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white focus:border-[#c7d300] outline-none font-bold" 
                    />
                    <input 
                      type="text" 
                      value={stat.label}
                      onChange={(e) => {
                        const newStats = [...stats];
                        newStats[i].label = e.target.value;
                        setStats(newStats);
                      }}
                      placeholder="Label (e.g. Years)" 
                      className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-400 focus:border-[#c7d300] outline-none" 
                    />
                    <button type="button" onClick={() => removeField(setStats, stats, i)} className="text-zinc-800 hover:text-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-[#212121] border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-[#c7d300] text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <LinkIcon className="h-4 w-4" /> Call to Action (CTA)
              </h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] text-zinc-600 font-bold uppercase">Button Text</label>
                  <input name="ctaText" type="text" placeholder="View Projects" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-300 focus:border-[#c7d300] outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-zinc-600 font-bold uppercase">Target Link</label>
                  <input name="ctaLink" type="text" placeholder="/projects" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-300 focus:border-[#c7d300] outline-none" />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </form>
  )
}

export default AddAbout