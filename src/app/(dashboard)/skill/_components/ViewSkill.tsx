"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye,Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

export function ViewSkill({ id }: { id: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["skill", id],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/skill/getsingleSkill/${id}`);
      const result = await res.json();
      return result.data;
    },
    enabled: !!id,
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="p-3 bg-zinc-900 text-zinc-500 hover:text-[#c7d300] hover:bg-[#c7d300]/10 rounded-xl border border-zinc-800 transition-all">
          <Eye className="h-5 w-5" />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[550px] bg-[#15160e] text-white border-zinc-800 shadow-2xl">
        {isLoading ? (
          <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-[#c7d300]" /></div>
        ) : (
          <>
            <div className="absolute top-0 left-0 w-full h-1.5" style={{ backgroundColor: data?.color }} />
            <DialogHeader className="pt-4 pb-2">
              <DialogTitle className="text-2xl font-black italic uppercase">
                SKILL <span className="text-[#c7d300]">DETAILS</span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="flex flex-col items-center justify-center p-8 bg-zinc-900/40 rounded-3xl border border-zinc-800/50 relative">
                <div className="relative w-24 h-24 mb-4">
                  <Image src={data?.image} alt={data?.name} fill className="object-contain" />
                </div>
                <h3 className="text-3xl font-bold">{data?.name}</h3>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-zinc-900/60 rounded-2xl border border-zinc-800">
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase">Proficiency</span>
                    <span style={{ color: data?.color }}>{data?.proficiency}%</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-800 rounded-full">
                    <div className="h-full rounded-full" style={{ width: `${data?.proficiency}%`, backgroundColor: data?.color }} />
                  </div>
                </div>
                <div className="p-4 bg-zinc-900/60 rounded-2xl border border-zinc-800">
                   <span className="text-[10px] font-bold text-zinc-500 uppercase">Description</span>
                   <p className="text-sm text-zinc-400 mt-1">{data?.description}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}