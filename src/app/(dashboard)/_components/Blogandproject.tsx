/* eslint-disable @typescript-eslint/no-explicit-any */
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
import {
  FolderGit2,
  BookOpenText,
  ArrowUpRight,
  Circle,
  Clock,
  Loader2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

function Blogandproject() {
  // ১. Recent Projects Fetch করা হচ্ছে
  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["recent-projects"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/dashboard/recent-project`,
      );
      const result = await res.json();
      return result.data;
    },
  });

  // ২. Recent Knowledge/Blogs Fetch করা হচ্ছে
  const { data: blogs, isLoading: blogsLoading } = useQuery({
    queryKey: ["recent-knowledge"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/dashboard/recent-Knowledge`,
      );
      const result = await res.json();
      return result.data;
    },
  });

  return (
    <div className="space-y-10 mt-10">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Recent Projects Table */}
          <Card className="bg-[#212121] border-zinc-800/60 shadow-2xl overflow-hidden border-t-2 border-t-[#c7d300]/20">
            <CardHeader className="flex flex-row items-center justify-between bg-zinc-800/20 py-6 px-8 border-b border-zinc-800/50">
              <CardTitle className="text-xl font-bold text-white flex items-center tracking-tight">
                <FolderGit2 className="mr-3 h-6 w-6 text-[#c7d300]" /> Recent
                Projects
              </CardTitle>
              <Link href="/projects">
                <div className="p-2 hover:bg-zinc-800 rounded-full transition-colors cursor-pointer group">
                  <ArrowUpRight className="h-5 w-5 text-zinc-500 group-hover:text-[#c7d300]" />
                </div>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {projectsLoading ? (
                <div className="p-10 flex justify-center">
                  <Loader2 className="animate-spin text-[#c7d300]" />
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-zinc-900/40">
                    <TableRow className="border-zinc-800 hover:bg-transparent">
                      <TableHead className="text-zinc-400 py-3 pl-8 font-semibold uppercase text-xs tracking-wider">
                        Project
                      </TableHead>
                      <TableHead className="text-zinc-400 py-3 font-semibold uppercase text-xs tracking-wider">
                        Category
                      </TableHead>
                      <TableHead className="text-zinc-400 py-3 font-semibold uppercase text-xs tracking-wider">
                        Status
                      </TableHead>
                      <TableHead className="text-zinc-400 py-3 pr-8 font-semibold uppercase text-xs tracking-wider text-right">
                        Links
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects?.map((project: any, i: number) => (
                      <TableRow
                        key={i}
                        className="border-zinc-800/40 hover:bg-[#c7d300]/5 transition-all duration-300 group"
                      >
                        <TableCell className="py-3 pl-8">
                          <div className="font-semibold text-zinc-100 text-base group-hover:text-[#c7d300] transition-colors">
                            {project.title}
                          </div>
                          <div className="text-xs text-zinc-500 mt-1">
                            {project.tags?.[0] || "No Tags"}
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-zinc-700 text-zinc-400 bg-zinc-800/50">
                            {project.category}
                          </span>
                        </TableCell>
                        <TableCell className="py-3">
                          <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tighter bg-[#c7d300]/10 text-[#c7d300]">
                            <Circle className="h-2 w-2 mr-2 fill-current animate-pulse" />
                            Live
                          </span>
                        </TableCell>
                        <TableCell className="py-3 pr-8 text-right">
                          <div className="flex items-center justify-end text-zinc-500 text-xs font-mono italic">
                            {project.links?.[0]?.title || "N/A"}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Recent Blogs/Knowledge Table */}
          <Card className="bg-[#212121] border-zinc-800/60 shadow-2xl overflow-hidden border-t-2 border-t-[#c7d300]/20">
            <CardHeader className="flex flex-row items-center justify-between bg-zinc-800/20 py-6 px-8 border-b border-zinc-800/50">
              <CardTitle className="text-xl font-bold text-white flex items-center tracking-tight">
                <BookOpenText className="mr-3 h-6 w-6 text-[#c7d300]" /> Recent
                Knowledge
              </CardTitle>
              <Link href="/knowledge">
                <div className="p-2 hover:bg-zinc-800 rounded-full transition-colors cursor-pointer group">
                  <ArrowUpRight className="h-5 w-5 text-zinc-500 group-hover:text-[#c7d300]" />
                </div>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {blogsLoading ? (
                <div className="p-10 flex justify-center">
                  <Loader2 className="animate-spin text-[#c7d300]" />
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-zinc-900/40">
                    <TableRow className="border-zinc-800 hover:bg-transparent">
                      <TableHead className="text-zinc-400 py-3 pl-8 font-semibold uppercase text-xs tracking-wider">
                        Title
                      </TableHead>
                      <TableHead className="text-zinc-400 py-3 font-semibold uppercase text-xs tracking-wider">
                        Category
                      </TableHead>
                      <TableHead className="text-zinc-400 py-3 pr-8 text-right font-semibold uppercase text-xs tracking-wider">
                        Created At
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blogs?.map((blog: any, i: number) => (
                      <TableRow
                        key={i}
                        className="border-zinc-800/40 hover:bg-[#c7d300]/5 transition-all duration-300 group"
                      >
                        <TableCell className="py-3 pl-8">
                          <div className="font-semibold text-zinc-100 text-base group-hover:text-[#c7d300] transition-colors truncate max-w-[200px]">
                            {blog.title}
                          </div>
                          <div className="text-[10px] text-zinc-600 mt-1 uppercase tracking-widest truncate max-w-[200px]">
                            {blog.shortDescription}
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <span className="text-[#c7d300] text-xs font-bold bg-[#c7d300]/5 px-2 py-1 rounded border border-[#c7d300]/10">
                            {blog.category}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 pr-8 text-right">
                          <div className="flex items-center justify-end text-zinc-500 text-xs font-mono">
                            <Clock className="h-3 w-3 mr-1.5 text-zinc-600" />
                            {new Date(blog.createdAt).toLocaleDateString(
                              "en-GB",
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Blogandproject;
