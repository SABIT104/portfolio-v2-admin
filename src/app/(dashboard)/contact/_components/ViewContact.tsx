"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Eye,
  Mail,
  User,
  Briefcase,
  MessageSquare,
  Calendar,
  Phone,
  Loader2
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export function ViewContact({ messageId }: { messageId: string }) {
  // সিঙ্গেল মেসেজ ডাটা ফেচ করা হচ্ছে
  const { data, isLoading } = useQuery({
    queryKey: ["contact-message", messageId],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/contact/get-message/${messageId}`);
      const result = await res.json();
      return result.data;
    },
    enabled: !!messageId, // যখন আইডি থাকবে তখনই কল হবে
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="p-3 bg-zinc-900 text-zinc-500 hover:text-[#c7d300] hover:bg-[#c7d300]/10 rounded-xl border border-zinc-800 transition-all">
          <Eye className="h-5 w-5" />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[550px] bg-[#0f100a] text-white border-zinc-800 p-0 overflow-hidden shadow-2xl">
        <div className="h-1.5 w-full bg-[#c7d300] shadow-[0_0_15px_rgba(199,211,0,0.5)]" />

        {isLoading ? (
          <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-[#c7d300]" /></div>
        ) : (
          <div className="p-6 md:p-8 space-y-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-white flex items-center gap-2 tracking-tighter uppercase">
                <Mail className="h-5 w-5 text-[#c7d300]" /> Message{" "}
                <span className="text-[#c7d300]">Detail</span>
              </DialogTitle>
              <DialogDescription className="text-zinc-500 flex items-center gap-2 pt-1 font-medium">
                <Calendar className="h-3.5 w-3.5" /> Received: {new Date(data?.createdAt).toLocaleString()}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-5 py-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[#c7d300] text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                    <User className="h-3 w-3" /> Full Name
                  </Label>
                  <p className="font-bold text-sm text-zinc-200 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
                    {data?.firstName} {data?.lastName}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[#c7d300] text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Phone className="h-3 w-3" /> Phone Number
                  </Label>
                  <p className="font-bold text-sm text-zinc-200 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
                    {data?.phoneNumber || "N/A"}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[#c7d300] text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Briefcase className="h-3 w-3" /> Interested Services
                </Label>
                <div className="flex gap-2 flex-wrap bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
                  {data?.services?.map((s: string, i: number) => (
                    <span key={i} className="text-[10px] font-bold text-white bg-zinc-800 px-2 py-1 rounded">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[#c7d300] text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Mail className="h-3 w-3" /> Reply To
                </Label>
                <p className="font-medium text-sm text-zinc-300 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800 select-all underline decoration-zinc-700 underline-offset-4">
                  {data?.email}
                </p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[#c7d300] text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                  <MessageSquare className="h-3 w-3" /> Message Body
                </Label>
                <div className="text-sm leading-relaxed text-zinc-400 bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 italic">
                  {data?.message}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-zinc-900/30 rounded-xl border border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status:</span>
                  <span className={`h-2 w-2 rounded-full ${data?.status === "Pending" ? "bg-yellow-500 animate-pulse" : "bg-green-500"}`} />
                  <span className="text-[10px] font-black uppercase text-zinc-400">{data?.status}</span>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-zinc-800/50">
              <DialogClose asChild>
                <button className="px-6 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-[10px] font-bold uppercase rounded-xl border border-zinc-800 transition-all">
                  Close Detail
                </button>
              </DialogClose>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}