import React from "react";

interface AdminHeaderProps {
  pageTitle: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ pageTitle }) => {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center gap-x-4">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
          {pageTitle}
        </h1>
      </div>
    </header>
  );
};
