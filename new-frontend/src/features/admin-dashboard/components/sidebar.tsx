import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navItems } from "../constants/navItems";
import { SidebarNavItem } from "./sidebar-nav-item";

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <aside className="fixed inset-y-0 z-50 flex w-72 flex-col">
      <div className="flex flex-col flex-1 min-h-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 mx-2" />
          <span className="text-lg font-semibold dark:text-white">
            Admin Portal
          </span>
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {
                navItems.map((item) => { 
                  return (
                    <SidebarNavItem key={item.href} {...item} />
                  )
                })
            }
          </ul>
        </nav>
      </div>
    </aside>
  );
};
