import { useNavigate } from "react-router-dom";
import MainFilters from "../components/MainFilters";
import ItemFilters from "../components/ItemFilters";
import BoxFilters from "../components/BoxFilters";
import LocationFilters from "../components/LocationFilters";
import { useLocations } from "@/features/admin-dashboard/tabs/location-management/hooks/use-locations.ts";
import { toast } from "sonner";
import { useSearchFiltersQueries } from "@/features/admin-dashboard/hooks/useSearchFiltersQueries";
import { buildLocationTree } from "@/features/add-box/utils";
import { useLookupState } from "..";
import { BoxStatus } from "@/types/enums";
import { boxApi } from "@/lib/api/boxes";
import { useQuery } from "@tanstack/react-query";
import Header from "../components/Header";


interface FilterStateItem {
  category: string;
  size: string;
  gender: string;
  status: BoxStatus; 
  sizeGroup: string;
}

interface FilterStateLocation {
  room: string;
  level: string;
  aisle: string;
  row: string;
}

const LookupBox = () => {
  const navigate = useNavigate();

  const { 
    setSelectedBoxIds,
    view, setView,
    prevView, setPrevView,
    setFilterType,
    itemFilters, setItemFilters,
    boxIdFilters, setBoxIdFilters,
    locationFilters, setLocationFilters,
  } = useLookupState();

  const { locations } = useLocations();
  
  const { categories, sizes } = useSearchFiltersQueries();

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

  // build locationTree for location filters
  const locationTree = locations
    ? buildLocationTree(locations.map((loc) => ({ ...loc, children: [] })))
    : [];

  const title = view === "item-filter"
    ? "Search Box by Item"
    : view === "box-filter"
      ? "Search Box by ID"
      : view === "location-filter"
        ? "Search Box by Location"
        : "Inventory Management";
    
  const handleGoBack = () => {
    if (view === "main-filter") {
      navigate("/");
    }
    else {
      setView(prevView);
      setPrevView("main-filter");
    }
  };

  const handleItemFilter = () => {
    setFilterType("item");
    setView("item-filter"); 
  };

  const handleBoxFilter = () => {
    setFilterType("box-id");
    setView("box-filter"); 
  }; 

  const handleLocationFilter = () => {
    setFilterType("location");
    setView("location-filter"); 
  };

  const handleSearch = () => {
    if (view === "box-filter" && Object.entries(boxIdFilters).length === 0) {
      toast.info("Please select at least one box to search.");
      return;
    }
    setSelectedBoxIds([]);
    navigate("/lookup/filter-results");
  };

  const handleItemFilterChange = (filterType: keyof FilterStateItem, value: string) => {
    setItemFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };
  
  const handleBoxIdFilterChange= (id: string, name: string) => {
    setBoxIdFilters((prev) => {
      const updated = {...prev};
      if (id in updated) {
        delete updated[id];
      }
      else {
        updated[id] = name;
      }
      return updated;
    });
  };
  
  const clearAllBoxIds = () => {
    setBoxIdFilters({});
  };

  const handleLocationFilterChange = (filterType: keyof FilterStateLocation, value: string) => {
    setLocationFilters((prev) => {
      const updated = { ...prev };

      if (filterType === "room") {
        updated.room = value;
        updated.level = "default";
        updated.aisle = "default";
        updated.row = "default";
      } else if (filterType === "level") {
        updated.level = value;
        updated.aisle = "default";
        updated.row = "default";
      } else if (filterType === "aisle") {
        updated.aisle = value;
        updated.row = "default";
      } else if (filterType === "row") {
        updated.row = value;
      }

      return updated;
    });
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
    <div className="h-screen w-full flex flex-col bg-white">

      <Header handleGoBack={handleGoBack} title={title} />

      <div className="h-[70vh] w-full max-w-screen-md mx-auto flex flex-col px-4">

        <div className="h-full w-full flex flex-col">

          {view === "main-filter" && (
            <MainFilters
              handleItemFilter={handleItemFilter}
              handleBoxFilter={handleBoxFilter} 
              handleLocationFilter={handleLocationFilter}
            /> 
          )}

          {view === "item-filter" && (
            <ItemFilters
              categories={categories}
              sizes={sizes}
              selectedCategoryId={itemFilters.category}
              selectedSizeId={itemFilters.size}
              selectedGender={itemFilters.gender}
              selectedStatus={itemFilters.status}
              selectedSizeGroup={itemFilters.sizeGroup}
              onCategoryChange={(value) => handleItemFilterChange("category", value)}
              onSizeChange={(value) => handleItemFilterChange("size", value)}
              onGenderChange={(value) => handleItemFilterChange("gender", value)}
              onStatusChange={(value) => handleItemFilterChange("status", value)}
              onSizeGroupChange={(value) => handleItemFilterChange("sizeGroup", value)}
            />
          )}

          {view === "box-filter" && (
            <BoxFilters
              boxes={boxes}
              boxIdFilters={boxIdFilters}
              handleBoxIdFilterChange={handleBoxIdFilterChange}
              clearAllBoxIds={clearAllBoxIds}
            /> 
          )}

          {view === "location-filter" && (
            <LocationFilters
              locationTree={locationTree}
              selectedRoom={locationFilters.room}
              selectedLevel={locationFilters.level}
              selectedAisle={locationFilters.aisle}
              selectedRow={locationFilters.row}
              onRoomChange={(value) => handleLocationFilterChange("room", value)}
              onLevelChange={(value) => handleLocationFilterChange("level", value)}
              onAisleChange={(value) => handleLocationFilterChange("aisle", value)}
              onRowChange={(value) => handleLocationFilterChange("row", value)}
            /> 
          )}

        </div>

        {["item-filter", "box-filter", "location-filter"].includes(view) && (
          <div className="h-[10vh] w-full flex items-center justify-center">
            <button 
              className="w-3/4 bg-gray-950 hover:bg-gray-800 text-white p-4 rounded-lg shadow font-bold transition-all"
              onClick={handleSearch}
            >
              <p className="text-2xl">
                Search
              </p>
            </button>
          </div>
        )}

      </div>

    </div>

  );

};

export default LookupBox;
