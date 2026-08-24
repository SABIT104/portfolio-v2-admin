/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  ClipboardList,
  Cpu,
  Crown,
  FileText,
  Hash,
  Home,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  User,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "Dashboard Overview", href: "/", icon: LayoutDashboard },
  {
    name: "Homehero Section",
    href: "/home-hero",
    icon: Home,
  },
  {
    name: "About Me Section",
    href: "/about",
    icon: User,
  },
  {
    name: "My Skills Section",
    href: "/skill",
    icon: Cpu,
  },
  {
    name: "Resume Section",
    href: "/resume",
    icon: FileText,
  },
  {
    name: "Projects Section",
    href: "/projects",
    icon: Briefcase,
  },
  {
    name: "Experience Section",
    href: "/experience",
    icon: ClipboardList,
  },
  {
    name: "Recruiter Feedback",
    href: "/recruiter-feedback",
    icon: Crown,
  },
  {
    name: "Knowledge & Blogs",
    href: "/knowledge",
    icon: Hash,
  },
  {
    name: "Contact Section",
    href: "/contact",
    icon: MessageSquare,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen sticky bottom-0 top-0 w-[350px] flex-col bg-[#212121] z-50">
      {/* Logo */}
      <div className="h-[80px] flex items-center justify-start ml-3">
        <div className="text-5xl gap-1 font-bold text-blue-600 uppercase tracking-wider w-full flex items-center justify-center">
          <h1 className="text-center">Tanvir</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-3 flex flex-col items-center justify-start px-3 overflow-y-auto mt-3">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex w-[94%] mx-auto items-center justify-start gap-2 space-y-1 rounded-[4px] px-3 py-2 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-white text-black"
                  : "text-slate-300 hover:bg-slate-600/50 hover:text-white",
              )}
            >
              <item.icon
                className={cn(
                  "h-6 w-6 transition-colors duration-200",
                  isActive ? "text-black" : "",
                )}
              />
              <span
                className={cn(
                  "font-normal text-base leading-[120%] transition-colors duration-200 text-center",
                  isActive ? "text-black font-medium" : "",
                )}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Logout fixed at bottom */}
      <div className="p-6">
        <div
          onClick={() => setOpen(true)}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-slate-600/50 hover:text-white cursor-pointer"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-normal text-base leading-none">Log Out</span>
        </div>
      </div>

      {/* <LogoutModal
        open={open}
        onClose={() => setOpen(false)}
      /> */}
    </div>
  );
}
