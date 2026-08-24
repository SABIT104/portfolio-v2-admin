/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react';
import { LayoutDashboard, ChevronRight, Save, Plus, Trash2, Briefcase, Calendar, MapPin, AlignLeft, Layout, Loader2 } from "lucide-react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from 'sonner';

export default function AddExperience() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [achievements, setAchievements] = useState([""]);

  const mutation = useMutation({
    mutationFn: async (newData: any) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/experience/createExpe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
      if (!res.ok) throw new Error("Failed to create");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
      toast.success("Experience Added Successfully!");
      router.push("/experience");
    },
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const form = e.target;
    const payload = {
      position: form.position.value,
      company: form.company.value,
      location: form.location.value,
      duration: form.duration.value,
      description: form.description.value,
      side: form.side.value,
      achievements: achievements.filter(a => a !== ""),
      isActive: true
    };
    mutation.mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <nav className="flex items-center space-x-2 text-sm bg-[#212121]/30 w-fit px-5 py-2.5 rounded-full border border-zinc-800">
          <Link href="/dashboard" className="text-zinc-400 hover:text-[#c7d300] flex items-center">
            <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
          </Link>
          <ChevronRight className="h-4 w-4 text-zinc-600" />
          <span className="text-white font-semibold text-[12px] uppercase">New Experience</span>
        </nav>
        <button disabled={mutation.isPending} className="flex items-center gap-2 bg-[#c7d300] text-black px-8 py-3 rounded-xl font-bold">
          {mutation.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />} Publish Journey
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <section className="bg-[#212121] border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-[#c7d300] text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2"><Layout className="h-4 w-4" /> Timeline Layout</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 font-bold uppercase">Display Side</label>
                <select name="side" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-sm text-white focus:border-[#c7d300] outline-none appearance-none">
                  <option value="left">Left Side</option>
                  <option value="right">Right Side</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 font-bold uppercase">Duration</label>
                <div className="relative">
                  <input name="duration" required type="text" placeholder="June 2023 - Present" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 pl-10 text-sm text-white outline-none" />
                  <Calendar className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-600" />
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <section className="bg-[#212121] border border-zinc-800 rounded-2xl p-8 space-y-6 shadow-xl">
            <h3 className="text-[#c7d300] text-xs font-bold uppercase tracking-widest flex items-center gap-2 border-b border-zinc-800 pb-4"><Briefcase className="h-4 w-4" /> Role Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input name="position" required placeholder="Job Role" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-sm text-white" />
              <div className="relative">
                <input name="company" required placeholder="Company Name" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 pl-10 text-sm text-white" />
                <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-600" />
              </div>
            </div>
            <input name="location" placeholder="Location (e.g. Dhaka, Bangladesh)" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-sm text-white" />
            <textarea name="description" rows={2} placeholder="Brief summary..." className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-400 outline-none" />
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] text-zinc-500 font-bold uppercase">Achievements</label>
                <button type="button" onClick={() => setAchievements([...achievements, ""])} className="text-[#c7d300] text-xs font-bold flex items-center gap-1 hover:underline"><Plus className="h-3 w-3" /> Add Point</button>
              </div>
              {achievements.map((val, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex-1 relative">
                    <input value={val} onChange={(e) => {const a = [...achievements]; a[i] = e.target.value; setAchievements(a)}} placeholder={`Achievement ${i + 1}`} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 pl-10 text-sm text-zinc-300" />
                    <AlignLeft className="absolute left-3.5 top-4 h-3.5 w-3.5 text-zinc-700" />
                  </div>
                  {i > 0 && <button type="button" onClick={() => setAchievements(achievements.filter((_, idx) => idx !== i))} className="p-3 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20"><Trash2 className="h-4 w-4" /></button>}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </form>
  );
}