/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Trash2,
  BookOpen,
  Award,
  Layers,
  Calendar,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2,
  Image as ImageIcon,
  Palette,
} from "lucide-react";
import Image from "next/image";

interface CertificationItem {
  _id: string;
  volumeTitle?: string;
  volumeDiscipline?: string;
  volumeColor?: string;
  volumeFoil?: string;
  title: string;
  category?: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
  credentialUrl?: string;
  image?: { url: string };
  description?: string;
  skills?: string[];
}

export default function CertificationList() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVolumeForNewCert, setSelectedVolumeForNewCert] = useState<string>("");
  const [expandedBooks, setExpandedBooks] = useState<Record<string, boolean>>({
    "BrightLocal Academy": true,
    "Semrush Academy": true,
    "Programming Hero & Cloud": true,
  });

  // Form State
  const [volumeTitle, setVolumeTitle] = useState("BrightLocal Academy");
  const [volumeDiscipline, setVolumeDiscipline] = useState("Local SEO & Technical Audits");
  const [volumeColor, setVolumeColor] = useState("#182a43");
  const [volumeFoil, setVolumeFoil] = useState("#c87046");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("SEO");
  const [issuer, setIssuer] = useState("BrightLocal Academy");
  const [issueDate, setIssueDate] = useState("19 Aug 2026");
  const [credentialId, setCredentialId] = useState("");
  const [credentialUrl, setCredentialUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");

  // Fetch Certifications from Backend API
  const { data: response, isLoading } = useQuery({
    queryKey: ["admin-certifications"],
    queryFn: async () => {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5001/api/v1";
      const res = await fetch(`${backendUrl}/certification/all-certifications`);
      return res.json();
    },
  });

  const certifications: CertificationItem[] = response?.data?.data || response?.data || [];

  // Group Certifications by Book Volume / Issuer
  const groupedBooks = React.useMemo(() => {
    const map = new Map<string, {
      volumeTitle: string;
      volumeDiscipline: string;
      volumeColor: string;
      volumeFoil: string;
      certificates: CertificationItem[];
    }>();

    certifications.forEach((cert) => {
      const volKey = cert.volumeTitle || cert.issuer || "General Academy Book";
      if (!map.has(volKey)) {
        map.set(volKey, {
          volumeTitle: volKey,
          volumeDiscipline: cert.volumeDiscipline || (cert.category === "DEVELOPMENT" ? "Software Engineering & Cloud" : "Technical & Local SEO"),
          volumeColor: cert.volumeColor || (volKey.includes("Bright") ? "#182a43" : volKey.includes("Semrush") ? "#c83222" : "#1e3a2b"),
          volumeFoil: cert.volumeFoil || (volKey.includes("Bright") ? "#c87046" : volKey.includes("Semrush") ? "#efb0aa" : "#a3e635"),
          certificates: [],
        });
      }
      map.get(volKey)!.certificates.push(cert);
    });

    return Array.from(map.values());
  }, [certifications]);

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: async (newCert: any) => {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5001/api/v1";
      const res = await fetch(`${backendUrl}/certification/create-certification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCert),
      });
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
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5001/api/v1";
      const res = await fetch(`${backendUrl}/certification/delete-certification/${id}`, {
        method: "DELETE",
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-certifications"] });
    },
  });

  const resetForm = () => {
    setTitle("");
    setCategory("SEO");
    setIssuer("BrightLocal Academy");
    setIssueDate("19 Aug 2026");
    setCredentialId("");
    setCredentialUrl("");
    setImageUrl("");
    setDescription("");
    setSkills("");
  };

  const handleOpenAddModal = (presetVolumeTitle?: string, presetIssuer?: string) => {
    if (presetVolumeTitle) {
      setVolumeTitle(presetVolumeTitle);
      setSelectedVolumeForNewCert(presetVolumeTitle);
      if (presetVolumeTitle.includes("Bright")) {
        setVolumeDiscipline("Local SEO & GBP Audits");
        setVolumeColor("#182a43");
        setVolumeFoil("#c87046");
        setIssuer(presetIssuer || "BrightLocal Academy");
      } else if (presetVolumeTitle.includes("Semrush")) {
        setVolumeDiscipline("Technical SEO & Schema Folio");
        setVolumeColor("#c83222");
        setVolumeFoil("#efb0aa");
        setIssuer(presetIssuer || "Semrush Academy");
      } else {
        setVolumeDiscipline("Software & Full-Stack Cloud");
        setVolumeColor("#1e3a2b");
        setVolumeFoil("#a3e635");
        setIssuer(presetIssuer || "Programming Hero & AWS");
      }
    }
    setIsModalOpen(true);
  };

  const toggleBookExpand = (volTitle: string) => {
    setExpandedBooks((prev) => ({ ...prev, [volTitle]: !prev[volTitle] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      volumeTitle,
      volumeDiscipline,
      volumeColor,
      volumeFoil,
      title,
      category,
      issuer,
      issueDate,
      credentialId,
      credentialUrl: credentialUrl || "https://brightlocal.com/verify/credential",
      image: { url: imageUrl || "https://images.unsplash.com/photo-1589330694653-ded6df03f754?q=80&w=800&auto=format&fit=crop" },
      description,
      skills: skills ? skills.split(",").map((s) => s.trim()) : ["Verified Skills"],
    };
    createMutation.mutate(payload);
  };

  return (
    <div className="p-4 sm:p-8 md:p-10 space-y-10 bg-[#0a0b07] min-h-screen text-white font-sans">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-neutral-800/80">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#c7d300]/10 border border-[#c7d300]/30 rounded-2xl">
              <BookOpen className="text-[#c7d300]" size={28} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
                3D Certification Books Dashboard
              </h1>
              <p className="text-neutral-400 text-xs sm:text-sm mt-1">
                Manage your 3D Book Volumes & Add verified certificate pages with custom handwritten titles & images.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenAddModal()}
            className="px-6 py-3.5 bg-[#c7d300] hover:bg-white text-black font-black uppercase text-xs tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-[#c7d300]/10 cursor-pointer"
          >
            <Plus size={18} /> Add New Certificate Page
          </button>
        </div>
      </div>

      {/* Stats Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-[#15160e] border border-neutral-800 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs uppercase font-bold text-neutral-400">Total Book Volumes</p>
            <h3 className="text-2xl font-black text-[#c7d300] mt-1">{groupedBooks.length} Books</h3>
          </div>
          <Layers className="text-neutral-600" size={32} />
        </div>
        <div className="p-5 bg-[#15160e] border border-neutral-800 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs uppercase font-bold text-neutral-400">Total Verified Certificates</p>
            <h3 className="text-2xl font-black text-cyan-400 mt-1">{certifications.length} Credentials</h3>
          </div>
          <Award className="text-neutral-600" size={32} />
        </div>
        <div className="p-5 bg-[#15160e] border border-neutral-800 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs uppercase font-bold text-neutral-400">Live 3D Book Sync</p>
            <h3 className="text-2xl font-black text-emerald-400 mt-1 flex items-center gap-2">
              <CheckCircle2 size={20} /> Active & Live
            </h3>
          </div>
          <Sparkles className="text-neutral-600" size={32} />
        </div>
      </div>

      {/* Book Volumes & Certificate Accordions */}
      {isLoading ? (
        <div className="text-neutral-500 py-16 text-center font-mono">Loading 3D Book Showcase Data...</div>
      ) : groupedBooks.length === 0 ? (
        <div className="p-12 text-center bg-[#15160e] border border-neutral-800 rounded-3xl space-y-4">
          <BookOpen className="mx-auto text-neutral-600" size={48} />
          <h3 className="text-xl font-bold text-white">No Certificate Books Created Yet</h3>
          <p className="text-neutral-400 text-sm max-w-md mx-auto">
            Click the button below to add your first certificate page and create a dynamic 3D Book Volume!
          </p>
          <button
            onClick={() => handleOpenAddModal()}
            className="px-6 py-3 bg-[#c7d300] text-black font-bold rounded-xl text-xs uppercase"
          >
            Create First Certificate
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedBooks.map((bookGroup, index) => {
            const isExpanded = expandedBooks[bookGroup.volumeTitle] !== false;
            return (
              <div
                key={bookGroup.volumeTitle || index}
                className="bg-[#15160e] border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl transition-all"
              >
                {/* Book Volume Header Card */}
                <div
                  className="p-6 bg-gradient-to-r from-[#1c1d13] to-[#15160e] flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 cursor-pointer"
                  onClick={() => toggleBookExpand(bookGroup.volumeTitle)}
                >
                  <div className="flex items-center gap-4">
                    {/* Simulated 3D Book Spine Color Badge */}
                    <div
                      className="w-12 h-16 rounded-lg border-2 shadow-xl flex items-center justify-center font-black text-xs"
                      style={{
                        backgroundColor: bookGroup.volumeColor,
                        borderColor: bookGroup.volumeFoil,
                        color: bookGroup.volumeFoil,
                      }}
                    >
                      VOL {index + 1}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#c7d300]/10 border border-[#c7d300]/30 text-[#c7d300]">
                          Book Volume #{index + 1}
                        </span>
                        <span className="text-xs text-neutral-400 font-mono">
                          {bookGroup.certificates.length} Pages inside
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                        {bookGroup.volumeTitle}
                      </h2>
                      <p className="text-neutral-400 text-xs mt-0.5">{bookGroup.volumeDiscipline}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleOpenAddModal(bookGroup.volumeTitle, bookGroup.certificates[0]?.issuer)}
                      className="px-4 py-2 bg-neutral-800 hover:bg-[#c7d300] hover:text-black text-white rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-1.5"
                    >
                      <Plus size={14} /> Add Page to this Book
                    </button>

                    <button
                      onClick={() => toggleBookExpand(bookGroup.volumeTitle)}
                      className="p-2.5 text-neutral-400 hover:text-white rounded-xl bg-neutral-900 border border-neutral-800"
                    >
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                </div>

                {/* Certificate Pages Grid inside Book */}
                {isExpanded && (
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-[#0e0f0a]">
                    {bookGroup.certificates.map((cert, pageIdx) => (
                      <div
                        key={cert._id}
                        className="bg-[#15160e] border border-neutral-800/80 hover:border-[#c7d300]/40 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-lg group transition-all"
                      >
                        <div className="space-y-3">
                          {/* Image Diploma Preview */}
                          <div className="relative h-44 w-full rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800">
                            <Image
                              fill
                              src={cert.image?.url || "https://images.unsplash.com/photo-1589330694653-ded6df03f754?q=80&w=800&auto=format&fit=crop"}
                              alt={cert.title}
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-white border border-white/10 flex items-center gap-1">
                              <BookOpen size={12} className="text-[#c7d300]" /> Page {pageIdx + 1}
                            </div>
                          </div>

                          {/* Titles & Details */}
                          <div>
                            <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
                              <span className="text-[#c7d300] font-semibold">{cert.issuer}</span>
                              <span className="flex items-center gap-1">
                                <Calendar size={12} /> {cert.issueDate}
                              </span>
                            </div>

                            <h3 className="text-base font-bold text-white mt-1 leading-snug line-clamp-2">
                              {cert.title}
                            </h3>
                          </div>

                          <p className="text-neutral-400 text-xs line-clamp-2 leading-relaxed">
                            {cert.description || "Verified certificate credential details and technical achievements."}
                          </p>

                          {/* Skill Tags */}
                          {cert.skills && cert.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {cert.skills.slice(0, 4).map((skill, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="text-[9px] font-bold px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-md"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Footer Action Bar */}
                        <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                          <span className="font-mono text-[10px] text-neutral-500">
                            ID: {cert.credentialId || "VERIFIED-01"}
                          </span>

                          <div className="flex items-center gap-2">
                            {cert.credentialUrl && (
                              <a
                                href={cert.credentialUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 text-neutral-400 hover:text-cyan-400 bg-neutral-900 rounded-lg border border-neutral-800"
                                title="View Online Credential"
                              >
                                <ExternalLink size={14} />
                              </a>
                            )}
                            <button
                              onClick={() => deleteMutation.mutate(cert._id)}
                              className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                              title="Delete Certificate Page"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* --- ADD / EDIT CERTIFICATE MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#15160e] border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <BookOpen className="text-[#c7d300]" size={24} /> Add Certificate Page to Book
                </h2>
                <p className="text-neutral-400 text-xs mt-1">
                  Fill in manual/handwritten certificate title, image URL, and book volume options.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* BOOK VOLUME SELECTION */}
              <div className="p-4 bg-[#0a0b07] border border-neutral-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-[#c7d300] flex items-center gap-1.5">
                    <Palette size={14} /> 1. Book Volume Information
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-neutral-400">Book Volume Title</label>
                    <input
                      type="text"
                      required
                      value={volumeTitle}
                      onChange={(e) => setVolumeTitle(e.target.value)}
                      className="w-full bg-[#15160e] border border-neutral-800 p-2.5 rounded-xl text-white text-xs focus:border-[#c7d300] outline-none mt-1"
                      placeholder="e.g. BrightLocal Academy"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-neutral-400">Book Subtitle / Discipline</label>
                    <input
                      type="text"
                      required
                      value={volumeDiscipline}
                      onChange={(e) => setVolumeDiscipline(e.target.value)}
                      className="w-full bg-[#15160e] border border-neutral-800 p-2.5 rounded-xl text-white text-xs focus:border-[#c7d300] outline-none mt-1"
                      placeholder="e.g. Local SEO & Technical Audits"
                    />
                  </div>
                </div>
              </div>

              {/* CERTIFICATE DETAILS */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Award size={14} /> 2. Certificate Details
                </label>

                <div>
                  <label className="text-[11px] font-bold text-neutral-400">Certificate Title (Custom Title)</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#0a0b07] border border-neutral-800 p-3 rounded-xl text-white text-sm focus:border-[#c7d300] outline-none mt-1"
                    placeholder="e.g. Level Up Your Local SEO Certification"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-neutral-400">Issuing Organization</label>
                    <input
                      type="text"
                      required
                      value={issuer}
                      onChange={(e) => setIssuer(e.target.value)}
                      className="w-full bg-[#0a0b07] border border-neutral-800 p-2.5 rounded-xl text-white text-xs focus:border-[#c7d300] outline-none mt-1"
                      placeholder="e.g. BrightLocal Academy"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-neutral-400">Issue Date</label>
                    <input
                      type="text"
                      required
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      className="w-full bg-[#0a0b07] border border-neutral-800 p-2.5 rounded-xl text-white text-xs focus:border-[#c7d300] outline-none mt-1"
                      placeholder="e.g. 19 Aug 2026"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-neutral-400">Credential ID</label>
                    <input
                      type="text"
                      value={credentialId}
                      onChange={(e) => setCredentialId(e.target.value)}
                      className="w-full bg-[#0a0b07] border border-neutral-800 p-2.5 rounded-xl text-white text-xs focus:border-[#c7d300] outline-none mt-1"
                      placeholder="e.g. BLA-LEVELUP-8839"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-neutral-400">Verification URL</label>
                    <input
                      type="url"
                      value={credentialUrl}
                      onChange={(e) => setCredentialUrl(e.target.value)}
                      className="w-full bg-[#0a0b07] border border-neutral-800 p-2.5 rounded-xl text-white text-xs focus:border-[#c7d300] outline-none mt-1"
                      placeholder="https://brightlocal.com/verify/..."
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-400 flex items-center gap-1">
                    <ImageIcon size={13} /> Certificate Image URL
                  </label>
                  <input
                    type="url"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full bg-[#0a0b07] border border-neutral-800 p-2.5 rounded-xl text-white text-xs focus:border-[#c7d300] outline-none mt-1"
                    placeholder="https://images.unsplash.com/... or uploaded image URL"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-400">Description</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#0a0b07] border border-neutral-800 p-2.5 rounded-xl text-white text-xs focus:border-[#c7d300] outline-none mt-1"
                    placeholder="Detailed description of skills certified..."
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-400">Key Skills (Comma Separated)</label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="w-full bg-[#0a0b07] border border-neutral-800 p-2.5 rounded-xl text-white text-xs focus:border-[#c7d300] outline-none mt-1"
                    placeholder="e.g. Local SEO, Google Business Profile, Citation Audit"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-bold uppercase transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-6 py-2.5 bg-[#c7d300] hover:bg-white text-black rounded-xl text-xs font-black uppercase transition-all shadow-lg"
                >
                  {createMutation.isPending ? "Saving..." : "Save Certificate Page"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
