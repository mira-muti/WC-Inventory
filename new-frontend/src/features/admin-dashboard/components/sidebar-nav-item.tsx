import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NavItem } from "../types";

export const SidebarNavItem: React.FC<NavItem> = ({
  href,
  icon: Icon,
  title,
  description,
}) => {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <li>
      <Link
        to={href}
        className={cn(
          "flex items-center gap-x-3 rounded-lg px-3 py-2 transition-colors",
          "hover:bg-gray-100 dark:hover:bg-gray-700",
          isActive && "bg-gray-100 dark:bg-gray-700",
        )}
      >
        <Icon
          className={cn(
            "h-5 w-5",
            isActive
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400",
          )}
        />
        <div className="flex flex-col">
          <span
            className={cn(
              "text-sm font-medium",
              isActive
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-200",
            )}
          >
            {title}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 hidden lg:inline-block">
            {description}
          </span>
        </div>
      </Link>
    </li>
  );
};
