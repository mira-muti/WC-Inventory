import { createContext, useContext, useState, } from "react";
import { BoxStatus } from "@/types/enums";

interface Props {
  children: React.ReactNode;
}

interface LookupState {
  selectedBoxIds: string[];
  setSelectedBoxIds: React.Dispatch<React.SetStateAction<string[]>>;
  view: ViewType;
  setView: React.Dispatch<React.SetStateAction<ViewType>>;
  prevView: ViewType;
  setPrevView: React.Dispatch<React.SetStateAction<ViewType>>;
  filterType: FilterType;
  setFilterType: React.Dispatch<React.SetStateAction<FilterType>>;
  itemFilters: FilterStateItem;
  setItemFilters: React.Dispatch<React.SetStateAction<FilterStateItem>>;
  boxIdFilters: Record<string, string>;
  setBoxIdFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  locationFilters: FilterStateLocation;
  setLocationFilters: React.Dispatch<React.SetStateAction<FilterStateLocation>>;
}

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

type ViewType = "main-filter" | "item-filter" | "box-filter" | "location-filter";
type FilterType = "item" | "box-id" | "location";

const LookupStateContext = createContext<LookupState | null>(null);

export function LookupStateProvider({ children }: Props) {
  const [selectedBoxIds, setSelectedBoxIds] = useState<string[]>([]);
  const [view, setView] = useState<ViewType>("main-filter");
  const [prevView, setPrevView] = useState<ViewType>("main-filter");
  const [filterType, setFilterType] = useState<FilterType>("item");
  const [itemFilters, setItemFilters] = useState<FilterStateItem>({ 
      category: "all", 
      size: "all", 
      gender: "all", 
      status: "Active",
      sizeGroup: "all", 
  });
  const [boxIdFilters, setBoxIdFilters] = useState<Record<string, string>>({});
  const [locationFilters, setLocationFilters] = useState<FilterStateLocation>({ 
      room: "default", 
      level: "default", 
      aisle: "default", 
      row: "default" 
  });

  return (
    <LookupStateContext.Provider value={{ 
      selectedBoxIds, setSelectedBoxIds,
      view, setView,
      prevView, setPrevView,
      filterType, setFilterType,
      itemFilters, setItemFilters,
      boxIdFilters, setBoxIdFilters,
      locationFilters, setLocationFilters,
    }}>
      {children}
    </LookupStateContext.Provider>
  );
}

export function useLookupState() {
  const ctx = useContext(LookupStateContext);
  if (!ctx) throw new Error("Must be inside provider");
  return ctx;
}