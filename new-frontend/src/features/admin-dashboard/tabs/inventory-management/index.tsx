import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SearchFilters from "@/features/admin-dashboard/components/SearchFilters";
import BoxDetails from "@/features/admin-dashboard/components/BoxDetails";
import { useQueryClient } from "@tanstack/react-query";
import { Box } from "@/types/box";
import { Location } from "@/types/location";

// Mock data with correct case for type and gender
const mockBoxes = [
  {
    id: "25",
    name: "25",
    location: "Aisle 2 > Side B > Row 1",
    createdAt: "2024-01-20T11:30:00",
    updatedAt: "2024-01-22T09:45:00",
    contents: [
      {
        type: 'T-shirt',
        gender: 'Men',
        size: 'XL',
        quantity: 5
      },
      {
        type: 'Pants',
        gender: 'Women',
        size: 'XS',
        quantity: 3
      }
    ]
  },
  {
    id: "32",
    name: "32",
    location: "Winter inventory room",
    createdAt: "2024-01-21T11:30:00",
    updatedAt: "2024-01-23T09:45:00",
    contents: [
      {
        type: 'T-shirt',
        gender: 'Men',
        size: 'XL',
        quantity: 3
      },
      {
        type: 'Pants',
        gender: 'Women',
        size: 'XS',
        quantity: 1
      }
    ]
  }
];

// Simple mock locations data
const mockLocations = [
  { id: "1", name: "Main warehouse", parentId: null, level: 0 },
  { id: "2", name: "Zone A", parentId: "1", level: 1 },
  { id: "3", name: "Zone B", parentId: "1", level: 1 },
  { id: "4", name: "Shelf A1", parentId: "2", level: 2 },
  { id: "5", name: "Shelf B1", parentId: "3", level: 2 },
  { id: "6", name: "Donated", parentId: null, level: 0 }
];

// Use the exact same interface as in BoxDetails
// TODO: this is defined in BoxDetails.tsx, should we define this somewhere else and import it?
interface BoxItem {
  type: 'T-shirt' | 'Pants';
  gender: 'Men' | 'Women';
  size: string;
  quantity: number;
}
// TODO: check if this should be defined here or should be imported from dummyDatabase.ts
interface Box {
  id: string;
  name: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  contents: BoxItem[];
}
// TODO: check if this should be defined here or should be imported from dummyDatabase.ts
interface Location {
  id: string;
  name: string;
  parentId: string | null;
  level: number;
}

// type BoxView = Database["public"]["Views"][""];

