import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export interface DonateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (note: string) => void;
  boxCount: number;
  isProcessing: boolean;
}

const DonateDialog: React.FC<DonateDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  boxCount,
  isProcessing,
}) => {
  const [note, setNote] = useState("");

  // Clear note when dialog closes
  useEffect(() => {
    if (!open) setNote("");
  }, [open]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Confirm donation of {boxCount} {boxCount === 1 ? "box" : "boxes"}?
          </DialogTitle>
        </DialogHeader>
        <Label className="mb-2 block text-sm font-medium">Note</Label>
        <div className="mb-4">
          <Input
            placeholder="Add a note about this box..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            ❌ Cancel
          </Button>
          <Button
            onClick={() => onConfirm(note)}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "✅ Confirm"}
          </Button>
        </DialogFooter> 
      </DialogContent>
    </Dialog>
  );
};

export default DonateDialog;
