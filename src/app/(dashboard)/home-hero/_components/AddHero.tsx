/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LayoutDashboard,
  ChevronRight,
  Save,
  X,
  Image as ImageIcon,
  Type,
  MousePointer2,
  Plus,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

// --- TypeScript Interfaces ---

interface HeroFormInputs {
  overlayOpacity: number;
  typingAnimationLines: string; // Form input handles this as a string
  titleLine1: string;
  titleLine2: string;
  description: string;
  primaryBtnText: string;
  secondaryBtnText: string;
  videoUrl: string;
}

interface ApiResponse {
  status: boolean;
  message: string;
  data?: any;
}

// --- Component ---

function AddHero() {
  const router = useRouter();
  
  // File Input References
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const cvInputRef = useRef<HTMLInputElement | null>(null);

  // States for Files
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);

  // React Hook Form with TS Interface
  const { register, handleSubmit, formState: { errors } } = useForm<HeroFormInputs>({
    defaultValues: {
      overlayOpacity: 25,
      typingAnimationLines: "",
      titleLine1: "",
      titleLine2: "",
      description: "",
      primaryBtnText: "",
      secondaryBtnText: "",
      videoUrl: "",
    },
  });

  // TanStack Mutation with Proper TS Types
  const addMutation: UseMutationResult<ApiResponse, Error, FormData> = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/home/createHomeContent`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save hero content");
      }
      return response.json();
    },
    onSuccess: (data) => {
      if (data.status) {
        toast.success(data.message || "Hero section added successfully!");
        router.push("/home-hero");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Form Submission Handler
  const onSubmit: SubmitHandler<HeroFormInputs> = (data) => {
    const formData = new FormData();

    // typingAnimationLines string ke array-te convert kora (comma separated)
    const linesArray = data.typingAnimationLines
      .split(",")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    // Payload object structure as per your requirement
    const payload = {
      overlayOpacity: Number(data.overlayOpacity),
      typingAnimationLines: linesArray,
      titleLine1: data.titleLine1,
      titleLine2: data.titleLine2,
      description: data.description,
      primaryBtnText: data.primaryBtnText,
      secondaryBtnText: data.secondaryBtnText,
      videoUrl: data.videoUrl,
      isActive: false, // Initial status
    };

    // Appending Data & Files to FormData
    formData.append("data", JSON.stringify(payload));
    
    if (imageFile) {
      formData.append("heroImage", imageFile);
    }
    if (cvFile) {
      formData.append("heroIcon", cvFile); // Using heroIcon as per your body description
    }

    addMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <nav className="flex items-center space-x-2 text-sm bg-[#212121]/30 w-fit px-5 py-2.5 rounded-full border border-zinc-800">
          <div 
            onClick={() => router.push("/dashboard")} 
            className="flex items-center text-zinc-400 hover:text-[#c7d300] transition-colors cursor-pointer"
          >
            <LayoutDashboard className="h-4 w-4 mr-2" />
            <span className="font-medium">Dashboard</span>
          </div>
          <ChevronRight className="h-4 w-4 text-zinc-600" />
          <div 
            onClick={() => router.push("/home-hero")} 
            className="flex items-center text-zinc-400 hover:text-[#c7d300] cursor-pointer"
          >
            <span className="font-medium">Hero Section</span>
          </div>
          <ChevronRight className="h-4 w-4 text-zinc-600" />
          <div className="flex items-center">
            <span className="text-white font-semibold tracking-wide">Add New</span>
          </div>
        </nav>

        <div className="flex gap-3">
          <button 
            type="button" 
            onClick={() => router.back()}
            className="flex items-center gap-2 bg-zinc-800 text-zinc-300 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-zinc-700 transition-all"
          >
            <X className="h-4 w-4" /> Cancel
          </button>
          <button 
            type="submit"
            disabled={addMutation.isPending}
            className="flex items-center gap-2 bg-[#c7d300] text-black px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#b0ba00] transition-all shadow-[0_0_20px_rgba(199,211,0,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {addMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Hero
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Image & Media */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-[#212121] border-zinc-800/60 shadow-xl border-t-2 border-t-[#c7d300]/20">
            <CardHeader className="bg-zinc-800/20 py-5 px-6 border-b border-zinc-800/50">
              <CardTitle className="text-lg font-bold text-white flex items-center">
                <ImageIcon className="mr-2 h-5 w-5 text-[#c7d300]" /> Hero Media
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <input
                  type="file"
                  ref={imageInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />

                <div
                  onClick={() => imageInputRef.current?.click()}
                  className={`w-full aspect-video rounded-xl border-2 border-dashed border-zinc-800 ${
                    imageFile ? "border-[#c7d300]/40 bg-[#c7d300]/5" : "bg-zinc-900/50"
                  } flex flex-col items-center justify-center text-zinc-500 hover:border-[#c7d300]/40 transition-all cursor-pointer group`}
                >
                  <div className="p-4 bg-zinc-800 rounded-full group-hover:scale-110 transition-transform">
                    <Plus className="h-6 w-6" />
                  </div>
                  <span className="mt-3 text-xs font-medium px-4 text-center truncate w-full">
                    {imageFile ? imageFile.name : "Upload Background Image"}
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    Overlay Opacity (%)
                  </label>
                  <input
                    type="number"
                    {...register("overlayOpacity", { valueAsNumber: true })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-[#c7d300]/50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-[#212121] border-zinc-800/60 shadow-xl border-t-2 border-t-[#c7d300]/20">
            <CardHeader className="bg-zinc-800/20 py-5 px-6 border-b border-zinc-800/50">
              <CardTitle className="text-lg font-bold text-white flex items-center">
                <Type className="mr-2 h-5 w-5 text-[#c7d300]" /> Text Content
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  Typing Animation Lines (Comma Separated)
                </label>
                <textarea
                  {...register("typingAnimationLines")}
                  placeholder="Welcome to My Portfolio, I am a Developer"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-[#c7d300]/50 transition-all h-24"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Title Line 1</label>
                  <input
                    type="text"
                    {...register("titleLine1")}
                    placeholder="Hi, I'm Tanvir Ahmmed"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Title Line 2</label>
                  <input
                    type="text"
                    {...register("titleLine2")}
                    placeholder="Full Stack Developer"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Hero Description</label>
                <textarea
                  {...register("description")}
                  placeholder="Tell your story..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none h-32"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#212121] border-zinc-800/60 shadow-xl border-t-2 border-t-[#c7d300]/20">
            <CardHeader className="bg-zinc-800/20 py-5 px-6 border-b border-zinc-800/50">
              <CardTitle className="text-lg font-bold text-white flex items-center">
                <MousePointer2 className="mr-2 h-5 w-5 text-[#c7d300]" /> CTA Buttons
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* CV Button */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-zinc-300 border-l-2 border-[#c7d300] pl-2 uppercase tracking-wide">
                  Primary Button (CV)
                </h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    {...register("primaryBtnText")}
                    placeholder="Button Text (e.g. Download CV)"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-white"
                  />
                  <input
                    type="file"
                    ref={cvInputRef}
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                  />
                  <div
                    onClick={() => cvInputRef.current?.click()}
                    className={`w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm flex justify-between items-center cursor-pointer transition-all ${
                      cvFile ? "text-[#c7d300] border-[#c7d300]/30" : "text-zinc-500"
                    }`}
                  >
                    <span className="truncate w-40">{cvFile ? cvFile.name : "Upload CV File"}</span>
                    <Plus className="h-4 w-4" />
                  </div>
                </div>
              </div>

              {/* Video Button */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-zinc-300 border-l-2 border-[#c7d300] pl-2 uppercase tracking-wide">
                  Secondary Button (Video)
                </h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    {...register("secondaryBtnText")}
                    placeholder="Button Text (e.g. Watch Video)"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-white"
                  />
                  <input
                    type="text"
                    {...register("videoUrl")}
                    placeholder="Video URL Link"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}

export default AddHero;