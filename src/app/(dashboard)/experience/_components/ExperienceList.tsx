/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  LayoutDashboard,
  ChevronRight,
  Plus,
  Edit2,
  Calendar,
  MapPin,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { DeleteModule } from "@/components/DeleteModule";
import { useQuery } from "@tanstack/react-query";

export default function ExperienceList() {
  const { data, isLoading } = useQuery({
    queryKey: ["experiences"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/experience/getallexp`,
      );
      const result = await res.json();
      return result.data.experiences;
    },
  });

  if (isLoading)
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-[#c7d300]" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <nav className="flex items-center space-x-2 text-sm bg-[#212121]/30 w-fit px-4 py-2 rounded-full border border-zinc-800">
          <Link
            href="/"
            className="flex items-center text-zinc-400 hover:text-[#c7d300] transition-colors"
          >
            <LayoutDashboard className="h-4 w-4 mr-2" />
            <span>Dashboard</span>
          </Link>
          <ChevronRight className="h-4 w-4 text-zinc-600" />
          <span className="text-white font-bold uppercase text-[11px] tracking-wider">
            Experience Management
          </span>
        </nav>

        <Link href="/experience/add-experience">
          <button className="flex items-center gap-2 bg-[#c7d300] text-black px-6 py-3 rounded-xl font-bold">
            <Plus className="h-5 w-5" /> Add Experience
          </button>
        </Link>
      </div>

      <div className="rounded-[1.5rem] border border-zinc-800 bg-[#1a1b14] overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-zinc-900/50">
            <tr className="border-zinc-800">
              <th className="px-6 py-5 text-zinc-400 font-bold uppercase text-[10px] tracking-widest">
                Role & Company
              </th>
              <th className="px-6 py-5 text-zinc-400 font-bold uppercase text-[10px] tracking-widest hidden md:table-cell">
                Duration
              </th>
              <th className="px-6 py-5 text-zinc-400 font-bold uppercase text-[10px] tracking-widest">
                Side
              </th>
              <th className="px-6 py-5 text-right text-zinc-400 font-bold uppercase text-[10px] tracking-widest">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {data?.map((exp: any) => (
              <tr
                key={exp._id}
                className="hover:bg-white/[0.02] transition-colors group"
              >
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-sm group-hover:text-[#c7d300] transition-colors">
                      {exp.position}
                    </span>
                    <span className="text-zinc-500 text-[11px] flex items-center gap-1">
                      <MapPin size={10} /> {exp.company}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 hidden md:table-cell">
                  <div className="flex items-center text-zinc-400 gap-2">
                    <Calendar size={14} className="text-zinc-600" />
                    <span className="text-xs">{exp.duration}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <Badge
                    variant="outline"
                    className="border-zinc-800 text-[9px] uppercase font-black text-zinc-500"
                  >
                    {exp.side}
                  </Badge>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/experience/edit-experience/${exp._id}`}>
                      <button className="p-3 bg-zinc-900 text-zinc-500 hover:text-[#c7d300] rounded-xl border border-zinc-800 transition-all">
                        <Edit2 className="h-5 w-5" />
                      </button>
                    </Link>
                    <DeleteModule
                      id={exp._id}
                      endpoint="/experience/deleteexp"
                      queryKey={["experiences"]}
                      itemName={exp.position}
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
