/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  ChevronRight,
  Mail,
  MapPin,
  MessageSquare,
  Globe,
  Clock,
  Loader2,
  X,
  Phone,
  Linkedin,
  Twitter,
  Dribbble,
  Github,
  Save,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { ViewContact } from "./ViewContact";
import { DeleteModule } from "@/components/DeleteModule";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function ContactList() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch Public Contact Info from Backend API
  const { data: publicInfoData } = useQuery({
    queryKey: ["public-contact-info"],
    queryFn: async () => {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5001/api/v1";
      const res = await fetch(`${backendUrl}/contact/get-public-info`);
      const json = await res.json();
      return json?.data || {};
    },
  });

  // Fetch Contact Messages from Backend API
  const { data: contactData, isLoading } = useQuery({
    queryKey: ["contact-messages"],
    queryFn: async () => {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5001/api/v1";
      const res = await fetch(`${backendUrl}/contact/get-all-messages`);
      const result = await res.json();
      return result.data;
    },
  });

  const messages = contactData?.contacts || [];
  const totalMessages = contactData?.paginationInfo?.totalData || 0;

  // Form State for Public Contact Info
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const [dribbble, setDribbble] = useState("");
  const [github, setGithub] = useState("");

  const handleOpenModal = () => {
    setEmail(publicInfoData?.email || "tanvir.dev@example.com");
    setPhone(publicInfoData?.phone || "+880 1234 567890");
    setLocation(publicInfoData?.location || "Dhaka, Bangladesh");
    setLinkedin(publicInfoData?.linkedin || "https://linkedin.com");
    setTwitter(publicInfoData?.twitter || "https://twitter.com");
    setDribbble(publicInfoData?.dribbble || "https://dribbble.com");
    setGithub(publicInfoData?.github || "https://github.com");
    setIsModalOpen(true);
  };

  // Update Public Info Mutation
  const updateMutation = useMutation({
    mutationFn: async (payload: any) => {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5001/api/v1";
      const res = await fetch(`${backendUrl}/contact/update-public-info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["public-contact-info"] });
      setIsModalOpen(false);
    },
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      email,
      phone,
      location,
      linkedin,
      twitter,
      dribbble,
      github,
    });
  };

  return (
    <div className="space-y-10 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <nav className="flex items-center space-x-2 text-sm bg-[#212121]/30 w-fit px-5 py-2.5 rounded-full border border-zinc-800">
          <Link href="/dashboard" className="flex items-center text-zinc-400 hover:text-[#c7d300] transition-colors">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <ChevronRight className="h-4 w-4 text-zinc-600" />
          <div className="flex items-center">
            <span className="text-white font-semibold tracking-wide uppercase text-[12px]">Inbox & Contact</span>
            <span className="ml-2 h-1.5 w-1.5 rounded-full bg-[#c7d300]"></span>
          </div>
        </nav>

        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 bg-[#c7d300] text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-white transition-all shadow-lg cursor-pointer"
        >
          <Globe className="h-4 w-4 text-black" />
          Update Public Info
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1a1b14] border border-zinc-800 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Total Inquiries</p>
            <h4 className="text-xl font-black text-white mt-1">{totalMessages.toString().padStart(2, "0")}</h4>
          </div>
          <MessageSquare style={{ color: "#c7d300" }} size={24} />
        </div>

        <div className="bg-[#1a1b14] border border-zinc-800 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Public Email</p>
            <h4 className="text-sm font-bold text-emerald-400 mt-1 truncate max-w-[180px]">
              {publicInfoData?.email || "tanvir.dev@example.com"}
            </h4>
          </div>
          <Mail style={{ color: "#4ade80" }} size={24} />
        </div>

        <div className="bg-[#1a1b14] border border-zinc-800 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Location Status</p>
            <h4 className="text-sm font-bold text-cyan-400 mt-1 truncate max-w-[180px]">
              {publicInfoData?.location || "Dhaka, Bangladesh"}
            </h4>
          </div>
          <MapPin style={{ color: "#60a5fa" }} size={24} />
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          <MessageSquare className="text-[#c7d300]" size={20} />
          Recent Inquiries
        </h3>

        <div className="bg-[#1a1b14] border border-zinc-800 rounded-3xl overflow-hidden">
          {isLoading ? (
            <div className="p-20 flex justify-center">
              <Loader2 className="animate-spin text-[#c7d300]" />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-zinc-900/50 border-b border-zinc-800 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Sender</th>
                  <th className="px-6 py-4">Service Required</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {messages.map((msg: any) => (
                  <tr key={msg._id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-white font-bold text-sm">
                          {msg.firstName} {msg.lastName}
                        </span>
                        <span className="text-zinc-500 text-[11px]">{msg.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex gap-1 flex-wrap">
                        {msg.services?.map((s: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-[#c7d300] text-[9px] font-bold rounded uppercase"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-zinc-500 text-xs">
                        <Clock size={12} />{" "}
                        {new Date(msg.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-3">
                        <ViewContact messageId={msg._id} />
                        <DeleteModule
                          id={msg._id}
                          endpoint="/contact/delete-message"
                          queryKey={["contact-messages"]}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* --- UPDATE PUBLIC INFO MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#15160e] border border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Globe className="text-[#c7d300]" size={24} /> Update Public Contact Info
                </h2>
                <p className="text-zinc-400 text-xs mt-1">
                  Update public email, phone, location & social links displayed on your portfolio website.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-zinc-400 hover:text-white rounded-lg bg-zinc-900 border border-zinc-800"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-zinc-400 flex items-center gap-1.5">
                  <Mail size={13} className="text-[#c7d300]" /> Public Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0a0b07] border border-zinc-800 p-3 rounded-xl text-white text-sm focus:border-[#c7d300] outline-none mt-1"
                  placeholder="saimunsabit@gmail.com"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-400 flex items-center gap-1.5">
                  <Phone size={13} className="text-[#c7d300]" /> Public Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#0a0b07] border border-zinc-800 p-3 rounded-xl text-white text-sm focus:border-[#c7d300] outline-none mt-1"
                  placeholder="+880 1700 000000"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-400 flex items-center gap-1.5">
                  <MapPin size={13} className="text-[#c7d300]" /> Location Address *
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-[#0a0b07] border border-zinc-800 p-3 rounded-xl text-white text-sm focus:border-[#c7d300] outline-none mt-1"
                  placeholder="Dhaka, Bangladesh"
                />
              </div>

              <div className="pt-2 border-t border-zinc-800 space-y-3">
                <label className="text-xs font-black uppercase text-zinc-300">Social Media Profile Links</label>

                <div>
                  <label className="text-[11px] font-bold text-zinc-400 flex items-center gap-1.5">
                    <Linkedin size={13} className="text-cyan-400" /> LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full bg-[#0a0b07] border border-zinc-800 p-2.5 rounded-xl text-white text-xs focus:border-[#c7d300] outline-none mt-1"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-zinc-400 flex items-center gap-1.5">
                    <Twitter size={13} className="text-sky-400" /> Twitter / X Profile URL
                  </label>
                  <input
                    type="url"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    className="w-full bg-[#0a0b07] border border-zinc-800 p-2.5 rounded-xl text-white text-xs focus:border-[#c7d300] outline-none mt-1"
                    placeholder="https://twitter.com/username"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-zinc-400 flex items-center gap-1.5">
                    <Dribbble size={13} className="text-pink-400" /> Dribbble Profile URL
                  </label>
                  <input
                    type="url"
                    value={dribbble}
                    onChange={(e) => setDribbble(e.target.value)}
                    className="w-full bg-[#0a0b07] border border-zinc-800 p-2.5 rounded-xl text-white text-xs focus:border-[#c7d300] outline-none mt-1"
                    placeholder="https://dribbble.com/username"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-zinc-400 flex items-center gap-1.5">
                    <Github size={13} className="text-purple-400" /> GitHub Profile URL
                  </label>
                  <input
                    type="url"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    className="w-full bg-[#0a0b07] border border-zinc-800 p-2.5 rounded-xl text-white text-xs focus:border-[#c7d300] outline-none mt-1"
                    placeholder="https://github.com/username"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-zinc-800 text-zinc-300 rounded-xl text-xs font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="px-6 py-2.5 bg-[#c7d300] hover:bg-white text-black rounded-xl text-xs font-black uppercase shadow-lg flex items-center gap-2"
                >
                  {updateMutation.isPending ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <>
                      <Save size={16} /> Save Public Info
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}