const InventoryDashboard = () => {
  // TODO: use the queryClient to fetch the data instead of using mock data
  const queryClient = useQueryClient();
  const [selectedBoxIds, setSelectedBoxIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [size, setSize] = useState("all");
  const [gender, setGender] = useState("all");

  // States for dialogs
  const [isDonateDialogOpen, setIsDonateDialogOpen] = useState(false);
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);

  // States for location selection in Move dialog
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  // State to track boxes (start with mock data)
  const [boxes, setBoxes] = useState<Box[]>(mockBoxes);

  // Filter boxes based on search term and filters
  const filteredBoxes = React.useMemo(() => {
    return boxes.filter(box => {
      // Filter by search term (box name)
      if (searchTerm && !box.name?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Filter by contents
      if (category !== 'all' || size !== 'all' || gender !== 'all') {
        if (!box.contents || !Array.isArray(box.contents) || box.contents.length === 0) {
          return false;
        }

        return box.contents.some(item => {
          if (!item) return false;

          // Filter by category (item type)
          if (category !== 'all' && item.type !== (category === 'tshirts' ? 'T-shirt' : 'Pants')) {
            return false;
          }

          // Filter by size
          if (size !== 'all' && item.size !== size.toUpperCase()) {
            return false;
          }

          // Filter by gender
          if (gender !== 'all' && item.gender !== (gender === 'male' ? 'Men' : 'Women')) {
            return false;
          }

          return true;
        });
      }

      return true;
    });
  }, [boxes, searchTerm, category, size, gender]);

  // Box selection handler
  const handleBoxSelect = (boxId: string) => {
    setSelectedBoxIds(prev => {
      const isSelected = prev.includes(boxId);

      if (isSelected) {
        return prev.filter(id => id !== boxId);
      } else {
        return [...prev, boxId];
      }
    });
  };

  const isBoxSelected = (boxId: string) => {
    return selectedBoxIds.includes(boxId);
  };

  const handleSelectAll = () => {
    if (filteredBoxes.length === 0) return;

    if (selectedBoxIds.length === filteredBoxes.length) {
      setSelectedBoxIds([]);
    } else {
      const allBoxIds = filteredBoxes.map(box => String(box.id));
      setSelectedBoxIds(allBoxIds);
    }
  };

  // Donation handlers
  const handleDonateClick = () => {
    if (selectedBoxIds.length > 0) {
      setIsDonateDialogOpen(true);
    }
  };

  const handleConfirmDonation = () => {
    if (selectedBoxIds.length === 0) return;

    // Update boxes with the new location
    setBoxes(prevBoxes =>
      prevBoxes.map(box =>
        selectedBoxIds.includes(box.id)
          ? { ...box, location: "Donated" }
          : box
      )
    );

    setSelectedBoxIds([]);
    setIsDonateDialogOpen(false);
  };

  // Move handlers
  const handleMoveClick = () => {
    if (selectedBoxIds.length > 0) {
      setSelectedLocations([]);
      setIsMoveDialogOpen(true);
    }
  };

  const handleLocationSelect = (locationId: string, level: number) => {
    const newSelections = [...selectedLocations.slice(0, level), locationId];
    setSelectedLocations(newSelections);
  };

  const handleConfirmMove = () => {
    if (selectedLocations.length === 0 || selectedBoxIds.length === 0) return;

    // Get the full location path
    const locationPath = getLocationPath(selectedLocations);

    // Update boxes with the new location
    setBoxes(prevBoxes =>
      prevBoxes.map(box =>
        selectedBoxIds.includes(box.id)
          ? { ...box, location: locationPath }
          : box
      )
    );

    setSelectedBoxIds([]);
    setIsMoveDialogOpen(false);
  };

  // Helper to get location path from IDs
  const getLocationPath = (locationIds: string[]) => {
    return locationIds
      .map(id => {
        const location = mockLocations.find(loc => loc.id === id);
        return location ? location.name : '';
      })
      .filter(Boolean)
      .join(' > ');
  };

  // Get available locations for a specific level
  const getLocationsForLevel = (level: number): Location[] => {
    if (level === 0) {
      return mockLocations.filter(loc => loc.level === 0);
    }

    const parentId = selectedLocations[level - 1];
    return mockLocations.filter(loc => loc.parentId === parentId && loc.level === level);
  };

  // Safely calculate quantity from box contents
  const calculateTotalQuantity = (box: Box) => {
    if (!box.contents || !Array.isArray(box.contents)) {
      return 0;
    }
    return box.contents.reduce((sum, item) => sum + (item?.quantity || 0), 0);
  };

  // Get content for selected boxes
  const getSelectedBoxesContent = () => {
    if (selectedBoxIds.length === 0) return null;

    const selectedBoxes = boxes.filter(box => selectedBoxIds.includes(String(box.id)));

    if (selectedBoxIds.length === 1 && selectedBoxes.length === 1) {
      // Single box view
      const box = selectedBoxes[0];
      return (
        <BoxDetails
          boxName={box.name}
          location={box.location}
          createdAt={box.createdAt}
          updatedAt={box.updatedAt}
          contents={box.contents || []}
        />
      );
    } else if (selectedBoxes.length > 0) {
      // Multiple boxes view - sum up contents
      const combinedContents: { [key: string]: BoxItem } = {};

      selectedBoxes.forEach(box => {
        (box.contents || []).forEach(item => {
          if (!item) return;

          const key = `${item.type}-${item.gender}-${item.size}`;
          if (!combinedContents[key]) {
            combinedContents[key] = { ...item, quantity: 0 };
          }
          combinedContents[key].quantity += item.quantity || 0;
        });
      });

      return (
        <BoxDetails
          boxName=""
          location=""
          createdAt=""
          updatedAt=""
          contents={Object.values(combinedContents)}
          isMultiSelect={true}
        />
      );
    }

    return null;
  };

  const actionButtons = (
    <div className="flex gap-4">
      <Button variant="outline">Print label</Button>
      <Button
        variant="outline"
        onClick={handleMoveClick}
        disabled={selectedBoxIds.length === 0}
      >
        Move
      </Button>
      <Button
        variant="outline"
        onClick={handleDonateClick}
        disabled={selectedBoxIds.length === 0}
      >
        Donate
      </Button>
    </div>
  );

  // Calculate the number of boxes being donated
  const donationCount = selectedBoxIds.length;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Inventory Management</h1>
        </div>
      </div>

      <div className="flex gap-6 flex-col md:flex-row">
        <div className="flex-1">
          <SearchFilters
            onSearch={setSearchTerm}
            onCategoryChange={setCategory}
            onSizeChange={setSize}
            onGenderChange={setGender}
            actionButtons={actionButtons}
          />

          <Card className="mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedBoxIds.length === filteredBoxes.length && filteredBoxes.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Box name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBoxes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      No boxes found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBoxes.map((box) => {
                    const boxIdString = String(box.id);
                    const isSelected = isBoxSelected(boxIdString);

                    return (
                      <TableRow
                        key={boxIdString}
                        className={isSelected ? "bg-muted/50" : ""}
                      >
                        <TableCell>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleBoxSelect(boxIdString)}
                          />
                        </TableCell>
                        <TableCell>
                          <button
                            onClick={() => handleBoxSelect(boxIdString)}
                            className="font-medium hover:underline"
                          >
                            Box {box.name}
                          </button>
                        </TableCell>
                        <TableCell>{box.location || "No location"}</TableCell>
                        <TableCell>
                          Qty: {calculateTotalQuantity(box)}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Right panel for box details */}
        <div className="w-full md:w-96">
          {getSelectedBoxesContent()}
        </div>
      </div>

      {/* Donation Confirmation Dialog */}
      <Dialog open={isDonateDialogOpen} onOpenChange={setIsDonateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm donation of {donationCount} {donationCount === 1 ? 'box' : 'boxes'}?</DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={() => setIsDonateDialogOpen(false)}>
              ❌ Cancel
            </Button>
            <Button onClick={handleConfirmDonation}>
              ✅ Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Move Location Dialog */}
      <Dialog open={isMoveDialogOpen} onOpenChange={setIsMoveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Destination location</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            {/* Level 0 locations */}
            <Select
              value={selectedLocations[0]}
              onValueChange={(value) => handleLocationSelect(value, 0)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {getLocationsForLevel(0).map(location => (
                  <SelectItem key={`level0-${location.id}`} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Level 1 locations (if level 0 is selected) */}
            {selectedLocations[0] && getLocationsForLevel(1).length > 0 && (
              <Select
                value={selectedLocations[1]}
                onValueChange={(value) => handleLocationSelect(value, 1)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sub-location" />
                </SelectTrigger>
                <SelectContent>
                  {getLocationsForLevel(1).map(location => (
                    <SelectItem key={`level1-${location.id}`} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Level 2 locations (if level 1 is selected) */}
            {selectedLocations[1] && getLocationsForLevel(2).length > 0 && (
              <Select
                value={selectedLocations[2]}
                onValueChange={(value) => handleLocationSelect(value, 2)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sub-location" />
                </SelectTrigger>
                <SelectContent>
                  {getLocationsForLevel(2).map(location => (
                    <SelectItem key={`level2-${location.id}`} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={handleConfirmMove} disabled={selectedLocations.length === 0}>
              ✅ Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryDashboard;