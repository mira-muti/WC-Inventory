import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BoxDetail } from "@/features/admin-dashboard/hooks/useBoxDetails";

interface BoxDetailsSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  categoryName: string;
  sizeName: string | null;
  boxDetails: BoxDetail[] | undefined;
  isLoading: boolean;
}
export default function BoxDetailsSlideOver(
  { isOpen, onClose, categoryName, sizeName, boxDetails, isLoading }:
    BoxDetailsSlideOverProps,
) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>
            {categoryName} - {sizeName || "No Size"}
          </SheetTitle>
          <SheetDescription>Box locations and quantities</SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          {isLoading ? <div>Loading boxes...</div> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Box Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {boxDetails?.map((detail) => (
                  <TableRow key={detail.box_id}>
                    <TableCell>{detail.box_name}</TableCell>
                    <TableCell>{detail.location_name}</TableCell>
                    <TableCell>{detail.gender}</TableCell>
                    <TableCell>{detail.quantity}</TableCell>
                  </TableRow>
                ))}
                {(!boxDetails || boxDetails.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No boxes found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
        <div className="mt-6">
          <Button onClick={onClose}>Close</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
