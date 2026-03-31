import { type FC, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ChevronRight, ChevronDown } from "lucide-react";
import { Category } from "@/types/category";
import { buildHierarchy, CategoryWithChildren, matchesFilter } from "../utils";
import React from "react";
import { getAllIcons, getIconCache } from "@/lib/iconLoader";

interface CategoriesTableProps {
  data: Category[] | undefined;
  filter: string;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
  expandedCategories: Set<string>;
  setExpandedCategories: React.Dispatch<React.SetStateAction<Set<string>>>;
}
const CategoriesTable: FC<CategoriesTableProps> = ({
  data = [],
  filter = "",
  onEdit,
  onDelete,
  expandedCategories,
  setExpandedCategories
}) => {
  const [iconsReady, setIconsReady] = useState(false);

  useEffect(() => {
    const loadIcons = async () => {
      try {
        await getAllIcons(); 
        setIconsReady(true);
      } catch (err) {
        console.error("Failed to load icons:", err);
      }
    };
    loadIcons();
  }, [data]);
  useEffect(() => {
    if (filter) {
      const categoryMap = new Map<string, CategoryWithChildren>();
      data.forEach(category => {
        categoryMap.set(category.category_id, { ...category, children: [] });
      });

      const toExpand = new Set<string>();
      data.forEach(category => {
        if (matchesFilter({ ...category, children: [] }, filter)) {
          let currentId = category.parent_id;
          while (currentId) {
            toExpand.add(currentId);
            const parent = categoryMap.get(currentId);
            currentId = parent?.parent_id || null;
          }
        }
      });

      setExpandedCategories(toExpand);
    } else {
      setExpandedCategories(new Set());
    }
  }, [filter]);

  const hierarchicalCategories = buildHierarchy(data);

  const toggleExpand = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  };

  const renderCategoryRow = (
    category: CategoryWithChildren,
    level: number = 0
  ) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.category_id);

  
    if (filter && !matchesFilter(category, filter)) return null;
    const cachedIcons = getIconCache();
    const iconKey = category.icon?.toLowerCase() || "";
    const matched = cachedIcons?.find(
      (icon) => icon.name.toLowerCase() === iconKey
    );
    const iconSrc = matched?.data || "/src/assets/category_icons/Folder.svg";
  
    return (
      <React.Fragment key={category.category_id}>
        <TableRow className="hover:bg-gray-50">

          <TableCell className="w-[140px]">
            <div
              className="flex items-center h-full"
              style={{
                paddingLeft: `${level * 1.25}rem`,
                transition: "padding-left 0.2s ease",
              }}
            >
              <div className="flex items-center justify-center w-5 h-5 mr-2">
                {hasChildren ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(category.category_id);
                    }}
                    className="flex items-center justify-center h-5 w-5"
                  >
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                ) : (
                  <span className="block w-5 h-5" />
                )}
              </div>


              <div className="flex items-center justify-center h-5 w-5">
                <img
                        src={iconSrc || "/src/assets/category_icons/Folder.svg"}
                        alt={category.icon!}
                        className="h-4 w-4 object-contain"
                        onError={(e) =>
                          ((e.currentTarget as HTMLImageElement).src =
                            "/src/assets/category_icons/Folder.svg")
                        }
                />
              </div>
            </div>
          </TableCell>


          <TableCell className="font-medium">{category.name}</TableCell>
  
          <TableCell>{category.description || "-"}</TableCell>
  
          <TableCell>{category.level}</TableCell>
  
          <TableCell className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(category)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => onDelete(category.category_id)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
  
        {hasChildren && isExpanded &&
          category.children.map((child) => renderCategoryRow(child, level + 1))}
      </React.Fragment>
    );
  };

  return (
    <div className="rounded-md border bg-white">
      <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[140px] pl-8">Icon</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Level</TableHead>
          <TableHead className="w-[70px] text-right">Options</TableHead>
        </TableRow>
      </TableHeader>
        <TableBody>
          {hierarchicalCategories.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground h-24"
              >
                No categories found
              </TableCell>
            </TableRow>
          ) : (
            hierarchicalCategories.map(category => renderCategoryRow(category))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategoriesTable;
