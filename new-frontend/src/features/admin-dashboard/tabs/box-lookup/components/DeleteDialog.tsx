import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import BoxDetails from "@/features/admin-dashboard/components/BoxDetails";

export interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  boxCount: number;
  isProcessing: boolean;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  boxCount,
  isProcessing,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Confirm deletion of {boxCount} {boxCount === 1 ? "box" : "boxes"}
          </DialogTitle>
        </DialogHeader>
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            ❌ Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "✅ Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;