import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronDown, Trash2 } from "lucide-react";
import type { Location } from "@/types/location";
import { NestedLocation } from "../utils";

export const useLocationColumns = (
  locations: Location[],
  onEdit: (location: Location) => void,
  onDelete: (id: string) => void
): ColumnDef<NestedLocation>[] =>
  useMemo(
    () => [
      {
        id: "name",
        header: "Name",
        cell: ({ row }) => (
          <div
            style={{ paddingLeft: `${row.depth * 2}rem` }}
            className="flex items-center gap-2"
          >
            {row.getCanExpand() ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-transparent"
                onClick={row.getToggleExpandedHandler()}
              >
                {row.getIsExpanded() ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            ) : (
              <div className="w-6" />
            )}
            <span>{row.original.name}</span>
          </div>
        ),
      },
      {
        id: "description",
        header: "Description",
        accessorFn: (row) => row.description,
        cell: ({ getValue }) => getValue() || "-",
      },
      {
        id: "level",
        header: "Level",
        accessorFn: (row) => row.level,
        cell: ({ getValue }) => getValue(),
      },
      {
        id: "parent_id",
        header: "Parent Location",
        accessorFn: (row) => row.parent_id,
        cell: ({ getValue }) => {
          const parentId = getValue();
          if (!parentId) return "-";
          const parent = locations.find((loc) => loc.location_id === parentId);
          return parent?.name || "-";
        },
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex gap-2 justify-end">
            <Button
              variant="ghost"
              size="sm"
              // TODO -> Disabled for now.
              // onClick={() => onEdit(row.original)}
              className="h-8 w-8 p-0"
            >
              <span>Edit</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(row.original.location_id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [locations, onEdit, onDelete]
  );
