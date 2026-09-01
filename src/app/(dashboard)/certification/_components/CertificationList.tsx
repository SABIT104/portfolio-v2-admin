/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
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
  FolderPlus,
  Bookmark,
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

  // Modals state
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  // Accordion open state
  const [expandedBooks, setExpandedBooks] = useState<Record<string, boolean>>({});

  // --- BOOK VOLUME FORM STATE ---
  const [newBookTitle, setNewBookTitle] = useState("");
  const [newBookDiscipline, setNewBookDiscipline] = useState("");
  const [newBookColor, setNewBookColor] = useState("#182a43");
  const [newBookFoil, setNewBookFoil] = useState("#c87046");
  const [initialCertTitle, setInitialCertTitle] = useState("");
  const [initialCertIssuer, setInitialCertIssuer] = useState("");
  const [initialCertDate, setInitialCertDate] = useState("19 Aug 2026");
  const [initialCertId, setInitialCertId] = useState("");
  const [initialCertUrl, setInitialCertUrl] = useState("");
  const [initialCertImage, setInitialCertImage] = useState("");
  const [initialCertDesc, setInitialCertDesc] = useState("");
  const [initialCertSkills, setInitialCertSkills] = useState("");

  // --- CERTIFICATE PAGE FORM STATE ---
  const [selectedVolumeTitle, setSelectedVolumeTitle] = useState("");
  const [certTitle, setCertTitle] = useState("");
  const [certCategory, setCertCategory] = useState("SEO");
  const [certIssuer, setCertIssuer] = useState("");
  const [certDate, setCertDate] = useState("19 Aug 2026");
  const [certId, setCertId] = useState("");
  const [certUrl, setCertUrl] = useState("");
  const [certImage, setCertImage] = useState("");
  const [certDesc, setCertDesc] = useState("");
  const [certSkills, setCertSkills] = useState("");

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
  const groupedBooks = useMemo(() => {
    const map = new Map<
      string,
      {
        volumeTitle: string;
        volumeDiscipline: string;
        volumeColor: string;
        volumeFoil: string;
        certificates: CertificationItem[];
      }
    >();

    certifications.forEach((cert) => {
      const volKey = cert.volumeTitle || cert.issuer || "General Academy Collection";
      if (!map.has(volKey)) {
        map.set(volKey, {
          volumeTitle: volKey,
          volumeDiscipline: cert.volumeDiscipline || (cert.category === "DEVELOPMENT" ? "Software Engineering & Cloud" : "Local & Technical SEO"),
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
      setIsBookModalOpen(false);
      setIsCertModalOpen(false);
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

  const toggleBookExpand = (volTitle: string) => {
    setExpandedBooks((prev) => ({
      ...prev,
      [volTitle]: prev[volTitle] === undefined ? false : !prev[volTitle],
    }));
  };

  // Open "Create New Book Volume" Modal
  const handleOpenBookModal = () => {
    setNewBookTitle("");
    setNewBookDiscipline("");
    setNewBookColor("#182a43");
    setNewBookFoil("#c87046");
    setInitialCertTitle("");
    setInitialCertIssuer("");
    setInitialCertDate("19 Aug 2026");
    setInitialCertId("");
    setInitialCertUrl("");
    setInitialCertImage("");
    setInitialCertDesc("");
    setInitialCertSkills("");
    setIsBookModalOpen(true);
  };

  // Submit New Book Volume
  const handleCreateBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      volumeTitle: newBookTitle || "Custom Academy Volume",
      volumeDiscipline: newBookDiscipline || "Specialized Certification Folio",
      volumeColor: newBookColor,
      volumeFoil: newBookFoil,
      title: initialCertTitle || `${newBookTitle} Volume Inaugural Certificate`,
      category: "SEO",
      issuer: initialCertIssuer || newBookTitle,
      issueDate: initialCertDate || "19 Aug 2026",
      credentialId: initialCertId || "VERIFIED-VOL-01",
      credentialUrl: initialCertUrl || "https://brightlocal.com/academy/",
      image: {
        url:
          initialCertImage ||
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
      },
      description: initialCertDesc || `First verified credential page inside ${newBookTitle}.`,
      skills: initialCertSkills ? initialCertSkills.split(",").map((s) => s.trim()) : ["Certified Skill"],
    };
    createMutation.mutate(payload);
  };

  // Open "Add Certificate Page" Modal
  const handleOpenCertModal = (presetVolTitle?: string, presetIssuer?: string) => {
    const targetVol = presetVolTitle || (groupedBooks[0]?.volumeTitle || "BrightLocal Academy");
    setSelectedVolumeTitle(targetVol);
    setCertTitle("");
    setCertCategory("SEO");
    setCertIssuer(presetIssuer || targetVol);
    setCertDate("19 Aug 2026");
    setCertId("");
    setCertUrl("");
    setCertImage("");
    setCertDesc("");
    setCertSkills("");
    setIsCertModalOpen(true);
  };

  // Submit New Certificate Page
  const handleCreateCertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedGroup = groupedBooks.find((g) => g.volumeTitle === selectedVolumeTitle);

    const payload = {
      volumeTitle: selectedVolumeTitle,
      volumeDiscipline: matchedGroup?.volumeDiscipline || "Professional Certification Folio",
      volumeColor: matchedGroup?.volumeColor || "#182a43",
      volumeFoil: matchedGroup?.volumeFoil || "#c87046",
      title: certTitle,
      category: certCategory,
      issuer: certIssuer || selectedVolumeTitle,
      issueDate: certDate,
      credentialId: certId || `CERT-${Date.now().toString().slice(-4)}`,
      credentialUrl: certUrl || "https://brightlocal.com/academy/",
      image: {
        url:
          certImage ||
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
      },
      description: certDesc || "Handwritten verified credential details and technical achievements.",
      skills: certSkills ? certSkills.split(",").map((s) => s.trim()) : ["Verified Skill"],
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
                Create new Academy Book Volumes & Add handwritten certificate pages dynamically.
              </p>
            </div>
          </div>
        </div>

        {/* 2 Main Action Buttons: Create Book vs Add Page */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleOpenBookModal}
            className="px-5 py-3.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold uppercase text-xs tracking-wider rounded-xl transition-all flex items-center gap-2 border border-neutral-700 cursor-pointer shadow-md"
          >
            <FolderPlus size={18} className="text-[#c7d300]" /> Create New Book Volume
          </button>

          <button
            onClick={() => handleOpenCertModal()}
            className="px-6 py-3.5 bg-[#c7d300] hover:bg-white text-black font-black uppercase text-xs tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-[#c7d300]/10 cursor-pointer"
          >
            <Plus size={18} /> Add Certificate Page
          </button>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-[#15160e] border border-neutral-800 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs uppercase font-bold text-neutral-400">Total Book Volumes</p>
            <h3 className="text-2xl font-black text-[#c7d300] mt-1">{groupedBooks.length} Active Books</h3>
          </div>
          <Layers className="text-neutral-600" size={32} />
        </div>
        <div className="p-5 bg-[#15160e] border border-neutral-800 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs uppercase font-bold text-neutral-400">Total Certificate Pages</p>
            <h3 className="text-2xl font-black text-cyan-400 mt-1">{certifications.length} Pages</h3>
          </div>
          <Award className="text-neutral-600" size={32} />
        </div>
        <div className="p-5 bg-[#15160e] border border-neutral-800 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs uppercase font-bold text-neutral-400">Live Website 3D Sync</p>
            <h3 className="text-2xl font-black text-emerald-400 mt-1 flex items-center gap-2">
              <CheckCircle2 size={20} /> Real-time Active
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
            Click below to create your first Academy Book Volume or add a certificate page!
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleOpenBookModal}
              className="px-5 py-3 bg-neutral-800 text-white font-bold rounded-xl text-xs uppercase"
            >
              Create Book Volume
            </button>
            <button
              onClick={() => handleOpenCertModal()}
              className="px-6 py-3 bg-[#c7d300] text-black font-bold rounded-xl text-xs uppercase"
            >
              Add Certificate Page
            </button>
          </div>
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
                {/* Book Volume Header Bar */}
                <div
                  className="p-6 bg-gradient-to-r from-[#1c1d13] to-[#15160e] flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 cursor-pointer"
                  onClick={() => toggleBookExpand(bookGroup.volumeTitle)}
                >
                  <div className="flex items-center gap-4">
                    {/* Simulated 3D Book Spine Color Badge */}
                    <div
                      className="w-12 h-16 rounded-lg border-2 shadow-xl flex items-center justify-center font-black text-xs shrink-0"
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
                          {bookGroup.certificates.length} Certificate Pages inside
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
                      onClick={() => handleOpenCertModal(bookGroup.volumeTitle, bookGroup.certificates[0]?.issuer)}
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
                              src={
                                cert.image?.url ||
                                "https://images.unsplash.com/photo-1589330694653-ded6df03f754?q=80&w=800&auto=format&fit=crop"
                              }
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
                            ID: {cert.credentialId || "VERIFIED"}
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

      {/* --- MODAL 1: CREATE NEW BOOK VOLUME --- */}
      {isBookModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#15160e] border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <FolderPlus className="text-[#c7d300]" size={24} /> Create New Book Volume / Academy
                </h2>
                <p className="text-neutral-400 text-xs mt-1">
                  Define a new 3D Book Volume collection (e.g. HubSpot Academy, AWS Cloud, Google Certifications).
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateBookSubmit} className="space-y-4">
              {/* BOOK VOLUME STYLING & TITLE */}
              <div className="p-4 bg-[#0a0b07] border border-neutral-800 rounded-2xl space-y-3">
                <label className="text-xs font-black uppercase tracking-wider text-[#c7d300] flex items-center gap-1.5">
                  <Palette size={14} /> 1. Book Cover & Theme Settings
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-neutral-400">Book Volume Title *</label>
                    <input
                      type="text"
                      required
                      value={newBookTitle}
                      onChange={(e) => setNewBookTitle(e.target.value)}
                      className="w-full bg-[#15160e] border border-neutral-800 p-2.5 rounded-xl text-white text-xs focus:border-[#c7d300] outline-none mt-1"
                      placeholder="e.g. HubSpot Academy or Google Cloud"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-neutral-400">Book Subtitle / Discipline</label>
                    <input
                      type="text"
                      required
                      value={newBookDiscipline}
                      onChange={(e) => setNewBookDiscipline(e.target.value)}
                      className="w-full bg-[#15160e] border border-neutral-800 p-2.5 rounded-xl text-white text-xs focus:border-[#c7d300] outline-none mt-1"
                      placeholder="e.g. Inbound Marketing & SEO Collection"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-neutral-400">Cover Color</label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="color"
                        value={newBookColor}
                        onChange={(e) => setNewBookColor(e.target.value)}
                        className="w-9 h-9 rounded-lg bg-transparent border border-neutral-700 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={newBookColor}
                        onChange={(e) => setNewBookColor(e.target.value)}
                        className="w-full bg-[#15160e] border border-neutral-800 p-2 rounded-xl text-white text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-neutral-400">Foil Ring Accent Color</label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="color"
                        value={newBookFoil}
                        onChange={(e) => setNewBookFoil(e.target.value)}
                        className="w-9 h-9 rounded-lg bg-transparent border border-neutral-700 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={newBookFoil}
                        onChange={(e) => setNewBookFoil(e.target.value)}
                        className="w-full bg-[#15160e] border border-neutral-800 p-2 rounded-xl text-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* FIRST CERTIFICATE PAGE INSIDE NEW BOOK */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Bookmark size={14} /> 2. Initial Certificate Page inside Book
                </label>

                <div>
                  <label className="text-[11px] font-bold text-neutral-400">First Certificate Title</label>
                  <input
                    type="text"
                    required
                    value={initialCertTitle}
                    onChange={(e) => setInitialCertTitle(e.target.value)}
                    className="w-full bg-[#0a0b07] border border-neutral-800 p-2.5 rounded-xl text-white text-xs focus:border-[#c7d300] outline-none mt-1"
                    placeholder="e.g. Inbound Marketing Specialist Certification"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-neutral-400">Issuer Name</label>
                    <input
                      type="text"
                      required
                      value={initialCertIssuer}
                      onChange={(e) => setInitialCertIssuer(e.target.value)}
                      className="w-full bg-[#0a0b07] border border-neutral-800 p-2.5 rounded-xl text-white text-xs focus:border-[#c7d300] outline-none mt-1"
                      placeholder="e.g. HubSpot Academy"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-neutral-400">Issue Date</label>
                    <input
                      type="text"
                      required
                      value={initialCertDate}
                      onChange={(e) => setInitialCertDate(e.target.value)}
                      className="w-full bg-[#0a0b07] border border-neutral-800 p-2.5 rounded-xl text-white text-xs focus:border-[#c7d300] outline-none mt-1"
                      placeholder="e.g. 19 Aug 2026"
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
                    value={initialCertImage}
                    onChange={(e) => setInitialCertImage(e.target.value)}
                    className="w-full bg-[#0a0b07] border border-neutral-800 p-2.5 rounded-xl text-white text-xs focus:border-[#c7d300] outline-none mt-1"
                    placeholder="https://images.unsplash.com/... or uploaded image link"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-400">Description</label>
                  <textarea
                    rows={2}
                    value={initialCertDesc}
                    onChange={(e) => setInitialCertDesc(e.target.value)}
                    className="w-full bg-[#0a0b07] border border-neutral-800 p-2.5 rounded-xl text-white text-xs focus:border-[#c7d300] outline-none mt-1"
                    placeholder="Handwritten certificate description..."
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-400">Key Skills (Comma Separated)</label>
                  <input
                    type="text"
                    value={initialCertSkills}
                    onChange={(e) => setInitialCertSkills(e.target.value)}
                    className="w-full bg-[#0a0b07] border border-neutral-800 p-2.5 rounded-xl text-white text-xs focus:border-[#c7d300] outline-none mt-1"
                    placeholder="e.g. Inbound Marketing, Lead Gen, Content Strategy"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="px-5 py-2.5 bg-neutral-800 text-neutral-300 rounded-xl text-xs font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-6 py-2.5 bg-[#c7d300] text-black rounded-xl text-xs font-black uppercase shadow-lg"
                >
                  {createMutation.isPending ? "Creating..." : "Create Book Volume"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: ADD CERTIFICATE PAGE TO EXISTING BOOK --- */}
      {isCertModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#15160e] border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <Award className="text-[#c7d300]" size={24} /> Add Certificate Page to Book
                </h2>
                <p className="text-neutral-400 text-xs mt-1">
                  Select target Book Volume and enter handwritten certificate details & image URL.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateCertSubmit} className="space-y-4">
              {/* SELECT BOOK VOLUME DROPDOWN */}
              <div className="p-4 bg-[#0a0b07] border border-neutral-800 rounded-2xl space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-[#c7d300] flex items-center gap-1.5">
                  <BookOpen size={14} /> 1. Select Target Book Volume *
                </label>
                <select
                  value={selectedVolumeTitle}
                  onChange={(e) => setSelectedVolumeTitle(e.target.value)}
                  className="w-full bg-[#15160e] border border-neutral-800 p-3 rounded-xl text-white text-xs font-bold focus:border-[#c7d300] outline-none"
                >
                  {groupedBooks.map((g) => (
                    <option key={g.volumeTitle} value={g.volumeTitle}>
                      {g.volumeTitle} ({g.certificates.length} pages currently)
                    </option>
                  ))}
                </select>
              </div>

              {/* CERTIFICATE DETAILS */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Award size={14} /> 2. Certificate Details
                </label>

                <div>
                  <label className="text-[11px] font-bold text-neutral-400">Certificate Title (Custom Title) *</label>
                  <input
                    type="text"
                    required
                    value={certTitle}
                    onChange={(e) => setCertTitle(e.target.value)}
                    className="w-full bg-[#0a0b07] border border-neutral-800 p-3 rounded-xl text-white text-sm focus:border-[#c7d300] outline-none mt-1"
                    placeholder="e.g. Level Up Your Local SEO Certification"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-neutral-400">Issuing Organization *</label>
                    <input
                      type="text"
                      required
                      value={certIssuer}
                      onChange={(e) => setCertIssuer(e.target.value)}
                      className="w-full bg-[#0a0b07] border border-neutral-800 p-2.5 rounded-xl text-white text-xs focus:border-[#c7d300] outline-none mt-1"
                      placeholder="e.g. BrightLocal Academy"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-neutral-400">Issue Date *</label>
                    <input
                      type="text"
                      required
                      value={certDate}
                      onChange={(e) => setCertDate(e.target.value)}
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
                      value={certId}
                      onChange={(e) => setCertId(e.target.value)}
                      className="w-full bg-[#0a0b07] border border-neutral-800 p-2.5 rounded-xl text-white text-xs focus:border-[#c7d300] outline-none mt-1"
                      placeholder="e.g. BLA-LEVELUP-8839"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-neutral-400">Verification Link URL</label>
                    <input
                      type="url"
                      value={certUrl}
                      onChange={(e) => setCertUrl(e.target.value)}
                      className="w-full bg-[#0a0b07] border border-neutral-800 p-2.5 rounded-xl text-white text-xs focus:border-[#c7d300] outline-none mt-1"
                      placeholder="https://brightlocal.com/verify/..."
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-400 flex items-center gap-1">
                    <ImageIcon size={13} /> Certificate Image URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={certImage}
                    onChange={(e) => setCertImage(e.target.value)}
                    className="w-full bg-[#0a0b07] border border-neutral-800 p-2.5 rounded-xl text-white text-xs focus:border-[#c7d300] outline-none mt-1"
                    placeholder="https://images.unsplash.com/... or uploaded image URL"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-400">Handwritten Description</label>
                  <textarea
                    rows={2}
                    value={certDesc}
                    onChange={(e) => setCertDesc(e.target.value)}
                    className="w-full bg-[#0a0b07] border border-neutral-800 p-2.5 rounded-xl text-white text-xs focus:border-[#c7d300] outline-none mt-1"
                    placeholder="Detailed description of skills certified..."
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-400">Key Skills (Comma Separated)</label>
                  <input
                    type="text"
                    value={certSkills}
                    onChange={(e) => setCertSkills(e.target.value)}
                    className="w-full bg-[#0a0b07] border border-neutral-800 p-2.5 rounded-xl text-white text-xs focus:border-[#c7d300] outline-none mt-1"
                    placeholder="e.g. Local SEO, Google Map Pack, Citation Audit"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsCertModalOpen(false)}
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
