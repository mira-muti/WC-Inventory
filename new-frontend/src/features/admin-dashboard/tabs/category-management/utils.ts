import { Category } from "@/types/category";


export interface CategoryWithChildren extends Category {
  children?: CategoryWithChildren[];
  isExpanded?: boolean;
}

export const matchesFilter = (category: CategoryWithChildren, filter: string): boolean => {
    const directMatch =
      category.name.toLowerCase().includes(filter.toLowerCase()) ||
      (category.description?.toLowerCase() ?? "").includes(filter.toLowerCase());

    if (category.children && category.children.length > 0) {
      return directMatch || category.children.some((child) => matchesFilter(child, filter));
    }

    return directMatch;
  };

  export function buildHierarchy(categories: Category[]): CategoryWithChildren[] {
    const categoryMap = new Map<string, CategoryWithChildren>();
  
    // Initialize map
    categories.forEach((cat) => {
      categoryMap.set(cat.category_id, { ...cat, children: [] });
    });
  
    // Build relationships
    const roots: CategoryWithChildren[] = [];
    categories.forEach((cat) => {
      const node = categoryMap.get(cat.category_id)!;
      if (cat.parent_id) {
        const parent = categoryMap.get(cat.parent_id);
        if (parent) parent.children.push(node);
      } else {
        roots.push(node);
      }
    });
  
    // Recursively assign levels
    const assignLevels = (node: CategoryWithChildren, level = 1) => {
      node.level = level;
      node.children.forEach((child) => assignLevels(child, level + 1));
    };
    roots.forEach((root) => assignLevels(root, 1));
  
    return roots;
  }
  