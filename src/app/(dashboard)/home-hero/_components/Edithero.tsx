/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useRef, useState, useEffect } from "react";
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
import { useParams, useRouter } from "next/navigation";
import {
  useMutation,
  useQuery,
  UseMutationResult,
} from "@tanstack/react-query";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import Image from "next/image";

// --- TypeScript Interfaces ---
interface HeroFormInputs {
  overlayOpacity: number;
  typingAnimationLines: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  primaryBtnText: string;
  secondaryBtnText: string;
  videoUrl: string;
}

interface HeroData {
  _id: string;
  backgroundImage: string;
  overlayOpacity: number;
  typingAnimationLines: string[];
  titleLine1: string;
  titleLine2: string;
  description: string;
  primaryBtnText: string;
  cvFileUrl: string | null;
  secondaryBtnText: string;
  videoUrl: string;
  isActive: boolean;
}

interface ApiResponse {
  status: boolean;
  message: string;
  data: HeroData;
}

function EditHero() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const cvInputRef = useRef<HTMLInputElement | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<HeroFormInputs>();

  // 1. Fetch Single Hero Data
  const { data: singleHero, isLoading } = useQuery<ApiResponse>({
    queryKey: ["singleHero", id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/home/getSingleHomeContent/${id}`,
      );
      if (!res.ok) throw new Error("Failed to fetch hero data");
      return res.json();
    },
    enabled: !!id,
  });

  // 2. Set Default Values in Form when data arrives
  useEffect(() => {
    if (singleHero?.data) {
      const hero = singleHero.data;
      setValue("overlayOpacity", hero.overlayOpacity);
      setValue("typingAnimationLines", hero.typingAnimationLines.join(", "));
      setValue("titleLine1", hero.titleLine1);
      setValue("titleLine2", hero.titleLine2);
      setValue("description", hero.description);
      setValue("primaryBtnText", hero.primaryBtnText);
      setValue("secondaryBtnText", hero.secondaryBtnText);
      setValue("videoUrl", hero.videoUrl);
    }
  }, [singleHero, setValue]);

  // 3. Edit Mutation
  const editMutation: UseMutationResult<ApiResponse, Error, FormData> =
    useMutation({
      mutationFn: async (formData: FormData) => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/home/updateHomeContent/${id}`,
          {
            method: "POST", // Update usually uses PUT or PATCH
            body: formData,
          },
        );
        if (!response.ok) throw new Error("Failed to update hero content");
        return response.json();
      },
      onSuccess: (data) => {
        if (data.status) {
          toast.success("Hero updated successfully!");
          router.push("/home-hero");
        }
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    });

  const onSubmit: SubmitHandler<HeroFormInputs> = (data) => {
    const formData = new FormData();
    const linesArray = data.typingAnimationLines
      .split(",")
      .map((line) => line.trim());

    const payload = {
      overlayOpacity: Number(data.overlayOpacity),
      typingAnimationLines: linesArray,
      titleLine1: data.titleLine1,
      titleLine2: data.titleLine2,
      description: data.description,
      primaryBtnText: data.primaryBtnText,
      secondaryBtnText: data.secondaryBtnText,
      videoUrl: data.videoUrl,
    };

    formData.append("data", JSON.stringify(payload));
    if (imageFile) formData.append("heroImage", imageFile);
    if (cvFile) formData.append("heroIcon", cvFile);

    editMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-[#c7d300]" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <nav className="flex items-center space-x-2 text-sm bg-[#212121]/30 w-fit px-5 py-2.5 rounded-full border border-zinc-800">
          <div
            onClick={() => router.push("/")}
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
            <span className="text-white font-semibold tracking-wide">
              Edit Hero
            </span>
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
            disabled={editMutation.isPending}
            className="flex items-center gap-2 bg-[#c7d300] text-black px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#b0ba00] transition-all shadow-[0_0_20px_rgba(199,211,0,0.2)] disabled:opacity-50"
          >
            {editMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Update Hero
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Media Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-[#212121] border-zinc-800/60 border-t-2 border-t-[#c7d300]/20">
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
                  className="w-full aspect-video rounded-xl border-2 border-dashed border-zinc-800 bg-zinc-900/50 flex flex-col items-center justify-center text-zinc-500 hover:border-[#c7d300]/40 transition-all cursor-pointer group relative overflow-hidden"
                >
                  {imageFile ? (
                    <span className="text-xs text-zinc-300 text-center px-4">
                      {imageFile.name}
                    </span>
                  ) : singleHero?.data?.backgroundImage ? (
                    <Image
                      width={500}
                      height={500}
                      src={singleHero.data.backgroundImage}
                      className="absolute inset-0 w-full h-full object-cover opacity-40"
                      alt="Preview"
                    />
                  ) : (
                    <Plus className="h-6 w-6" />
                  )}
                  <span className="mt-3 text-[10px] uppercase tracking-widest relative z-10">
                    Change Image
                  </span>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    Overlay Opacity (%)
                  </label>
                  <input
                    type="number"
                    {...register("overlayOpacity")}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-[#c7d300]/50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-[#212121] border-zinc-800/60 border-t-2 border-t-[#c7d300]/20">
            <CardHeader className="bg-zinc-800/20 py-5 px-6 border-b border-zinc-800/50">
              <CardTitle className="text-lg font-bold text-white flex items-center">
                <Type className="mr-2 h-5 w-5 text-[#c7d300]" /> Text Content
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  Typing Animation Lines
                </label>
                <textarea
                  {...register("typingAnimationLines")}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none h-24"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    Title Line 1
                  </label>
                  <input
                    type="text"
                    {...register("titleLine1")}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    Title Line 2
                  </label>
                  <input
                    type="text"
                    {...register("titleLine2")}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  Hero Description
                </label>
                <textarea
                  {...register("description")}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none h-32"
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons Card */}
          <Card className="bg-[#212121] border-zinc-800/60 border-t-2 border-t-[#c7d300]/20">
            <CardHeader className="bg-zinc-800/20 py-5 px-6 border-b border-zinc-800/50">
              <CardTitle className="text-lg font-bold text-white flex items-center">
                <MousePointer2 className="mr-2 h-5 w-5 text-[#c7d300]" /> CTA
                Buttons
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-zinc-300 border-l-2 border-[#c7d300] pl-2 uppercase tracking-wide">
                  Primary Button (CV)
                </h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    {...register("primaryBtnText")}
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
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-500 flex justify-between items-center cursor-pointer"
                  >
                    <span className="truncate w-40">
                      {cvFile
                        ? cvFile.name
                        : singleHero?.data?.cvFileUrl
                          ? "Change CV File"
                          : "Upload CV File"}
                    </span>
                    <Plus className="h-4 w-4" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-zinc-300 border-l-2 border-[#c7d300] pl-2 uppercase tracking-wide">
                  Secondary Button (Video)
                </h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    {...register("secondaryBtnText")}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-white"
                  />
                  <input
                    type="text"
                    {...register("videoUrl")}
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

export default EditHero;
