/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { LayoutDashboard, ChevronRight, Plus, Edit2, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { DeleteModule } from "@/components/DeleteModule";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ViewKnowledge } from "./Viewknowledge";
import { useQuery } from "@tanstack/react-query";

export default function KnowledgeList() {
  const { data: knowledgeData, isLoading } = useQuery({
    queryKey: ["knowledge-list"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/knowledge/all-knowledge`);
      const result = await res.json();
      return result.data;
    },
  });

  if (isLoading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-[#c7d300]" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <nav className="flex items-center space-x-2 text-sm bg-[#212121]/30 w-fit px-4 py-2 rounded-full border border-zinc-800">
          <Link href="/dashboard" className="flex items-center text-zinc-400 hover:text-[#c7d300]">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            <span>Dashboard</span>
          </Link>
          <ChevronRight className="h-4 w-4 text-zinc-600" />
          <span className="text-white font-bold uppercase text-[11px]">Knowledge Hub</span>
        </nav>
        <Link href="/knowledge/add-knowledge">
          <button className="flex items-center gap-2 bg-[#c7d300] text-black px-6 py-3 rounded-xl font-bold">
            <Plus className="h-5 w-5" /> Create Insight
          </button>
        </Link>
      </div>

      <div className="rounded-[2rem] border border-zinc-800 bg-[#1a1b14] overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-900/50">
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="px-6 py-5 text-zinc-400 font-bold uppercase text-[10px]">Insight Title</TableHead>
              <TableHead className="px-6 py-5 text-zinc-400 font-bold uppercase text-[10px]">Category</TableHead>
              <TableHead className="px-6 py-5 text-zinc-400 font-bold uppercase text-[10px]">Date</TableHead>
              <TableHead className="px-6 py-5 text-right text-zinc-400 font-bold uppercase text-[10px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {knowledgeData?.data?.map((item: any) => (
              <TableRow key={item._id} className="border-zinc-800/50 hover:bg-white/[0.02] group">
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-20 rounded-lg overflow-hidden border border-zinc-800">
                      <Image src={item.images?.[0]?.url || "/placeholder.png"} alt="" fill className="object-cover" />
                    </div>
                    <span className="text-white font-bold text-sm group-hover:text-[#c7d300]">{item.title}</span>
                  </div>
                </TableCell>
                <TableCell><Badge className="bg-[#c7d300]/10 text-[#c7d300] border-none text-[9px] font-black">{item.category}</Badge></TableCell>
                <TableCell className="text-zinc-500 text-xs">{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="px-6 py-3">
                  <div className="flex justify-end gap-2">
                    <ViewKnowledge knowledgeId={item._id} />
                    <Link href={`/knowledge/edit-knowledge/${item._id}`}>
                      <button className="p-3 bg-zinc-900 text-zinc-500 hover:text-[#c7d300] rounded-xl border border-zinc-800"><Edit2 className="h-5 w-5" /></button>
                    </Link>
                    <DeleteModule id={item._id} endpoint="/knowledge/delete-knowledge" queryKey={["knowledge-list"]} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}