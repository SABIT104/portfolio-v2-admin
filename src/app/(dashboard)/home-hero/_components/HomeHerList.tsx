"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import {
  LayoutDashboard,
  ChevronRight,
  Plus,
  Edit,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { ViewHero } from "./ViewHero";
import { DeleteModule } from "@/components/DeleteModule";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import Image from "next/image";
import { toast } from "sonner";

// --- TypeScript Interfaces ---

interface HeroItem {
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
  createdAt: string;
  updatedAt: string;
}

interface HeroListResponse {
  status: boolean;
  message: string;
  data: {
    heroes: HeroItem[];
    paginationInfo: {
      currentPage: number;
      totalPages: number;
      totalData: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

interface TogglePayload {
  id: string;
  isActive: boolean;
}

// --- Component ---

function HomeHerList() {
  const queryClient = useQueryClient();

  // 1. Fetch Hero Data with TS Interface
  const { data: heroResponse, isLoading } = useQuery<HeroListResponse>({
    queryKey: ["hero"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/home/getallHomeContent`,
      );
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const heroes = heroResponse?.data?.heroes || [];

  // 2. Toggle Status Mutation with TS
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toggleMutation: UseMutationResult<any, Error, TogglePayload> =
    useMutation({
      mutationFn: async ({ id, isActive }: TogglePayload) => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/home/toggleheroupdate/${id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isActive }),
          },
        );
        if (!res.ok) throw new Error("Failed to update");
        return res.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["hero"] });
        toast.success("Status updated successfully");
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to update status");
      },
    });

  const handleToggle = (id: string, currentStatus: boolean) => {
    toggleMutation.mutate({ id, isActive: !currentStatus });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-[#c7d300]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <nav className="flex items-center space-x-2 text-sm bg-[#212121]/30 w-fit px-5 py-2.5 rounded-full border border-zinc-800">
          <div className="flex items-center text-zinc-400 hover:text-[#c7d300] transition-colors cursor-pointer">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            <span className="font-medium">Dashboard</span>
          </div>
          <ChevronRight className="h-4 w-4 text-zinc-600" />
          <div className="flex items-center">
            <span className="text-white font-semibold tracking-wide">
              Hero Section
            </span>
            <span className="ml-2 h-1.5 w-1.5 rounded-full bg-[#c7d300] animate-pulse"></span>
          </div>
        </nav>

        <Link href="/home-hero/add-hero">
          <button className="flex items-center gap-2 bg-[#c7d300] text-black px-6 py-3 rounded-xl font-bold text-base hover:bg-[#b0ba00] transition-all shadow-[0_0_20px_rgba(199,211,0,0.15)]">
            <Plus className="h-5 w-5" />
            Add Hero
          </button>
        </Link>
      </div>

      {/* Hero Data Table */}
      <Card className="bg-[#212121] border-zinc-800/60 shadow-2xl overflow-hidden border-t-2 border-t-[#c7d300]/20">
        <CardHeader className="bg-zinc-800/20 py-7 px-8 border-b border-zinc-800/50">
          <CardTitle className="text-2xl font-bold text-white tracking-tight">
            Hero Content Management
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-zinc-900/60">
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  <TableHead className="text-zinc-400 py-6 pl-8 font-bold uppercase text-xs tracking-widest">
                    Preview
                  </TableHead>
                  <TableHead className="text-zinc-400 py-6 font-bold uppercase text-xs tracking-widest">
                    Main Content
                  </TableHead>
                  <TableHead className="text-zinc-400 py-6 font-bold uppercase text-xs tracking-widest">
                    Status & Toggle
                  </TableHead>
                  <TableHead className="text-zinc-400 py-6 pr-8 text-right font-bold uppercase text-xs tracking-widest">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {heroes.length > 0 ? (
                  heroes.map((hero: HeroItem) => (
                    <TableRow
                      key={hero._id}
                      className="border-zinc-800/40 hover:bg-[#c7d300]/5 transition-all duration-500 group"
                    >
                      {/* Image Preview */}
                      <TableCell className="py-8 pl-8">
                        <div className="relative h-16 w-28 rounded-xl overflow-hidden border-2 border-zinc-800 bg-zinc-900 flex items-center justify-center group-hover:border-[#c7d300]/30 transition-all">
                          {hero.backgroundImage ? (
                            <Image
                              src={hero.backgroundImage}
                              alt="Hero"
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <ImageIcon className="h-6 w-6 text-zinc-700" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>
                      </TableCell>

                      {/* Titles & Tags */}
                      <TableCell className="py-8 min-w-[300px]">
                        <div className="font-bold text-zinc-100 text-lg group-hover:text-[#c7d300] transition-colors">
                          {hero.titleLine1}
                        </div>
                        <div className="text-sm text-zinc-500 mt-1 font-medium">
                          {hero.titleLine2}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {hero.typingAnimationLines?.map(
                            (text: string, i: number) => (
                              <span
                                key={i}
                                className="bg-zinc-900 text-zinc-400 text-[11px] px-3 py-1 rounded-md border border-zinc-800 font-mono"
                              >
                                {text}
                              </span>
                            ),
                          )}
                        </div>
                      </TableCell>

                      {/* Status & Switch */}
                      <TableCell className="py-8">
                        <div className="flex items-center gap-4">
                          <Switch
                            checked={hero.isActive}
                            onCheckedChange={() =>
                              handleToggle(hero._id, hero.isActive)
                            }
                            disabled={toggleMutation.isPending}
                            className="data-[state=checked]:bg-[#c7d300]"
                          />
                          <span
                            className={`text-xs font-black uppercase tracking-widest ${
                              hero.isActive ? "text-[#c7d300]" : "text-zinc-600"
                            }`}
                          >
                            {hero.isActive ? "Enabled" : "Disabled"}
                          </span>
                        </div>
                      </TableCell>

                      {/* Action Buttons */}
                      <TableCell className="py-8 pr-8 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <ViewHero id={hero._id} />
                          <Link href={`/home-hero/edit-hero/${hero._id}`}>
                            <button className="p-3 bg-zinc-900 text-zinc-500 hover:text-[#c7d300] hover:bg-[#c7d300]/10 rounded-xl border border-zinc-800 transition-all">
                              <Edit className="h-5 w-5" />
                            </button>
                          </Link>
                          <DeleteModule
                            id={hero._id}
                            endpoint="/home/deleteHomeContent"
                            queryKey={["hero"]}
                            itemName="Hero Section"
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-10 text-center text-zinc-500"
                    >
                      No hero content found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default HomeHerList;
