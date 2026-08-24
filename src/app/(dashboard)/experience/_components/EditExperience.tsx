/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ChevronRight, Save, Plus, Trash2, Briefcase, Layout, Loader2 } from "lucide-react";
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from 'sonner';

export default function EditExperience() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [achievements, setAchievements] = useState<string[]>([]);

  const { data: expData, isLoading } = useQuery({
    queryKey: ["experience", id],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/experience/getsingleexp/${id}`);
      const result = await res.json();
      return result.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (expData?.achievements) setAchievements(expData.achievements);
  }, [expData]);

  const mutation = useMutation({
    mutationFn: async (updatedData: any) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/experience/updateExpe/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
      toast.success("Journey Updated!");
      router.push("/experience");
    },
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const form = e.target;
    mutation.mutate({
      position: form.position.value,
      company: form.company.value,
      location: form.location.value,
      duration: form.duration.value,
      description: form.description.value,
      side: form.side.value,
      achievements: achievements,
      isActive: expData?.isActive
    });
  };

  if (isLoading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-[#c7d300]" /></div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <nav className="flex items-center space-x-2 text-sm bg-[#212121]/30 w-fit px-5 py-2.5 rounded-full border border-zinc-800">
          <Link href="/dashboard" className="text-zinc-400 hover:text-[#c7d300] flex items-center"><LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard</Link>
          <ChevronRight className="h-4 w-4 text-zinc-600" />
          <span className="text-white font-semibold text-[12px] uppercase tracking-wide">Edit Experience</span>
        </nav>
        <button disabled={mutation.isPending} className="flex items-center gap-2 bg-[#c7d300] text-black px-8 py-3 rounded-xl font-bold">
          {mutation.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />} Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <section className="bg-[#212121] border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-[#c7d300] text-xs font-bold uppercase mb-6 flex items-center gap-2"><Layout className="h-4 w-4" /> Layout Config</h3>
            <div className="space-y-4">
              <label className="text-[10px] text-zinc-500 font-bold uppercase">Side</label>
              <select name="side" defaultValue={expData?.side} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-sm text-white">
                <option value="left">Left Side</option>
                <option value="right">Right Side</option>
              </select>
              <label className="text-[10px] text-zinc-500 font-bold uppercase mt-4 block">Duration</label>
              <input name="duration" defaultValue={expData?.duration} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-sm text-white outline-none" />
            </div>
          </section>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <section className="bg-[#212121] border border-zinc-800 rounded-2xl p-8 space-y-6 shadow-xl">
            <h3 className="text-[#c7d300] text-xs font-bold uppercase flex items-center gap-2 border-b border-zinc-800 pb-4"><Briefcase className="h-4 w-4" /> Professional Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input name="position" defaultValue={expData?.position} placeholder="Position" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-sm text-white" />
              <input name="company" defaultValue={expData?.company} placeholder="Company" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-sm text-white" />
            </div>
            <input name="location" defaultValue={expData?.location} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-sm text-white" />
            <textarea name="description" defaultValue={expData?.description} rows={3} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-400" />
            
            <div className="space-y-4">
              <label className="text-[10px] text-zinc-500 font-bold uppercase flex justify-between">Achievements <Plus onClick={() => setAchievements([...achievements, ""])} className="h-3 w-3 cursor-pointer"/></label>
              {achievements.map((ach, i) => (
                <div key={i} className="flex gap-3">
                  <input value={ach} onChange={(e) => {const a = [...achievements]; a[i] = e.target.value; setAchievements(a)}} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-300" />
                  <button type="button" onClick={() => setAchievements(achievements.filter((_, idx) => idx !== i))}><Trash2 className="h-4 w-4 text-red-500" /></button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </form>
  );
}