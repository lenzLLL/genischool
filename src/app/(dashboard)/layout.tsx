import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import { Sidebar } from "@/components/sidebar/sidebar";
import { useSidebar } from "@/hooks/use-sidebar";
import Image from "next/image";
import Link from "next/link";
import React,{useState} from "react"
import { useStore } from "zustand";
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div className="h-auto flex">
      {/* LEFT */}
      {/* <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4"> */}
        {/* <Link
          href="/"
          className="flex items-center justify-center lg:justify-start gap-2"
        >
          <Image src="/logo.png" alt="logo" width={32} height={32} />
          <span className="hidden lg:block font-bold">SchooLama</span>
        </Link> */}
        <Sidebar  />
      {/* </div> */}
      {/* RIGHT */}
      <div className={` lg:flex-1 w-[100%] z-[0] pt-20 lg:pt-0 bg-[#F7F8FA] overflow-scroll flex flex-col`}>
        <Navbar />
        {children}
      </div>
    </div>
  );
}
