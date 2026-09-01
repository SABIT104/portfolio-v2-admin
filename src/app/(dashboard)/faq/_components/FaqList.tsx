/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, HelpCircle, Code2, TrendingUp } from "lucide-react";

export default function FaqList() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<"ALL" | "DEVELOPMENT" | "SEO">("ALL");

  // Form state
  const [category, setCategory] = useState<"DEVELOPMENT" | "SEO">("DEVELOPMENT");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [order, setOrder] = useState(1);

  // Fetch FAQs
  const { data: response, isLoading } = useQuery({
    queryKey: ["admin-faqs"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/faq/all-faq`
      );
      return res.json();
    },
  });

  const faqs = response?.data?.data || [];

  const filteredFaqs =
    selectedCategoryTab === "ALL"
      ? faqs
      : faqs.filter((item: any) => item.category === selectedCategoryTab);

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: async (newFaq: any) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/faq/create-faq`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newFaq),
        }
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-faqs"] });
      resetForm();
      setIsModalOpen(false);
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/faq/delete-faq/${id}`,
        { method: "DELETE" }
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-faqs"] });
    },
  });

  const resetForm = () => {
    setCategory("DEVELOPMENT");
    setQuestion("");
    setAnswer("");
    setOrder(faqs.length + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ category, question, answer, order: Number(order) });
  };

  return (
    <div className="p-6 md:p-10 space-y-8 bg-[#0a0b07] min-h-screen text-white font-sans">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <HelpCircle className="text-[#c7d300]" size={32} />
            FAQ Section Management
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            Manage Development & SEO FAQs displayed above the Contact section.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="px-6 py-3 bg-[#c7d300] text-black font-black uppercase text-xs tracking-wider rounded-xl hover:bg-white transition-all flex items-center gap-2 shadow-lg"
        >
          <Plus size={18} /> Add New FAQ
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-3">
        {(["ALL", "DEVELOPMENT", "SEO"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedCategoryTab(tab)}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
              selectedCategoryTab === tab
                ? "bg-[#c7d300] text-black shadow-lg"
                : "bg-[#15160e] text-neutral-400 border border-neutral-800 hover:text-white"
            }`}
          >
            {tab === "DEVELOPMENT" && <Code2 size={14} />}
            {tab === "SEO" && <TrendingUp size={14} />}
            {tab === "ALL" ? "All FAQs" : tab}
          </button>
        ))}
      </div>

      {/* FAQ Grid */}
      {isLoading ? (
        <div className="text-neutral-500 py-12 text-center font-mono">Loading FAQs...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredFaqs.map((faq: any) => (
            <div
              key={faq._id}
              className="bg-[#15160e] border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-[#c7d300]/40 transition-all shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md border ${
                      faq.category === "DEVELOPMENT"
                        ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                        : "bg-[#c7d300]/10 border-[#c7d300]/30 text-[#c7d300]"
                    }`}
                  >
                    {faq.category}
                  </span>
                  <span className="text-xs font-mono text-neutral-500">Order: {faq.order}</span>
                </div>

                <h3 className="text-base font-bold text-white leading-snug">{faq.question}</h3>
                <p className="text-neutral-400 text-xs leading-relaxed">{faq.answer}</p>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex justify-end">
                <button
                  onClick={() => deleteMutation.mutate(faq._id)}
                  className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                  title="Delete FAQ"
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
          <div className="bg-[#15160e] border border-neutral-800 rounded-3xl p-8 max-w-lg w-full space-y-6">
            <h2 className="text-2xl font-black text-white">Add New FAQ Item</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-neutral-400">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-[#0a0b07] border border-neutral-800 p-3 rounded-xl text-white text-sm focus:border-[#c7d300] outline-none mt-1"
                >
                  <option value="DEVELOPMENT">DEVELOPMENT & ARCHITECTURE</option>
                  <option value="SEO">SEO & SEARCH GROWTH</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-neutral-400">Question</label>
                <input
                  type="text"
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full bg-[#0a0b07] border border-neutral-800 p-3 rounded-xl text-white text-sm focus:border-[#c7d300] outline-none mt-1"
                  placeholder="Enter question text..."
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-neutral-400">Answer</label>
                <textarea
                  rows={4}
                  required
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full bg-[#0a0b07] border border-neutral-800 p-3 rounded-xl text-white text-sm focus:border-[#c7d300] outline-none mt-1"
                  placeholder="Enter detailed answer..."
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-neutral-400">Sequence Order</label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className="w-full bg-[#0a0b07] border border-neutral-800 p-3 rounded-xl text-white text-sm focus:border-[#c7d300] outline-none mt-1"
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
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
