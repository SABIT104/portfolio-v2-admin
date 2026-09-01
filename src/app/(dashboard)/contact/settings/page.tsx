/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ChevronRight,
  Globe,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Twitter,
  Dribbble,
  Github,
  Save,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function ContactSettingsPage() {
  const queryClient = useQueryClient();
  const [successMessage, setSuccessMessage] = useState(false);

  // Fetch Public Contact Info from Backend API
  const { data: publicInfoData, isLoading } = useQuery({
    queryKey: ["public-contact-info"],
    queryFn: async () => {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5001/api/v1";
      const res = await fetch(`${backendUrl}/contact/get-public-info`);
      const json = await res.json();
      return json?.data || {};
    },
  });

  // Form State
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const [dribbble, setDribbble] = useState("");
  const [github, setGithub] = useState("");

  useEffect(() => {
    if (publicInfoData) {
      setEmail(publicInfoData.email || "tanvir.dev@example.com");
      setPhone(publicInfoData.phone || "+880 1234 567890");
      setLocation(publicInfoData.location || "Dhaka, Bangladesh");
      setLinkedin(publicInfoData.linkedin || "https://linkedin.com");
      setTwitter(publicInfoData.twitter || "https://twitter.com");
      setDribbble(publicInfoData.dribbble || "https://dribbble.com");
      setGithub(publicInfoData.github || "https://github.com");
    }
  }, [publicInfoData]);

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
      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 4000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
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
    <div className="p-6 md:p-10 space-y-8 bg-[#0a0b07] min-h-screen text-white font-sans max-w-4xl">
      {/* Navigation Header */}
      <nav className="flex items-center space-x-2 text-sm bg-[#212121]/30 w-fit px-5 py-2.5 rounded-full border border-zinc-800">
        <Link href="/dashboard" className="flex items-center text-zinc-400 hover:text-[#c7d300] transition-colors">
          <LayoutDashboard className="h-4 w-4 mr-2" />
          <span className="font-medium">Dashboard</span>
        </Link>
        <ChevronRight className="h-4 w-4 text-zinc-600" />
        <Link href="/contact" className="text-zinc-400 hover:text-[#c7d300]">
          Contact Section
        </Link>
        <ChevronRight className="h-4 w-4 text-zinc-600" />
        <span className="text-white font-semibold uppercase text-[12px]">Update Public Info</span>
      </nav>

      {/* Header Info */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
          <Globe className="text-[#c7d300]" size={32} />
          Public Contact & Social Settings
        </h1>
        <p className="text-zinc-400 text-sm mt-1">
          Manage public email, phone number, location and social profile links displayed on your live website.
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-[#15160e] border border-zinc-800 rounded-3xl p-8 shadow-2xl">
        {isLoading ? (
          <div className="py-16 text-center text-zinc-500 flex items-center justify-center gap-2">
            <Loader2 className="animate-spin text-[#c7d300]" /> Loading contact settings...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {successMessage && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center gap-2 text-sm font-bold">
                <CheckCircle2 size={18} /> Public contact info updated successfully!
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase text-[#c7d300] tracking-wider">
                1. Public Contact Information
              </h3>

              <div>
                <label className="text-xs font-bold text-zinc-400 flex items-center gap-1.5">
                  <Mail size={14} className="text-[#c7d300]" /> Public Email Address
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
                <label className="text-xs font-bold text-zinc-400 flex items-center gap-1.5">
                  <Phone size={14} className="text-[#c7d300]" /> Public Phone Number
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
                <label className="text-xs font-bold text-zinc-400 flex items-center gap-1.5">
                  <MapPin size={14} className="text-[#c7d300]" /> Location Address
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
            </div>

            <div className="pt-6 border-t border-zinc-800 space-y-4">
              <h3 className="text-xs font-black uppercase text-cyan-400 tracking-wider">
                2. Social Media Profiles
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-400 flex items-center gap-1.5">
                    <Linkedin size={14} className="text-cyan-400" /> LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full bg-[#0a0b07] border border-zinc-800 p-3 rounded-xl text-white text-xs focus:border-[#c7d300] outline-none mt-1"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-400 flex items-center gap-1.5">
                    <Twitter size={14} className="text-sky-400" /> Twitter / X URL
                  </label>
                  <input
                    type="url"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    className="w-full bg-[#0a0b07] border border-zinc-800 p-3 rounded-xl text-white text-xs focus:border-[#c7d300] outline-none mt-1"
                    placeholder="https://twitter.com/username"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-400 flex items-center gap-1.5">
                    <Dribbble size={14} className="text-pink-400" /> Dribbble URL
                  </label>
                  <input
                    type="url"
                    value={dribbble}
                    onChange={(e) => setDribbble(e.target.value)}
                    className="w-full bg-[#0a0b07] border border-zinc-800 p-3 rounded-xl text-white text-xs focus:border-[#c7d300] outline-none mt-1"
                    placeholder="https://dribbble.com/username"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-400 flex items-center gap-1.5">
                    <Github size={14} className="text-purple-400" /> GitHub URL
                  </label>
                  <input
                    type="url"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    className="w-full bg-[#0a0b07] border border-zinc-800 p-3 rounded-xl text-white text-xs focus:border-[#c7d300] outline-none mt-1"
                    placeholder="https://github.com/username"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-800 flex justify-end gap-3">
              <Link href="/contact">
                <button
                  type="button"
                  className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-bold uppercase transition-all"
                >
                  Back to Inbox
                </button>
              </Link>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="px-8 py-3 bg-[#c7d300] hover:bg-white text-black font-black uppercase text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
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
        )}
      </div>
    </div>
  );
}
