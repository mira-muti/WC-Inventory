import { Button } from "@/components/ui/button";
import BoxesTable from "@/features/admin-dashboard/tabs/box-lookup/components/BoxesTable";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import DonateDialog from "@/features/admin-dashboard/tabs/box-lookup/components/DonateDialog";
import MoveDialog from "@/features/admin-dashboard/tabs/box-lookup/components/MoveDialog";
import { printBoxLabels } from "@/features/admin-dashboard/tabs/box-lookup/utils";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { boxApi } from "@/lib/api/boxes";
import { useLocations } from "@/features/admin-dashboard/tabs/location-management/hooks/use-locations.ts";
import { useSearchFiltersQueries } from "@/features/admin-dashboard/hooks/useSearchFiltersQueries";3
import { toast } from "sonner";
import { useLookupState } from "..";
import Header from "../components/Header";

const genderMapping: Record<string, string> = {
  male: "Men",
  female: "Women",
  kids: "Kids",
  unisex: "Unisex",
};

const FilterResults = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { locations, isLoading: isLoadingLocations } = useLocations();

  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [isDonateDialogOpen, setIsDonateDialogOpen] = useState(false);
  const [, setSelectedLocations] = useState<string[]>([]);
  const { 
    selectedBoxIds, setSelectedBoxIds,
    filterType,
    itemFilters,
    boxIdFilters,
    locationFilters,
  } = useLookupState();

  const { categories, sizes } = useSearchFiltersQueries();

  // location id : name mapping for filter logic
  const locationsMap = Object.fromEntries(locations.map(l => [l.location_id, l.name]));
  
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

  // filter boxes based on filter type
  const filteredBoxes = useMemo(() => {
    return boxes.filter((box) => {

      if (filterType === "item") {
        const selectedCategoryName =
          categories?.find((c) => c.category_id === itemFilters.category)?.name ?? "all";
        const selectedSizeName =
          sizes?.find((s) => s.size_id === itemFilters.size)?.name ?? "all";

        return (
          box.status === itemFilters.status &&
          (selectedCategoryName === "all" ||
            box.contents?.some((item) => item.type === selectedCategoryName)) &&
          (selectedSizeName === "all" ||
            box.contents?.some((item) => item.size === selectedSizeName)) &&
          (itemFilters.gender === "all" ||
            box.contents?.some((item) => item.gender === genderMapping[itemFilters.gender.toLowerCase()]))
        );
      }
      else if (filterType === "box-id") {
        if (Object.entries(boxIdFilters).length === 0) {
          return true;
        }
        return box.id in boxIdFilters;
      }
      else if (filterType === "location") {
        const locationParts = box.location?.split(" > ") ?? [];

        return (
          (locationFilters.room === "default" || locationParts.includes(locationsMap[locationFilters.room])) &&
          (locationFilters.level === "default" || locationParts.includes(locationsMap[locationFilters.level])) &&
          (locationFilters.aisle === "default" || locationParts.includes(locationsMap[locationFilters.aisle])) &&
          (locationFilters.row === "default" || locationParts.includes(locationsMap[locationFilters.row]))
        );
      }

      return true;
    });
  }, [boxes, filterType, itemFilters, boxIdFilters, locationFilters]);

  const moveBoxesMutation = useMutation({
    mutationFn: ({
      boxIds,
      locationId,
    }: {
      boxIds: string[];
      locationId: string;
    }) => boxApi.moveBoxes(boxIds, locationId),
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

  // Organize locations by parent when locations data changes
  // Mutations for box operations
  const donateBoxesMutation = useMutation({
    mutationFn: (boxIds: string[]) => boxApi.donateBoxes(boxIds),
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

  const handlePrintLabel = () => {
    if (selectedBoxIds.length === 0) {
        toast.info("Please select at least one box to print.");
        return;
    }

    const selectedBoxes = filteredBoxes.filter((box) =>
        selectedBoxIds.includes(box.id)
    );
    printBoxLabels(selectedBoxes);
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

  const handleConfirmMove = (locationId: string) => {
    // The validation is now happening in the MoveDialog component
    // Here we just need to handle the mutation
    moveBoxesMutation.mutate({
        boxIds: selectedBoxIds,
        locationId,
    });
  };

  const handleDonateClick = () => {
    if (selectedBoxIds.length === 0) {
        toast.info("Please select at least one box to donate.");
        return;
    }
    setIsDonateDialogOpen(true);
  };

  const handleConfirmDonation = () => {
    donateBoxesMutation.mutate(selectedBoxIds);
  };

  const handleViewContents = () => {
    if (selectedBoxIds.length === 0) {
        toast.info("Please select at least one box to view its contents.");
        return;
    }
    navigate("/lookup/filter-results/view-contents");
    // navigate("/lookup/filter-results/view-contents", { state: 
    //  { boxIds: selectedBoxIds, }
    // });
  };

  const handleGoBack = () => {
    navigate("/lookup");
  };

  // Handle loading and error states
  if (isLoadingBoxes) {
    return (
      <div className="p-6">
        Loading inventory data...
      </div>
    );
  }
  if (isBoxesError) {
    return (
      <div className="p-6 text-red-500">
        Error loading inventory: {boxesError?.message}
      </div>
    );
  }

  return (

    <div className="h-screen w-full flex flex-col bg-white gap-2">

      <div className="h-[10vh] w-full flex items-center justify-center">
        <Header
          handleGoBack={handleGoBack}
          title={"Box List"}
        />
      </div>

      <div className="h-[7vh] w-full flex items-center justify-center gap-3">

        <Button variant="outline" 
          className="px-3 py-1 rounded-md text-sm font-medium"
          onClick={handlePrintLabel}
        >
          Print label
        </Button>      

        <Button variant="outline" 
          className="px-3 py-1 rounded-md text-sm font-medium"
          onClick={handleMoveClick}
        >
          Move
        </Button>     

        <Button variant="outline" 
          className="px-3 py-1 rounded-md text-sm font-medium"
          onClick={handleDonateClick}
        >
          Donate
        </Button>     

      </div>
    
      <div className="max-h-[30rem] h-lg:max-h-[33rem] h-sm:max-h-[22rem] 
                      flex-1 w-full px-2 overflow-y-auto [&_table]:table-fixed [&_table]:w-full [&_td]:break-words [&_th]:break-words [&_th]:whitespace-normal">
        <div className="w-full max-w-screen-md mx-auto">
          <BoxesTable
            boxes={filteredBoxes}
            selectedBoxIds={selectedBoxIds}
            onBoxSelect={handleBoxSelect}
            onSelectAll={handleSelectAll}
          />
        </div>
      </div>

      <div className="h-[10vh] w-full flex items-center justify-center mt-1 h-sm:mt-3">
        <button 
          className="w-3/4 lg:w-1/2 bg-gray-300 p-3 rounded-lg shadow text-lg font-medium"
          onClick={handleViewContents}
        >
          View Contents
        </button>
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

    </div>

  );

};

export default FilterResults;

