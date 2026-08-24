/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { MessageSquare, Loader2 } from "lucide-react";
import { ViewRecruiterModal } from "./ViewRecruiterModal";
import { DeleteModule } from "@/components/DeleteModule";
import { useQuery } from "@tanstack/react-query";

export function RecruiterListSection() {
  // API থেকে সব ফিডব্যাক ফেচ করা হচ্ছে
  const { data, isLoading } = useQuery({
    queryKey: ["recruiter-feedbacks"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/feedback/getAllfeedback`);
      const result = await res.json();
      return result.data.feedbacks;
    },
  });

  if (isLoading) return (
    <div className="h-96 flex flex-col items-center justify-center bg-[#15160e] border border-zinc-800/50 rounded-2xl">
      <Loader2 className="h-8 w-8 animate-spin text-[#c7d300] mb-4" />
      <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.2em]">Loading Insights...</p>
    </div>
  );

  return (
    <div className="bg-[#15160e] border border-zinc-800/50 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      
      {/* Header */}
      <div className="p-8 border-b border-zinc-800/50 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-zinc-900/50 to-transparent gap-4">
        <div>
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            Recruiter <span className="text-[#c7d300] bg-[#c7d300]/10 px-3 py-1 rounded-lg">Insights</span>
          </h3>
          <p className="text-sm text-zinc-500 mt-2 font-medium tracking-wide">Manage recruiter feedback and track your hiring pipeline</p>
        </div>
        <div className="flex items-center gap-3 bg-zinc-900 px-4 py-2 rounded-xl border border-zinc-800">
           <div className="h-2 w-2 rounded-full bg-[#c7d300] animate-pulse"></div>
           <span className="text-zinc-300 text-xs font-bold uppercase tracking-widest">
            {data?.length || 0} Feedbacks
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-900/40 text-zinc-500 text-[11px] uppercase tracking-[0.2em] border-b border-zinc-800/50">
              <th className="px-8 py-6 font-bold">Recruiter Information</th>
              <th className="px-8 py-6 font-bold">Feedback Scope</th>
              <th className="px-8 py-6 font-bold">Timeline</th>
              <th className="px-8 py-6 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/30">
            {data?.map((item: any) => (
              <tr key={item._id} className="hover:bg-[#c7d300]/[0.02] transition-all duration-500 group">
                <td className="px-8 py-7">
                  <div className="flex items-center gap-5">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-zinc-900 border-2 border-zinc-800 flex items-center justify-center text-[#c7d300] font-black text-xl group-hover:border-[#c7d300]/40 transition-all shadow-lg">
                        {item.name.charAt(0)}
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-[#c7d300] p-1 rounded-md border-2 border-[#15160e]">
                        <MessageSquare className="w-2.5 h-2.5 text-black" />
                      </div>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-white group-hover:text-[#c7d300] transition-colors">{item.name}</p>
                      <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mt-0.5 truncate max-w-[200px]">{item.role}</p>
                    </div>
                  </div>
                </td>

                <td className="px-8 py-7">
                  <StatusBadge status={item.status} />
                </td>

                <td className="px-8 py-7">
                  <div className="flex flex-col">
                    <span className="text-sm text-zinc-300 font-semibold">
                      {new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <span className="text-[10px] text-zinc-600 uppercase font-bold mt-1 tracking-tighter">Received Date</span>
                  </div>
                </td>

                <td className="px-8 py-7 text-right">
                  <div className="flex justify-end gap-2">
                    {/* পাস করছি নির্দিষ্ট আইডি যাতে মডাল সেই ডাটা ফেচ করতে পারে */}
                    <ViewRecruiterModal feedbackId={item._id} />
                    <DeleteModule 
                      id={item._id} 
                      endpoint="/feedback/deletefeedback" 
                      queryKey={["recruiter-feedbacks"]} 
                      itemName={item.name} 
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    shortlisted: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    suggestion: "bg-[#c7d300]/10 text-[#c7d300] border-[#c7d300]/20",
    "not-fit": "bg-rose-500/10 text-rose-500 border-rose-500/20",
    "more-projects": "bg-amber-500/10 text-amber-500 border-amber-500/20",
  };

  return (
    <div className={`inline-flex items-center px-4 py-1.5 rounded-full border shadow-sm ${styles[status] || "bg-zinc-800 text-zinc-400 border-zinc-700"}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current mr-2.5"></span>
      <span className="text-[10px] uppercase font-black tracking-wider">
        {status.replace("-", " ")}
      </span>
    </div>
  );
}