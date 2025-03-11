"use client";

import Link from "next/link";
import { Ellipsis, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CollapseMenuButton } from "@/components/admin-panel/collapse-menu-button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from "@/components/ui/tooltip";
import { getMenuList } from "@/lib/menu-list";
import { AuthSchema } from "@/lib/schemas";
import { logOut } from "@/lib/functs";
import { toast } from "react-toastify";
interface MenuProps {
  isOpen: boolean | undefined;
  user:AuthSchema
}

export function Menu({ isOpen,user }: MenuProps) {
  const pathname = usePathname();
  const menuList = getMenuList(pathname);
  const signout = async () =>{
    let msg = user?.lang === "Français" ? "Déconnexion réussie":"Logout successful"
    await logOut().then(
        ()=>{
            toast.success(msg)
            
        }
      )  
  }
  return (
      <ScrollArea>
      <nav className="mt-2 h-full w-full">
        <ul className="flex pb-5 flex-col min-h-[calc(100vh-48px-36px-16px-22px)]  lg:min-h-[calc(100vh-32px-40px-22px)] items-start space-y-1 px-2">
          {menuList.map(({ groupLabel, menus }, index) => (
            <li className={cn("w-full", groupLabel ? "pt-5" : "")} key={index}>
              {(isOpen && groupLabel) || isOpen === undefined ? (
                <p className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate">
                  {groupLabel}
                </p>
              ) : !isOpen && isOpen !== undefined && groupLabel  ? (
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger className="w-full">
                      <div className="w-full flex justify-center items-center">
                        <Ellipsis className="h-5 w-5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{groupLabel}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <p className="pb-2"></p>
              )}
              {menus.map(
                ({ href, label, icon: Icon, active,libelle, submenus,visible }, index) =>
                  (!submenus || submenus.length === 0) && visible?.includes(user?.role||"yes")   ? (
                    <div className="w-full" key={index}>
                      <TooltipProvider disableHoverableContent>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <Button
                              variant={
                                (active === undefined &&
                                  pathname.startsWith(href)) ||
                                active
                                  ? "secondary"
                                  : "ghost"
                              }
                              className={`${(pathname.startsWith(href)|| active)?"bg-blue-500 hover:bg-blue-500 shadow-sm text-white":""}  w-full justify-start h-10 mb-1`}
                              asChild
                            >
                              <Link href={href}>
                                <span
                                  className={cn(isOpen === false ? "" : "mr-4")}
                                >
                                  <Icon size={18} />
                                </span>
                                <p
                                  className={cn(
                                    "max-w-[200px] truncate",
                                    isOpen === false
                                      ? "-translate-x-96 opacity-0"
                                      : "translate-x-0 opacity-100"
                                  )}
                                >
                                  {user?.lang === "Français"? libelle:label}
                                </p>
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          {isOpen === false && (
                            <TooltipContent side="right">
                              {label}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ) :!(!submenus || submenus.length === 0)? (
                    <div className="w-full " key={index}>
                      <CollapseMenuButton
                        icon={Icon}
                        label={user?.lang === "Français"? libelle:label}
                        active={
                          active === undefined
                            ? pathname.startsWith(href)
                            : active
                        }
                        submenus={submenus}
                        isOpen={isOpen}
                      />
                    </div>
                  ):null
              )}
            </li>
          ))}
           <li className="flex-1">

           </li>
            <li className="w-full flex  ">
            <TooltipProvider disableHoverableContent>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={signout}
                    variant="outline"
                    className="w-full bg-blue-400 text-white hover:bg-blue-700 hover:shadow-md hover:text-white justify-center h-10"
                  >
                    <span className={cn(isOpen === false ? "" : "mr-4")}>
                      <LogOut size={18} />
                    </span>
                    <p
                      className={cn(
                        "whitespace-nowrap",
                        isOpen === false ? "opacity-0 hidden" : "opacity-100"
                      )}
                    >
                      {user?.lang !== "Français"? 'Sign out':'Déconnecter'}
                    </p>
                  </Button>
                </TooltipTrigger>
                {isOpen === false && (
                  <TooltipContent side="right">Sign out</TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </li>
        </ul>
  
      </nav>
      </ScrollArea>
  );
}
