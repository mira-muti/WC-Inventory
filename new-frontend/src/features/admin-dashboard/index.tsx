import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AdminHeader } from "./components/admin-header";
import { navItems } from "./constants/navItems";
import { Sidebar } from "./components/sidebar";

const AdminDashboard: React.FC = () => {
  const location = useLocation();

  const getCurrentPageTitle = () => {
    const currentItem = navItems.find(
      (item) => item.href === location.pathname,
    );
    return currentItem?.title || "Admin Dashboard";
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="pl-72 w-full">
        <AdminHeader pageTitle={getCurrentPageTitle()} />
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
