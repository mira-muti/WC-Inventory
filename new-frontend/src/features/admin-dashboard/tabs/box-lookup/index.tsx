import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SearchFilters from "@/features/admin-dashboard/components/SearchFilters";
import BoxDetails from "@/features/admin-dashboard/components/BoxDetails";
import { BoxItem } from "@/types/box";
import { boxApi } from "@/lib/api/boxes";
import { useLocations } from "@/features/admin-dashboard/tabs/location-management/hooks/use-locations.ts";
import { toast } from "sonner";
import DonateDialog from "./components/DonateDialog";
import MoveDialog from "./components/MoveDialog";
import BoxesTable from "./components/BoxesTable";
import { BoxStatus } from "@/types/enums";
import { printBoxLabels } from "./utils";
import { deleteBoxes } from "@/lib/api";
import DeleteDialog from "./components/DeleteDialog";
import { useSearchParams } from "react-router-dom";

interface FilterState {
  searchTerm: string;
  category: string;
  size: string;
  gender: string;
  status: BoxStatus;
}

const genderMapping: Record<string, string> = {
  male: "Men",
  female: "Women",
  kids: "Kids",
  unisex: "Unisex",
};

// const categoryMapping: Record<string, string> = {
//   tshirts: "T-shirt",
//   pants: "Pants",
// };

