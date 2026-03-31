import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BoxView } from "@/types/box";

export interface BoxesTableProps {
  boxes: BoxView[];
  selectedBoxIds: string[];
  onBoxSelect: (boxId: string) => void;
  onSelectAll: () => void;
}

const BoxesTable: React.FC<BoxesTableProps> = ({
  boxes,
  selectedBoxIds,
  onBoxSelect,
  onSelectAll,
}) => {
  return (
    <Card className="overflow-x-auto p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={
                  selectedBoxIds.length === boxes.length && boxes.length > 0
                }
                onCheckedChange={onSelectAll}
                aria-label="Select all boxes"
              />
            </TableHead>
            <TableHead>Box name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Quantity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {boxes.length > 0 ? (
            boxes.map((box) => (
              <TableRow
                key={box.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onBoxSelect(box.id)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedBoxIds.includes(box.id)}
                    onCheckedChange={() => onBoxSelect(box.id)}
                    aria-label={`Select box ${box.name}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{box.name}</TableCell>
                <TableCell>{box.location || "—"}</TableCell>
                <TableCell>
                  Qty:{" "}
                  {box.contents?.reduce(
                    (sum, item) => sum + item.quantity,
                    0,
                  ) || 0}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center py-6 text-muted-foreground"
              >
                No boxes found matching your filters
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

export default BoxesTable;
