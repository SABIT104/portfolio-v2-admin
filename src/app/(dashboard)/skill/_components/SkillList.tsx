"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LayoutDashboard, ChevronRight, Plus, Zap, Edit2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { DeleteModule } from "@/components/DeleteModule";
import { ViewSkill } from "./ViewSkill";
import Image from "next/image";

interface Skill {
  _id: string;
  name: string;
  image: string;
  color: string;
  proficiency: number;
  description: string;
}

export default function SkillList() {
  const { data, isLoading } = useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/skill/getallSkill`);
      const result = await res.json();
      return result.data.skills as Skill[];
    },
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
          <Link href="/dashboard" className="flex items-center text-zinc-400 hover:text-[#c7d300] transition-colors">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <ChevronRight className="h-4 w-4 text-zinc-600" />
          <div className="flex items-center">
            <span className="text-white font-semibold tracking-wide">Skills Inventory</span>
            <span className="ml-2 h-1.5 w-1.5 rounded-full bg-[#c7d300] animate-pulse"></span>
          </div>
        </nav>

        <Link href="/skill/add-skill">
          <button className="flex items-center gap-2 bg-[#c7d300] text-black px-6 py-3 rounded-xl font-bold text-base hover:bg-[#b0ba00] transition-all">
            <Plus className="h-5 w-5" /> Add New Skill
          </button>
        </Link>
      </div>

      <Card className="bg-[#212121] border-zinc-800/60 shadow-2xl overflow-hidden border-t-2 border-t-[#c7d300]/20">
        <CardHeader className="bg-zinc-800/20 py-7 px-8 border-b border-zinc-800/50">
          <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
            <Zap className="text-[#c7d300] h-6 w-6" /> Technology Stack
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-zinc-900/60">
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="text-zinc-400 py-6 pl-8 font-bold uppercase text-[10px] tracking-widest">Icon</TableHead>
                <TableHead className="text-zinc-400 py-6 font-bold uppercase text-[10px] tracking-widest">Skill Name</TableHead>
                <TableHead className="text-zinc-400 py-6 font-bold uppercase text-[10px] tracking-widest">Proficiency</TableHead>
                <TableHead className="text-zinc-400 py-6 font-bold uppercase text-[10px] tracking-widest">Theme Color</TableHead>
                <TableHead className="text-zinc-400 py-6 pr-8 text-right font-bold uppercase text-[10px] tracking-widest">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((skill) => (
                <TableRow key={skill._id} className="border-zinc-800/40 hover:bg-[#c7d300]/5 transition-all group">
                  <TableCell className="py-6 pl-8">
                    <div className="w-10 h-10 relative bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
                      <Image src={skill.image} alt={skill.name} fill className="object-contain p-1" />
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    <div className="font-bold text-zinc-100 text-base group-hover:text-[#c7d300] transition-colors">{skill.name}</div>
                    <div className="text-[10px] text-zinc-500 mt-1 line-clamp-1 max-w-[200px]">{skill.description}</div>
                  </TableCell>
                  <TableCell className="py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${skill.proficiency}%`, backgroundColor: skill.color }} />
                      </div>
                      <span className="text-xs font-mono text-zinc-400">{skill.proficiency}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: skill.color }} />
                      <span className="text-xs font-mono text-zinc-500 uppercase">{skill.color}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-6 pr-8 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <ViewSkill id={skill._id} />
                      <Link href={`/skill/edit-skill/${skill._id}`}>
                        <button className="p-3 bg-zinc-900 text-zinc-500 hover:text-[#c7d300] hover:bg-[#c7d300]/10 rounded-xl border border-zinc-800 transition-all">
                          <Edit2 className="h-5 w-5" />
                        </button>
                      </Link>
                      <DeleteModule id={skill._id} endpoint="/skill/deleteSkill" queryKey={["skills"]} itemName={skill.name} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}