import {
  FileClock,
  HandHeart,
  LayoutDashboard,
  MapPin,
  PackagePlus,
  PackageSearch,
  Ruler,
  Shirt,
  Tags,
  Users,
} from "lucide-react";
import { NavItem } from "../types";

export const navItems: NavItem[] = [
  {
    title: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
    description: "Overview component",
  },
  {
    title: "Inventory",
    href: "/admin/inventory",
    icon: Shirt,
    description: "View your inventory items",
  },
  {
    title: "Box lookup",
    href: "/admin/box-lookup",
    icon: PackageSearch,
    description: "Manage your inventory boxes",
  },
  {
    title: "Create boxes",
    href: "/admin/create-boxes",
    icon: PackagePlus,
    description: "Create or add items to existing boxes",
  },
  {
    title: "Activity Log",
    href: "/admin/activity-log",
    icon: FileClock,
    description: "View activity log",
  },
  // {
  //   title: "Donations",
  //   href: "/admin/donations",
  //   icon: HandHeart,
  //   description: "View past donations",
  // },
  {
    title: "Location Management",
    href: "/admin/locations",
    icon: MapPin,
    description: "Define and organize locations",
  },
  {
    title: "Category Management",
    href: "/admin/categories",
    icon: Tags,
    description: "Define and organize categories",
  },
  {
    title: "Size Management",
    href: "/admin/sizes",
    icon: Ruler,
    description: "Define and organize sizes",
  },

  {
    title: "User Management",
    href: "/admin/users",
    icon: Users,
    description: "Manage users and permissions",
  },
];
