"use client";

import React, { useState } from "react";
import { ChevronRight, Save, Palette, ImageIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AddSkill() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [skillColor, setSkillColor] = useState("#c7d300");
  const [proficiency, setProficiency] = useState(80);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/skill/createSkill`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to add skill");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast.success("Skill added successfully");
      router.push("/skill");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("color", skillColor);
    formData.set("proficiency", proficiency.toString());
    if (imageFile) formData.append("skillImage", imageFile);
    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <nav className="flex items-center space-x-2 text-sm bg-[#212121]/30 px-5 py-2.5 rounded-full border border-zinc-800">
          <Link href="/dashboard" className="text-zinc-400 hover:text-[#c7d300]">Dashboard</Link>
          <ChevronRight className="h-4 w-4 text-zinc-600" />
          <span className="text-white font-semibold">Add New Skill</span>
        </nav>
        <button disabled={mutation.isPending} className="flex items-center gap-2 bg-[#c7d300] text-black px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50">
          {mutation.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />}
          Save Skill
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <section className="bg-[#212121] border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-[#c7d300] text-xs font-bold uppercase mb-6 flex items-center gap-2">
              <ImageIcon className="h-4 w-4" /> Skill Image
            </h3>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#c7d300] file:text-black"
              required
            />
          </section>

          <section className="bg-[#212121] border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-[#c7d300] text-xs font-bold uppercase mb-6 flex items-center gap-2">
              <Palette className="h-4 w-4" /> Theme Color
            </h3>
            <div className="flex items-center gap-4">
              <input type="color" value={skillColor} onChange={(e) => setSkillColor(e.target.value)} className="h-12 w-12 cursor-pointer bg-transparent border border-zinc-800 rounded-lg" />
              <input type="text" value={skillColor} readOnly className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-white" />
            </div>
          </section>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <section className="bg-[#212121] border border-zinc-800 rounded-2xl p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Skill Name</label>
                <input name="name" type="text" required placeholder="e.g. Next.js" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-sm text-white focus:border-[#c7d300] outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Proficiency ({proficiency}%)</label>
                <input type="range" min="0" max="100" value={proficiency} onChange={(e) => setProficiency(parseInt(e.target.value))} className="w-full accent-[#c7d300] h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Description</label>
              <textarea name="description" required placeholder="Describe the skill..." className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-sm text-white focus:border-[#c7d300] outline-none min-h-[100px]" />
            </div>
          </section>
        </div>
      </div>
    </form>
  );
}