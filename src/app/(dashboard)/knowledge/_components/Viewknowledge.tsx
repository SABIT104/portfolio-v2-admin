"use client";

import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Tag, Code2, Loader2 } from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";

export function ViewKnowledge({ knowledgeId }: { knowledgeId: string }) {
  const { data: post, isLoading } = useQuery({
    queryKey: ["knowledge", knowledgeId],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/knowledge/single-knowledge/${knowledgeId}`);
      const result = await res.json();
      return result.data;
    },
    enabled: !!knowledgeId,
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="p-3 bg-zinc-900 text-zinc-500 hover:text-[#c7d300] rounded-xl border border-zinc-800">
          <Eye className="h-5 w-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] bg-[#0f100a] text-white border-zinc-800 p-0 overflow-hidden shadow-2xl">
        <div className="h-1.5 w-full bg-[#c7d300]" />
        {isLoading ? (
          <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-[#c7d300]" /></div>
        ) : (
          <div className="p-8 space-y-8 max-h-[85vh] overflow-y-auto">
            <div className="space-y-4">
              <span className="bg-[#c7d300] text-black text-[9px] font-black px-3 py-1 rounded uppercase">{post?.category}</span>
              <DialogTitle className="text-3xl font-black text-white">{post?.title}</DialogTitle>
            </div>
            {post?.images?.[0] && (
              <div className="relative aspect-video rounded-3xl overflow-hidden border border-zinc-800">
                <Image fill src={post.images[0].url} alt="" className="object-cover" />
              </div>
            )}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2"><Tag size={12} className="text-[#c7d300]" /> Overview</h4>
              <p className="text-zinc-400 text-sm italic border-l-2 border-[#c7d300] pl-4">{post?.shortDescription}</p>
              <div className="text-zinc-300 text-sm whitespace-pre-wrap">{post?.fullContent}</div>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2"><Code2 size={12} className="text-[#c7d300]" /> Logic Snippet</h4>
              <pre className="bg-black p-6 rounded-2xl border border-zinc-800 text-[#c7d300] font-mono text-xs overflow-x-auto">
                <code>{post?.logicSnippet}</code>
              </pre>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}