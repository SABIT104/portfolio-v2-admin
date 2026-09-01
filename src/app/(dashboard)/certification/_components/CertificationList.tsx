/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Award } from "lucide-react";
import Image from "next/image";

export default function CertificationList() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<"DEVELOPMENT" | "SEO">("DEVELOPMENT");
  const [issuer, setIssuer] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [credentialId, setCredentialId] = useState("");
  const [credentialUrl, setCredentialUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");

  // Fetch Certifications from Backend
  const { data: response, isLoading } = useQuery({
    queryKey: ["admin-certifications"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/certification/all-certifications`
      );
      return res.json();
    },
  });

  const certifications = response?.data?.data || [];

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: async (newCert: any) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/certification/create-certification`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCert),
        }
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-certifications"] });
      resetForm();
      setIsModalOpen(false);
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/certification/delete-certification/${id}`,
        { method: "DELETE" }
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-certifications"] });
    },
  });

  const resetForm = () => {
    setTitle("");
    setCategory("DEVELOPMENT");
    setIssuer("");
    setIssueDate("");
    setCredentialId("");
    setCredentialUrl("");
    setImageUrl("");
    setDescription("");
    setSkills("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      category,
      issuer,
      issueDate,
      credentialId,
      credentialUrl,
      image: { url: imageUrl },
      description,
      skills: skills.split(",").map((s) => s.trim()),
    };
    createMutation.mutate(payload);
  };

  return (
    <div className="p-6 md:p-10 space-y-8 bg-[#0a0b07] min-h-screen text-white font-sans">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <Award className="text-[#c7d300]" size={32} />
            Certifications Management
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            Dynamically manage your Development & SEO certificates displayed on your portfolio website.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="px-6 py-3 bg-[#c7d300] text-black font-black uppercase text-xs tracking-wider rounded-xl hover:bg-white transition-all flex items-center gap-2 shadow-lg"
        >
          <Plus size={18} /> Add New Certificate
        </button>
      </div>

      {/* Certifications Table / Grid */}
      {isLoading ? (
        <div className="text-neutral-500 py-12 text-center font-mono">Loading certifications...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((item: any) => (
            <div
              key={item._id}
              className="bg-[#15160e] border border-neutral-800 rounded-2xl overflow-hidden p-6 flex flex-col justify-between space-y-4 hover:border-[#c7d300]/40 transition-all shadow-xl"
            >
              <div className="space-y-3">
                <div className="relative h-44 w-full rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800">
                  <Image
                    fill
                    src={item.image?.url || "/placeholder.jpg"}
                    alt={item.title}
                    className="object-cover"
                  />
                  <span
                    className={`absolute top-3 left-3 text-[9px] font-black tracking-widest px-3 py-1 rounded-full uppercase border backdrop-blur-md ${
                      item.category === "DEVELOPMENT"
                        ? "bg-[#c7d300]/20 border-[#c7d300]/40 text-[#c7d300]"
                        : "bg-cyan-500/20 border-cyan-400/40 text-cyan-300"
                    }`}
                  >
                    {item.category}
                  </span>
                </div>

                <div>
                  <div className="text-xs font-mono text-neutral-400">
                    {item.issuer} • {item.issueDate}
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1 leading-snug">{item.title}</h3>
                </div>

                <p className="text-neutral-400 text-xs line-clamp-2">{item.description}</p>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                <span className="font-mono text-[10px] text-neutral-500">ID: {item.credentialId}</span>
                <button
                  onClick={() => deleteMutation.mutate(item._id)}
                  className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                  title="Delete Certificate"
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
          <div className="bg-[#15160e] border border-neutral-800 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6">
            <h2 className="text-2xl font-black text-white">Add New Certification</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-neutral-400">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#0a0b07] border border-neutral-800 p-3 rounded-xl text-white text-sm focus:border-[#c7d300] outline-none mt-1"
                  placeholder="e.g. Technical SEO & Schema Architecture Expert"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-neutral-400">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-[#0a0b07] border border-neutral-800 p-3 rounded-xl text-white text-sm focus:border-[#c7d300] outline-none mt-1"
                  >
                    <option value="DEVELOPMENT">DEVELOPMENT</option>
                    <option value="SEO">SEO</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-neutral-400">Issuer</label>
                  <input
                    type="text"
                    required
                    value={issuer}
                    onChange={(e) => setIssuer(e.target.value)}
                    className="w-full bg-[#0a0b07] border border-neutral-800 p-3 rounded-xl text-white text-sm focus:border-[#c7d300] outline-none mt-1"
                    placeholder="e.g. Semrush Academy"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-neutral-400">Issue Date</label>
                  <input
                    type="text"
                    required
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full bg-[#0a0b07] border border-neutral-800 p-3 rounded-xl text-white text-sm focus:border-[#c7d300] outline-none mt-1"
                    placeholder="e.g. Jan 2024"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-neutral-400">Credential ID</label>
                  <input
                    type="text"
                    value={credentialId}
                    onChange={(e) => setCredentialId(e.target.value)}
                    className="w-full bg-[#0a0b07] border border-neutral-800 p-3 rounded-xl text-white text-sm focus:border-[#c7d300] outline-none mt-1"
                    placeholder="e.g. SEM-SEO-8849"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-neutral-400">Image URL</label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-[#0a0b07] border border-neutral-800 p-3 rounded-xl text-white text-sm focus:border-[#c7d300] outline-none mt-1"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-neutral-400">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#0a0b07] border border-neutral-800 p-3 rounded-xl text-white text-sm focus:border-[#c7d300] outline-none mt-1"
                  placeholder="Description of skills covered..."
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
                  Save Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
