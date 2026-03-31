import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  flexRender,
  ExpandedState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { Location } from "@/types/location";
import { SearchBar } from "@/components/search-bar";
import { useLocationColumns } from "../hooks/use-location-columns";
import { NestedLocation, buildLocationTree } from "../utils";
import { Plus } from "lucide-react";

export interface LocationTableProps {
  locations: Location[];
  onEdit: (location: Location) => void;
  onDelete: (id: string) => void;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  onAdd: () => void;
}

export const LocationTable = ({
  locations,
  onEdit,
  onDelete,
  globalFilter,
  setGlobalFilter,
  onAdd,
}: LocationTableProps) => {
  const [expanded, setExpanded] = useState<ExpandedState>({});

  // Build the tree structure from the flat locations array.
  const data: NestedLocation[] = useMemo(
    () => buildLocationTree(locations),
    [locations]
  );

  // Retrieve column definitions.
  const columns = useLocationColumns(locations, onEdit, onDelete);

  const table = useReactTable({
    data,
    columns,
    state: {
      expanded,
      globalFilter,
    },
    onExpandedChange: setExpanded,
    onGlobalFilterChange: setGlobalFilter,
    getSubRows: (row) => row.subRows,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SearchBar value={globalFilter} onChange={setGlobalFilter} />
        <Button onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Location
        </Button>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={cn(
                    "transition-colors hover:bg-muted/50",
                    row.depth > 0 && "bg-muted/30"
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No locations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LocationTable;
