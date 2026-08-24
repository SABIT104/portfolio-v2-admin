"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  ChevronRight,
  Save,
  FileText,
  Zap,
  Tag,
  Info,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AddResume() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    version: "v1.0.0",
  });

  const mutation = useMutation({
    mutationFn: async (fd: FormData) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/resume/createResume`, {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error("Failed to upload resume");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      toast.success("Resume uploaded successfully!");
      router.push("/resume");
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) return toast.error("Please select a PDF file");

    const fd = new FormData();
    fd.append("title", formData.title);
    fd.append("version", formData.version);
    fd.append("isActive", "false"); // ডিফল্টভাবে ইনএকটিভ
    fd.append("resumeFile", resumeFile);

    mutation.mutate(fd);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <nav className="flex items-center space-x-2 text-sm bg-[#212121]/30 w-fit px-5 py-2.5 rounded-full border border-zinc-800">
          <Link href="/dashboard" className="flex items-center text-zinc-400 hover:text-[#c7d300]">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <ChevronRight className="h-4 w-4 text-zinc-600" />
          <Link href="/dashboard/resume" className="text-zinc-400 hover:text-[#c7d300]">Resumes</Link>
          <ChevronRight className="h-4 w-4 text-zinc-600" />
          <span className="text-white font-semibold text-[12px] uppercase">Upload Version</span>
        </nav>

        <button 
          disabled={mutation.isPending}
          className="flex items-center gap-2 bg-[#c7d300] text-black px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50"
        >
          {mutation.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />}
          Save to Vault
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <section className="bg-[#212121] border border-zinc-800 rounded-2xl p-8 relative overflow-hidden group">
            <h3 className="text-[#c7d300] text-xs font-bold uppercase tracking-widest mb-8 flex items-center gap-2">
              <FileText className="h-4 w-4" /> Live Preview
            </h3>
            <div className="space-y-6">
              <div className="h-16 w-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-[#c7d300]">
                <FileText size={32} />
              </div>
              <div>
                <h2 className="text-white text-2xl font-black tracking-tighter uppercase break-words leading-none">
                  {formData.title || "Untitled Version"}
                </h2>
                <div className="mt-3 inline-block px-3 py-1 bg-[#c7d300]/10 border border-[#c7d300]/20 rounded-lg">
                   <span className="text-[#c7d300] font-mono text-xs font-bold">{formData.version}</span>
                </div>
              </div>
            </div>
          </section>

          <div className="bg-[#c7d300]/5 border border-[#c7d300]/10 rounded-2xl p-6 flex gap-4">
              <Info className="text-[#c7d300] h-5 w-5 flex-shrink-0" />
              <p className="text-xs text-zinc-500 leading-relaxed">
                Upload your PDF file. Cloudinary will handle the hosting automatically.
              </p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <section className="bg-[#212121] border border-zinc-800 rounded-2xl p-8 space-y-8">
            <h3 className="text-[#c7d300] text-xs font-bold uppercase tracking-widest flex items-center gap-2 border-b border-zinc-800 pb-5">
              <Zap className="h-4 w-4" /> Version Configuration
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                  <Tag className="h-3.5 w-3.5" /> Resume Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. MERN Stack Specialist"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm text-white focus:border-[#c7d300] outline-none transition-all"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5" /> Version Number
                </label>
                <input
                  type="text"
                  required
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  placeholder="v2.4.0_stable"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm font-mono text-white focus:border-[#c7d300] outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                <FileText className="h-3.5 w-3.5" /> Select Resume PDF
              </label>
              <input
                type="file"
                accept=".pdf"
                required
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:bg-[#c7d300] file:text-black cursor-pointer"
              />
            </div>
            
            <button type="reset" onClick={() => {setFormData({title: "", version: "v1.0.0"}); setResumeFile(null)}} className="w-full bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 py-4 rounded-xl border border-dashed border-zinc-700 transition-all text-[10px] font-black uppercase tracking-[0.3em]">
               Discard & Reset Form
            </button>
          </section>
        </div>
      </div>
    </form>
  );
}