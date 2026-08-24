/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { LayoutDashboard, ChevronRight, Plus, ExternalLink, Edit2, Calendar, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteModule } from "@/components/DeleteModule";
import { useQuery } from "@tanstack/react-query";

export default function ProjectsList() {
  const { data, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/project/getallproject`);
      const result = await res.json();
      return result.data.projects;
    },
  });

  if (isLoading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-[#c7d300]" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <nav className="flex items-center space-x-2 text-sm bg-[#212121]/30 w-fit px-4 py-2 rounded-full border border-zinc-800">
          <Link href="/" className="flex items-center text-zinc-400 hover:text-[#c7d300]">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            <span>Dashboard</span>
          </Link>
          <ChevronRight className="h-4 w-4 text-zinc-600" />
          <span className="text-white font-bold uppercase text-[11px]">Project Management</span>
        </nav>
        <Link href="/projects/add-project">
          <button className="flex items-center gap-2 bg-[#c7d300] text-black px-6 py-3 rounded-xl font-bold">
            <Plus className="h-5 w-5" /> Add New Project
          </button>
        </Link>
      </div>

      <div className="rounded-[1.5rem] border border-zinc-800 bg-[#1a1b14] overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-zinc-900/50">
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="w-[280px] text-zinc-400 font-bold uppercase text-[10px] py-5 px-6">Project Info</TableHead>
              <TableHead className="text-zinc-400 font-bold uppercase text-[10px]">Stack</TableHead>
              <TableHead className="text-zinc-400 font-bold uppercase text-[10px]">Launch Date</TableHead>
              <TableHead className="text-zinc-400 font-bold uppercase text-[10px]">Status</TableHead>
              <TableHead className="text-right text-zinc-400 font-bold uppercase text-[10px] px-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((project: any) => (
              <TableRow key={project._id} className="border-zinc-800 hover:bg-white/[0.02]">
                <TableCell className="py-5 px-6">
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-16 rounded-lg overflow-hidden border border-zinc-800 shrink-0">
                      <Image src={project.images[0]?.url || ""} alt={project.title} fill className="object-cover" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white font-bold text-sm">{project.title}</span>
                      <span className="text-[#c7d300]/60 text-[9px] font-black uppercase">{project.category}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-[150px]">
                    {project.tags.map((s: string, idx: number) => (
                      <span key={idx} className="text-[9px] text-zinc-500 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">{s}</span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-zinc-400 gap-2 text-xs">
                    <Calendar size={14} /> {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={`h-1.5 w-1.5 rounded-full ${project.isActive ? "bg-[#c7d300]" : "bg-zinc-600"}`} />
                    <span className="text-zinc-300 text-[10px] uppercase">{project.isActive ? "Published" : "Draft"}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4 pr-8 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <a href={project.links[0]?.url} target="_blank" className="p-2.5 bg-zinc-900/50 text-zinc-500 hover:text-[#c7d300] rounded-xl border border-zinc-800 transition-all"><ExternalLink size={16} /></a>
                    <Link href={`/projects/edit-project/${project._id}`}><button className="p-2.5 bg-zinc-900/50 text-zinc-500 hover:text-[#c7d300] rounded-xl border border-zinc-800 transition-all"><Edit2 size={16} /></button></Link>
                    <DeleteModule id={project._id} endpoint="/project/deleteProject" queryKey={["projects"]} itemName={project.title} />
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