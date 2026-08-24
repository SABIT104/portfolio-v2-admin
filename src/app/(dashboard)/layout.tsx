// import AppProvider from "@/provider/AppProvider";
import Header from "@/components/header/Header";
import { Sidebar } from "@/components/sidebar/Sidebar";
import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="w-full mt-[80px] p-6 bg-[#121212]">
          {/* <AppProvider> */}
            {children}
            {/* </AppProvider> */}
        </div>
      </div>
    </>
  );
}

export default layout;