const BoxLookup: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedBoxIdParam = searchParams.get("selectedBoxId");

  const [selectedBoxIds, setSelectedBoxIds] = React.useState<string[]>([]);
  const [filters, setFilters] = React.useState<FilterState>({
    searchTerm: "",
    category: "all",
    size: "all",
    gender: "all",
    status: "Active",
  });

  // Dialog states
  const [isDonateDialogOpen, setIsDonateDialogOpen] = React.useState(false);
  const [isMoveDialogOpen, setIsMoveDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  // Location selection states
  const [, setSelectedLocations] = React.useState<string[]>([]);

  // Use React Query to fetch boxes data
  const {
    data: boxes = [],
    isLoading: isLoadingBoxes,
    isError: isBoxesError,
    error: boxesError,
  } = useQuery({
    queryKey: ["boxes"],
    queryFn: async () => boxApi.getBoxes(),
  });

  const { locations, isLoading: isLoadingLocations } = useLocations();

  // Auto-select box from URL parameter
  React.useEffect(() => {
    if (selectedBoxIdParam && boxes.length > 0) {
      const boxExists = boxes.some((box) => box.id === selectedBoxIdParam);
      if (boxExists) {
        setSelectedBoxIds([selectedBoxIdParam]);
        // Clear the URL parameter after selecting
        setSearchParams({});
      }
    }
  }, [selectedBoxIdParam, boxes, setSearchParams]);

  // Organize locations by parent when locations data changes
  // Mutations for box operations
  const donateBoxesMutation = useMutation({
    mutationFn: ({ boxIds, note }: { boxIds: string[]; note?: string }) =>
      boxApi.donateBoxes(boxIds, note),
    onSuccess: () => {
      toast.success(
        `${selectedBoxIds.length} ${
          selectedBoxIds.length === 1 ? "box" : "boxes"
        } donated successfully.`,
      );
      queryClient.invalidateQueries({ queryKey: ["boxes"] });
      setSelectedBoxIds([]);
      setIsDonateDialogOpen(false);
    },
    onError: (error) => {
      toast.error(
        `Failed to donate boxes: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    },
  });
  const deleteBoxesMutation = useMutation({
    mutationFn: ({ boxIds }: { boxIds: string[] }) => deleteBoxes(boxIds),
    onSuccess: () => {
      toast.success(`${selectedBoxIds.length} box(es) deleted successfully.`);
      queryClient.invalidateQueries({ queryKey: ["boxes"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      setSelectedBoxIds([]);
      setIsDeleteDialogOpen(false);
    },
    onError: (error: any) => {
      console.error(error);
      toast.warning(
        `Failed to delete boxes: ${error?.message || "Unknown error"}`,
      );
    },
  });

  const moveBoxesMutation = useMutation({
    mutationFn: ({
      boxIds,
      locationId,
      note,
    }: {
      boxIds: string[];
      locationId: string;
      note?: string;
    }) => boxApi.moveBoxes(boxIds, locationId, note),
    onSuccess: () => {
      toast.success(
        `${selectedBoxIds.length} ${
          selectedBoxIds.length === 1 ? "box" : "boxes"
        } moved successfully.`,
      );
      queryClient.invalidateQueries({ queryKey: ["boxes"] });
      setSelectedBoxIds([]);
      setIsMoveDialogOpen(false);
      setSelectedLocations([]);
    },
    onError: (error) => {
      toast.warning(
        `Failed to move boxes: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    },
  });

  // Filter boxes based on search term and filters - memoized for performance
  const filteredBoxes = React.useMemo(() => {
    return boxes.filter((box) => {
      // filter by status
      if (filters.status != box.status) {
        return false;
      }

      // Filter by search term (box name)
      if (
        filters.searchTerm &&
        !box.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Empty boxes should not show up (should not even exist in the database)
      // // If box has no contents, only apply name filter
      // if (!box.contents || box.contents.length === 0) {
      //   return true;
      // }

      // Filter by contents
      if (
        filters.category !== "all" ||
        filters.size !== "all" ||
        filters.gender !== "all"
      ) {
        return box.contents.some((item) => {
          // Filter by category (item type)
          if (filters.category !== "all" && item.type !== filters.category) {
            return false;
          }

          // Filter by size
          if (
            filters.size !== "all" &&
            item.size !== filters.size.toUpperCase()
          ) {
            return false;
          }

          // Filter by gender
          if (filters.gender !== "all") {
            if (item.gender !== genderMapping[filters.gender.toLowerCase()]) {
              return false;
            }
          }

          return true;
        });
      }

      return true;
    });
  }, [boxes, filters]);

  useEffect(() => {
    setSelectedBoxIds((prev) => {
      const validIds = prev.filter((id) =>
        filteredBoxes.some((box) => box.id === id),
      );

      // Prevent update if nothing changed
      if (
        validIds.length === prev.length &&
        validIds.every((id, index) => id === prev[index])
      ) {
        return prev; // Return same reference = no re-render
      }
      return validIds;
    });
  }, [filteredBoxes]);

  // Handle filter changes
  const handleFilterChange = (filterType: keyof FilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  // Handle box selection logic
  const handleBoxSelect = (boxId: string) => {
    setSelectedBoxIds((prev) => {
      const isSelected = prev.includes(boxId);
      return isSelected ? prev.filter((id) => id !== boxId) : [...prev, boxId];
    });
  };

  const handleSelectAll = () => {
    setSelectedBoxIds(
      selectedBoxIds.length === filteredBoxes.length
        ? []
        : filteredBoxes.map((box) => box.id),
    );
  };

  // Generate combined content view for multiple selected boxes
  const getSelectedBoxesContent = () => {
    if (selectedBoxIds.length === 0) return null;

    const selectedBoxes = boxes.filter((box) =>
      selectedBoxIds.includes(box.id),
    );

    if (selectedBoxIds.length === 1) {
      // Single box view
      const box = selectedBoxes[0];
      return (
        <BoxDetails
          boxName={box.name}
          icon={box.icon}
          location={box.location || ""}
          createdAt={box.createdAt || ""}
          updatedAt={box.updatedAt || ""}
          contents={box.contents}
        />
      );
    } else {
      // Multiple boxes view - sum up contents
      const combinedContents: Record<string, BoxItem> = {};

      selectedBoxes.forEach((box) => {
        box.contents?.forEach((item) => {
          const key = `${item.type}-${item.gender}-${item.size}`;
          if (!combinedContents[key]) {
            combinedContents[key] = { ...item, quantity: 0 };
          }
          combinedContents[key].quantity += item.quantity;
        });
      });

      return (
        <BoxDetails
          boxName={`${selectedBoxes.length} boxes selected`}
          icon=""
          location=""
          createdAt=""
          updatedAt=""
          contents={Object.values(combinedContents)}
          isMultiSelect={true}
        />
      );
    }
  };

  // Dialog handlers
  const handleDonateClick = () => {
    if (selectedBoxIds.length === 0) {
      toast.info("Please select at least one box to donate.");
      return;
    }
    setIsDonateDialogOpen(true);
  };

  const handleDeleteClick = () => {
    if (selectedBoxIds.length === 0) {
      toast.info("Please select at least one box to delete.");
      return;
    }
    setIsDeleteDialogOpen(true);
  };

  const handleMoveClick = () => {
    if (selectedBoxIds.length === 0) {
      toast.info("Please select at least one box to move.");
      return;
    }

    // Reset selected locations when opening the dialog
    setSelectedLocations([]);

    // Log the location hierarchy before opening the move dialog
    setIsMoveDialogOpen(true);
  };

  const handleConfirmDonation = (note?: string) => {
    donateBoxesMutation.mutate({ boxIds: selectedBoxIds, note });
  };

  const handleConfirmDelete = () => {
    deleteBoxesMutation.mutate({ boxIds: selectedBoxIds });
  };

  const handleConfirmMove = (locationId: string, note?: string) => {
    // The validation is now happening in the MoveDialog component
    // Here we just need to handle the mutation
    moveBoxesMutation.mutate({
      boxIds: selectedBoxIds,
      locationId,
      note,
    });
  };

  const handlePrintLabel = () => {
    const selectedBoxes = boxes.filter((box) =>
      selectedBoxIds.includes(box.id),
    );
    printBoxLabels(selectedBoxes);
  };

  // Action buttons for selected boxes
  const actionButtons = (
    <div className="flex gap-4">
      <Button
        variant="outline"
        onClick={handlePrintLabel}
        disabled={selectedBoxIds.length === 0}
      >
        Print label
      </Button>
      <Button
        // variant="outline"
        onClick={handleMoveClick}
        disabled={selectedBoxIds.length === 0}
      >
        Move
      </Button>
      <Button
        // variant="outline"
        onClick={handleDonateClick}
        disabled={selectedBoxIds.length === 0}
      >
        Donate
      </Button>
      <Button
        variant="destructive"
        onClick={handleDeleteClick}
        disabled={selectedBoxIds.length === 0}
      >
        Delete
      </Button>
    </div>
  );

  // Handle loading and error states
  if (isLoadingBoxes) {
    return <div className="p-6">Loading inventory data...</div>;
  }
  if (isBoxesError) {
    return (
      <div className="p-6 text-red-500">
        Error loading inventory: {boxesError?.message}
      </div>
    );
  }
  const content = getSelectedBoxesContent();
  return (
    <>
      <SearchFilters
        onSearch={(value) => handleFilterChange("searchTerm", value)}
        onCategoryChange={(value) => handleFilterChange("category", value)}
        onSizeChange={(value) => handleFilterChange("size", value)}
        onGenderChange={(value) => handleFilterChange("gender", value)}
        onStatusChange={(value) => handleFilterChange("status", value)}
        actionButtons={actionButtons}
      />

      <div className="flex flex-col gap-6 md:flex-row mt-6">
        <div className="flex-1 min-w-0 ">
          <BoxesTable
            boxes={filteredBoxes}
            selectedBoxIds={selectedBoxIds}
            onBoxSelect={handleBoxSelect}
            onSelectAll={handleSelectAll}
          />
        </div>

        {/* Right panel for box details */}
        {selectedBoxIds.length > 0 && (
          <div className="basis-1/3">{getSelectedBoxesContent()}</div>
        )}
      </div>

      {/* Donation Confirmation Dialog */}
      <DonateDialog
        open={isDonateDialogOpen}
        onOpenChange={setIsDonateDialogOpen}
        onConfirm={handleConfirmDonation}
        boxCount={selectedBoxIds.length}
        isProcessing={donateBoxesMutation.isPending}
      />
      {/* Move Location Dialog */}
      <MoveDialog
        open={isMoveDialogOpen}
        onOpenChange={setIsMoveDialogOpen}
        onConfirm={handleConfirmMove}
        locations={locations}
        isLoading={isLoadingLocations}
        isProcessing={moveBoxesMutation.isPending}
      />
      {
        <DeleteDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={() =>
            deleteBoxesMutation.mutate({ boxIds: selectedBoxIds })
          }
          boxCount={selectedBoxIds.length}
          isProcessing={deleteBoxesMutation.isPending}
        />
      }
    </>
  );
};

export default BoxLookup;
