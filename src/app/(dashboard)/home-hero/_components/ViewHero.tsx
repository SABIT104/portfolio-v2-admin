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
import { Eye, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";

interface HeroData {
  _id: string;
  backgroundImage: string;
  overlayOpacity: number;
  typingAnimationLines: string[];
  titleLine1: string;
  titleLine2: string;
  description: string;
  isActive: boolean;
}

interface ApiResponse {
  status: boolean;
  data: HeroData;
}

export function ViewHero({ id }: { id: string }) {
  const { data: heroResponse, isLoading } = useQuery<ApiResponse>({
    queryKey: ["singleHero", id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/home/getSingleHomeContent/${id}`
      );
      if (!res.ok) throw new Error("Failed to fetch details");
      return res.json();
    },
    enabled: !!id, // Sudhu id thaklei query cholbe
  });

  const hero = heroResponse?.data;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="p-3 bg-zinc-900 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-xl border border-zinc-800 transition-all">
          <Eye className="h-5 w-5" />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] bg-[#1a1a1a] text-white border-zinc-800 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#c7d300]">
            Hero Section Details
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Preview of your current hero section configuration.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-[#c7d300]" />
          </div>
        ) : hero ? (
          <div className="space-y-6 py-4">
            {/* Hero Image Preview */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                Background Preview
              </span>
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900">
                <Image
                  fill
                  src={hero.backgroundImage || "https://placehold.co/600x400/212121/white?text=No+Image"}
                  alt="Hero Preview"
                  className="object-cover"
                />
                <div 
                  className="absolute inset-0 bg-black" 
                  style={{ opacity: hero.overlayOpacity / 100 }}
                />
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  Typing Animation
                </span>
                <div className="flex flex-wrap gap-2">
                  {hero.typingAnimationLines.map((line, index) => (
                    <span key={index} className="text-xs bg-zinc-900 p-2 rounded border border-zinc-800 text-[#c7d300]">
                      {line}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                    Title Line 1
                  </span>
                  <p className="text-sm text-zinc-200">{hero.titleLine1}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                    Title Line 2
                  </span>
                  <p className="text-sm text-zinc-200">{hero.titleLine2}</p>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  Description
                </span>
                <p className="text-sm text-zinc-400 bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
                  {hero.description}
                </p>
              </div>

              <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                <span className="text-sm font-medium">Status</span>
                {hero.isActive ? (
                  <div className="flex items-center gap-1.5 text-emerald-500 text-sm font-bold">
                    <CheckCircle2 className="h-4 w-4" /> Active
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-red-500 text-sm font-bold">
                    <XCircle className="h-4 w-4" /> Inactive
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-zinc-500">Data not found.</div>
        )}
      </DialogContent>
    </Dialog>
  );
}