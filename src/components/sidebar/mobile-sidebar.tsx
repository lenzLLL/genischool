"use client";
import { Menu } from "@/components/admin-panel/menu";
import { SidebarToggle } from "@/components/admin-panel/sidebar-toggle";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { AuthSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { PanelsTopLeft, X } from "lucide-react";
import Link from "next/link";

export function MobileSidebar({user,onClose}:{user:AuthSchema|null,onClose:(v:boolean)=>void}) {
  const sidebar = useStore(useSidebar, (x:any) => x);
  if (!sidebar) return null;
  const { isOpen, toggleOpen, getOpenState, setIsHover, settings } = sidebar;
  return (
    <div
      className={cn(
        "block lg:hidden h-screen  fixed top-0 left-0 z-[99999] bg-white right-0",
        !getOpenState() ? "w-[90px]" : "w-[200px]",
        settings.disabled && "hidden"
      )}
    >

      {/* <SidebarToggle isOpen={isOpen} setIsOpen={toggleOpen} /> */}
      <X onClick={()=>onClose(true)} className="m-2 cursor-pointer absolute z-[9999999]"/> 
      <div
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className="relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-zinc-800"
      >
        <Button
          className={cn(
            "transition-transform ease-in-out duration-300 mb-1",
            !getOpenState() ? "translate-x-1" : "translate-x-0"
          )}
          variant="link"
          asChild
        >
          <Link href="/admin" className="flex items-center gap-2">
            <PanelsTopLeft className="w-6 h-6 mr-1" />
            <h1
              className={cn(
                "font-bold text-lg whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300",
                !getOpenState()
                  ? "-translate-x-96 opacity-0 hidden"
                  : "translate-x-0 opacity-100"
              )}
            >
              school
            </h1>
          </Link>
        </Button>
        <Menu user = {user} isOpen={getOpenState()} />
      </div>
    </div>
  );
}
