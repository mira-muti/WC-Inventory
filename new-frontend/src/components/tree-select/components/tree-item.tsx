import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Location } from "@/types/location";

interface TreeItemProps {
  item: Location;
  items: ReadonlyArray<Location>;
  level: number;
  selectedId: string | null;
  expanded: string[];
  onToggle: (id: string) => void;
  onSelect: (id: string | null) => void;
  disabled?: boolean;
}

const TreeItem: React.FC<TreeItemProps> = ({
  item,
  items,
  level,
  selectedId,
  expanded,
  onToggle,
  onSelect,
  disabled = false,
}) => {
  // Find all direct children of this item.
  const children = items.filter(child => child.parent_id === item.location_id);
  const hasChildren = children.length > 0;
  const isExpanded = expanded.includes(item.location_id);
  const isSelected = selectedId === item.location_id;

  // Calculate left padding for indentation based on level
  const paddingLeft = level * 16 + (hasChildren ? 0 : 16);

  return (
    <div>
      <Button
        type="button"
        variant="ghost"
        className={cn(
          "w-full justify-start font-normal hover:bg-transparent gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-700",
          isSelected
            ? "bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-800"
            : ""
        )}
        style={{ paddingLeft }}
        onClick={() => onSelect(item.location_id)}
        disabled={disabled}
      >
        {/* Render a toggle icon if the item has children */}
        {hasChildren && (
          <span
            onClick={(e) => {
              e.stopPropagation(); // Prevent the parent's onClick from firing
              onToggle(item.location_id);
            }}
            className="flex items-center"
          >
            <ChevronRight
              className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-90")}
            />
          </span>
        )}
        <span className="truncate">{item.name}</span>
      </Button>

      {/* Render children recursively if expanded */}
      {hasChildren && isExpanded && (
        <div>
          {children.map((child) => (
            <TreeItem
              key={child.location_id}
              item={child}
              items={items}
              level={level + 1}
              selectedId={selectedId}
              expanded={expanded}
              onToggle={onToggle}
              onSelect={onSelect}
              disabled={disabled}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeItem;
