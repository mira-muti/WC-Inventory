import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { Location } from "@/types/location";
import { LocationHierarchy } from "../types";
export interface MoveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (locationId: string, note?: string) => void;
  locations: Location[];
  isLoading: boolean;
  isProcessing: boolean;
}

const MoveDialog: React.FC<MoveDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  locations,
  isLoading,
  isProcessing,
}) => {
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [locationsByParent, setLocationsByParent] = useState<LocationHierarchy>(
    {},
  );
  const [note, setNote] = useState("");

  // Reset selected locations when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedLocations([]);
      setNote("");
    }
  }, [open]);

  // Organize locations by parent when locations data changes
  useEffect(() => {
    if (locations && locations.length > 0) {
      // Organize locations by parent
      const locByParent: LocationHierarchy = {};

      // Initialize the null parent entry with empty string key
      locByParent[""] = [];

      // Process all locations
      locations.forEach((loc) => {
        if (!loc.location_id) return; // Skip invalid locations

        const parentId = loc.parent_id || "";
        if (!locByParent[parentId]) {
          locByParent[parentId] = [];
        }
        locByParent[parentId].push(loc);
      });

      setLocationsByParent(locByParent);
    }
  }, [locations]);

  // Handle location selection
  const handleLocationSelect = (locationId: string, level: number) => {
    if (!locationId) return;

    // When selecting a location at a level, clear all subsequent levels
    const newSelectedLocations = [...selectedLocations.slice(0, level)];
    newSelectedLocations[level] = locationId;

    setSelectedLocations(newSelectedLocations);
  };

  // Get locations for a specific level
  const getLocationsForLevel = (level: number): Location[] => {
    if (level === 0) {
      return locationsByParent[""] || [];
    }

    const parentId = selectedLocations[level - 1];
    if (!parentId) return [];

    return locationsByParent[parentId] || [];
  };

  // Get location name by ID
  const getLocationNameById = (
    locationId: string,
    parentId: string = "",
  ): string => {
    if (!locationId) return "Unknown";

    const locations = parentId
      ? locationsByParent[parentId] || []
      : locationsByParent[""] || [];

    const location = locations.find((loc) => loc.location_id === locationId);
    return location?.name || "Unknown";
  };

  const handleConfirm = () => {
    // Get the most specific selected location (the last non-empty one)
    const targetLocationId = selectedLocations.filter(Boolean).pop();

    if (targetLocationId) {
      onConfirm(targetLocationId, note);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Destination location</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Level 0 locations */}
          <div className="w-full">
            <div className="text-sm text-gray-500 mb-1">Level 0 (Root):</div>
            <Select
              value={selectedLocations[0] || ""}
              onValueChange={(value) => handleLocationSelect(value, 0)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading locations...
                  </SelectItem>
                ) : (
                  getLocationsForLevel(0).map((location) =>
                    location.location_id ? (
                      <SelectItem
                        key={`level0-${location.location_id}`}
                        value={location.location_id}
                      >
                        {location.name || "Unnamed Location"}
                      </SelectItem>
                    ) : null,
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Level 1 locations (if level 0 is selected) */}
          {selectedLocations[0] && getLocationsForLevel(1).length > 0 && (
            <div className="w-full">
              <div className="text-sm text-gray-500 mb-1">Level 1:</div>
              <Select
                value={selectedLocations[1] || ""}
                onValueChange={(value) => handleLocationSelect(value, 1)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select sub-location" />
                </SelectTrigger>
                <SelectContent>
                  {getLocationsForLevel(1).map((location) =>
                    location.location_id ? (
                      <SelectItem
                        key={`level1-${location.location_id}`}
                        value={location.location_id}
                      >
                        {location.name || "Unnamed Location"}
                      </SelectItem>
                    ) : null,
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Level 2 locations (if level 1 is selected) */}
          {selectedLocations[1] && getLocationsForLevel(2).length > 0 && (
            <div className="w-full">
              <div className="text-sm text-gray-500 mb-1">Level 2:</div>
              <Select
                value={selectedLocations[2] || ""}
                onValueChange={(value) => handleLocationSelect(value, 2)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select sub-location" />
                </SelectTrigger>
                <SelectContent>
                  {getLocationsForLevel(2).map((location) =>
                    location.location_id ? (
                      <SelectItem
                        key={`level2-${location.location_id}`}
                        value={location.location_id}
                      >
                        {location.name || "Unnamed Location"}
                      </SelectItem>
                    ) : null,
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Selected Location Path Display */}
          <div className="w-full">
            <Label className="mb-2 block text-sm font-medium">Note</Label>
            <div className="mb-4">
              <Input
                placeholder="Add a note about this box..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-2 p-2 bg-blue-50 rounded-md">
            <h4 className="text-sm font-medium mb-1">
              Selected Location Path:
            </h4>
            {selectedLocations.some(Boolean) ? (
              <div className="text-sm">
                {selectedLocations.filter(Boolean).map((locId, idx) => {
                  let locationName = "Unknown";
                  if (idx === 0) {
                    locationName = getLocationNameById(locId, "");
                  } else if (idx === 1) {
                    locationName = getLocationNameById(
                      locId,
                      selectedLocations[0],
                    );
                  } else if (idx === 2) {
                    locationName = getLocationNameById(
                      locId,
                      selectedLocations[1],
                    );
                  }
                  return (
                    <div key={`path-${idx}`} className="flex items-center">
                      {idx > 0 && <span className="mx-1">→</span>}
                      <span className="truncate">{locationName}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                No location selected yet
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="mr-auto"
          >
            ❌ Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedLocations.some(Boolean) || isProcessing}
          >
            {isProcessing ? "Processing..." : "✅ Done"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MoveDialog;
