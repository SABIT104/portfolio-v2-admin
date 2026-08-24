import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { 
  PlusCircle, 
  FileText, 
  Settings, 
  UserCircle, 
  ArrowRight 
} from "lucide-react"
import Link from 'next/link'

const ctaItems = [
  {
    title: "New Project",
    description: "Launch a new project entry",
    icon: <PlusCircle className="h-6 w-6" />,
    link: "/projects",
    bg: "hover:border-[#c7d300]/50"
  },
  {
    title: "Write Blog",
    description: "Share your latest technical logic",
    icon: <FileText className="h-6 w-6" />,
    link: "/knowledge",
    bg: "hover:border-[#c7d300]/50"
  },
  {
    title: "Explore Skills",
    description: "Update your personal branding",
    icon: <Settings className="h-6 w-6" />,
    link: "/skill",
    bg: "hover:border-[#c7d300]/50"
  },
  {
    title: "See MY Expriences",
    description: "Check how the world sees you",
    icon: <UserCircle className="h-6 w-6" />,
    link: "/experience",
    bg: "hover:border-[#c7d300]/50"
  }
]

function CTSSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
      {ctaItems.map((item, index) => (
        <Link href={item.link} key={index} className="block group">
          <Card className={`bg-[#212121] border-zinc-800/60 transition-all duration-300 shadow-xl overflow-hidden relative ${item.bg}`}>
            
            {/* Animated background glow */}
            <div className="absolute -right-8 -top-8 h-24 w-24 bg-[#c7d300]/5 rounded-full blur-3xl group-hover:bg-[#c7d300]/10 transition-all duration-500" />

            <CardContent className="p-6 relative z-10">
              <div className="flex flex-col space-y-4">
                {/* Icon wrapper */}
                <div className="bg-zinc-900/80 text-[#c7d300] w-12 h-12 rounded-xl flex items-center justify-center border border-zinc-800 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>

                <div>
                  <h3 className="text-white font-bold text-lg tracking-tight group-hover:text-[#c7d300] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-zinc-500 text-sm mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Footer link indicator */}
                <div className="flex items-center text-[#c7d300] text-xs font-bold uppercase tracking-widest pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Go to section <ArrowRight className="ml-2 h-3 w-3" />
                </div>
              </div>
            </CardContent>

            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#c7d300] transition-all duration-500 group-hover:w-full" />
          </Card>
        </Link>
      ))}
    </div>
  )
}

export default CTSSection