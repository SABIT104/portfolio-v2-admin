/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Workflow } from "lucide-react";

export default function ProcessList() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [number, setNumber] = useState("");
  const [phase, setPhase] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [iconName, setIconName] = useState("Workflow");
  const [tags, setTags] = useState("");
  const [order, setOrder] = useState(1);

  // Fetch Process steps from Backend
  const { data: response, isLoading } = useQuery({
    queryKey: ["admin-process"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/process/all-process`
      );
      return res.json();
    },
  });

  const processSteps = response?.data?.data || [];

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: async (newStep: any) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/process/create-process`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newStep),
        }
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-process"] });
      resetForm();
      setIsModalOpen(false);
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/process/delete-process/${id}`,
        { method: "DELETE" }
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-process"] });
    },
  });

  const resetForm = () => {
    setNumber("");
    setPhase("");
    setTitle("");
    setSubtitle("");
    setDescription("");
    setIconName("Workflow");
    setTags("");
    setOrder(processSteps.length + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      number,
      phase,
      title,
      subtitle,
      description,
      iconName,
      tags: tags.split(",").map((t) => t.trim()),
      order: Number(order),
    };
    createMutation.mutate(payload);
  };

  return (
    <div className="p-6 md:p-10 space-y-8 bg-[#0a0b07] min-h-screen text-white font-sans">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <Workflow className="text-[#c7d300]" size={32} />
            Work Process Management
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            Dynamically manage your 10-step strategic workflow framework displayed on your portfolio website.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="px-6 py-3 bg-[#c7d300] text-black font-black uppercase text-xs tracking-wider rounded-xl hover:bg-white transition-all flex items-center gap-2 shadow-lg"
        >
          <Plus size={18} /> Add Process Step
        </button>
      </div>

      {/* Steps List */}
      {isLoading ? (
        <div className="text-neutral-500 py-12 text-center font-mono">Loading workflow steps...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processSteps.map((item: any) => (
            <div
              key={item._id}
              className="bg-[#15160e] border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-[#c7d300]/40 transition-all shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-[#c7d300] font-mono">
                    {item.number}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-[#c7d300]/10 border border-[#c7d300]/20 rounded-md text-[#c7d300]">
                    {item.phase}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white leading-snug">{item.title}</h3>
                <p className="text-neutral-400 text-xs leading-relaxed">{item.description}</p>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex items-center justify-between font-mono text-xs text-neutral-500">
                <span>Order: {item.order}</span>
                <button
                  onClick={() => deleteMutation.mutate(item._id)}
                  className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                  title="Delete Step"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- ADD MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#15160e] border border-neutral-800 rounded-3xl p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-6">
            <h2 className="text-2xl font-black text-white">Add New Workflow Step</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-neutral-400">Step Number</label>
                  <input
                    type="text"
                    required
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className="w-full bg-[#0a0b07] border border-neutral-800 p-3 rounded-xl text-white text-sm focus:border-[#c7d300] outline-none mt-1"
                    placeholder="e.g. 01"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-neutral-400">Phase Code</label>
                  <input
                    type="text"
                    required
                    value={phase}
                    onChange={(e) => setPhase(e.target.value.toUpperCase())}
                    className="w-full bg-[#0a0b07] border border-neutral-800 p-3 rounded-xl text-white text-sm focus:border-[#c7d300] outline-none mt-1 uppercase"
                    placeholder="e.g. DISCOVER"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-neutral-400">Step Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#0a0b07] border border-neutral-800 p-3 rounded-xl text-white text-sm focus:border-[#c7d300] outline-none mt-1"
                  placeholder="e.g. Understand the Business & Goals"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-neutral-400">Description</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#0a0b07] border border-neutral-800 p-3 rounded-xl text-white text-sm focus:border-[#c7d300] outline-none mt-1"
                  placeholder="Brief explanation of the workflow step..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-neutral-800 text-neutral-300 rounded-xl text-xs font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#c7d300] text-black rounded-xl text-xs font-black uppercase"
                >
                  Save Step
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
