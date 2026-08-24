"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, Briefcase, MessageCircle, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export function ViewRecruiterModal({ feedbackId }: { feedbackId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["feedback", feedbackId],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/feedback/getsinglefeedback/${feedbackId}`);
      const result = await res.json();
      return result.data;
    },
    enabled: !!feedbackId, // যখন আইডি থাকবে তখনই রান হবে
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="p-3 bg-zinc-900 text-zinc-500 hover:text-[#c7d300] hover:bg-[#c7d300]/10 rounded-xl border border-zinc-800 transition-all">
          <Eye className="h-5 w-5" />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] bg-[#15160e] text-white border-zinc-800 overflow-hidden shadow-2xl">
        {/* Top Highlight line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-[#c7d300]" />

        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="animate-spin text-[#c7d300]" />
          </div>
        ) : (
          <>
            <DialogHeader className="pt-4">
              <DialogTitle className="text-xl font-black flex items-center gap-3 tracking-tighter uppercase italic">
                Feedback <span className="text-[#c7d300]">Profile</span>
              </DialogTitle>
              <DialogDescription className="text-zinc-500 font-medium italic">
                Full insight from the recruiter review.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 py-4">
              {/* Recruiter Identity */}
              <div className="flex items-center gap-4 p-5 bg-zinc-900/60 rounded-2xl border border-zinc-800">
                <div className="w-16 h-16 rounded-xl bg-[#c7d300] text-black flex items-center justify-center text-2xl font-black">
                  {data?.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{data?.name}</h3>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest flex items-center gap-2 mt-1">
                    <Briefcase className="h-3 w-3 text-[#c7d300]" /> {data?.role}
                  </p>
                </div>
              </div>

              {/* Feedback Message */}
              <div className="p-5 bg-zinc-900/40 rounded-2xl border border-zinc-800 space-y-3">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <MessageCircle className="h-3.5 w-3.5 text-[#c7d300]" /> Direct Feedback
                </span>
                <p className="text-sm text-zinc-300 leading-relaxed italic">
                  {data?.message}
                </p>
              </div>

              {/* Status and Date Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-900/60 rounded-xl border border-zinc-800">
                  <span className="text-[9px] text-zinc-600 font-bold uppercase block mb-1">Status</span>
                  <span className="text-xs font-bold text-[#c7d300] uppercase tracking-tighter">
                    {data?.status.replace("-", " ")}
                  </span>
                </div>
                <div className="p-4 bg-zinc-900/60 rounded-xl border border-zinc-800">
                  <span className="text-[9px] text-zinc-600 font-bold uppercase block mb-1">Date Received</span>
                  <span className="text-xs font-bold text-zinc-300">
                    {new Date(data?.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-center border-t border-zinc-800/50 pt-4 pb-1">
              <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.3em]">
                Recruiter Insight Portal
              </span>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}