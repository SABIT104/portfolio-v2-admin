"use client";

import React from "react";
import {
  LayoutDashboard,
  ChevronRight,
  Plus,
  FileText,
  ExternalLink,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteModule } from "@/components/DeleteModule";
import { toast } from "sonner";

interface Resume {
  _id: string;
  title: string;
  version: string;
  resumeUrl: string;
  isActive: boolean;
  createdAt: string;
}

export default function ResumeList() {
  const queryClient = useQueryClient();

  // ১. সব রেজুমে ফেচ করা
  const { data, isLoading } = useQuery({
    queryKey: ["resumes"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/resume/getallResume`);
      const result = await res.json();
      return result.data.resumes as Resume[];
    },
  });

  // ২. স্ট্যাটাস আপডেট মিউটেশন (Toggle Active)
  const statusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/resume/updateToggle/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      toast.success("Resume status updated!");
    },
    onError: (err) => toast.error(err.message),
  });

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#c7d300]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <nav className="flex items-center space-x-2 text-sm bg-[#212121]/30 w-fit px-5 py-2.5 rounded-full border border-zinc-800">
          <Link href="/" className="flex items-center text-zinc-400 hover:text-[#c7d300] transition-colors">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <ChevronRight className="h-4 w-4 text-zinc-600" />
          <span className="text-white font-semibold tracking-wide uppercase text-[12px]">Resume Management</span>
        </nav>

        <Link href="/resume/add-resume">
          <button className="flex items-center gap-2 bg-[#c7d300] text-black px-6 py-3 rounded-xl font-bold text-base hover:shadow-[0_0_20px_rgba(199,211,0,0.2)] transition-all">
            <Plus className="h-5 w-5" /> Upload New Resume
          </button>
        </Link>
      </div>

      <div className="bg-[#c7d300]/5 border border-[#c7d300]/20 rounded-2xl p-4 flex items-start gap-4">
        <AlertCircle className="text-[#c7d300] h-5 w-5 mt-0.5" />
        <p className="text-xs text-zinc-400 leading-relaxed">
          You can store multiple resume versions. Only the one marked as <span className="text-[#c7d300] font-bold">Active</span> will be live.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((resume) => (
          <div 
            key={resume._id}
            className={`relative group bg-[#1a1b14] border-2 rounded-2xl p-6 transition-all duration-300 ${
              resume.isActive ? "border-[#c7d300] shadow-[0_0_30px_rgba(199,211,0,0.05)]" : "border-zinc-800 hover:border-zinc-700"
            }`}
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                resume.isActive ? "bg-[#c7d300] text-black" : "bg-zinc-800 text-zinc-500"
              }`}>
                {resume.isActive ? <><CheckCircle2 size={12} /> Active Live</> : "Inactive"}
              </div>
            </div>

            <div className="space-y-4">
              <div className="h-12 w-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#c7d300]">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg line-clamp-1">{resume.title}</h3>
                <p className="text-zinc-500 text-xs font-mono mt-1">{resume.version}</p>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <div className="flex items-center gap-2 text-zinc-500 text-[11px]">
                  <Calendar size={12} />
                  Uploaded on {new Date(resume.createdAt).toLocaleDateString()}
                </div>
                <a href={resume.resumeUrl} target="_blank" className="flex items-center gap-2 text-[#c7d300] text-[11px] font-bold hover:underline">
                  <ExternalLink size={12} /> View File
                </a>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-800/50 flex items-center justify-between">
              {!resume.isActive && (
                <button 
                  disabled={statusMutation.isPending}
                  onClick={() => statusMutation.mutate({ id: resume._id, isActive: true })}
                  className="text-xs font-black uppercase tracking-tighter text-zinc-400 hover:text-[#c7d300] transition-colors disabled:opacity-50"
                >
                  {statusMutation.isPending ? "Setting..." : "Set as Active"}
                </button>
              )}
              <div className="ml-auto">
                <DeleteModule id={resume._id} endpoint="/resume/deleteResume" queryKey={["resumes"]} itemName={resume.title} />
              </div>
            </div>
          </div>
        ))}

        <Link href="/resume/add-resume" className="group">
          <div className="h-full min-h-[280px] border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-[#c7d300]/50 transition-all cursor-pointer">
            <div className="p-4 bg-zinc-900 rounded-full text-zinc-600 group-hover:text-[#c7d300] transition-colors">
              <Plus size={32} />
            </div>
            <span className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest group-hover:text-zinc-300">Add New Version</span>
          </div>
        </Link>
      </div>
    </div>
  );
}