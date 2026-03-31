import { useEffect, useState } from "react";
import SearchBar from "./components/searchbar.tsx";
import ActivityLogTable from "./components/activity-log-table.tsx";
import { useQuery } from "@tanstack/react-query";
import { activityLogApi } from "@/lib/api/activity-log.ts";
import { queryKeys } from "@/lib/api/queryKeys.ts";
import { BoxMovementView } from "@/types/activity-log.ts";
import { boxApi } from "@/lib/api/boxes";
import BoxDetails from "@/features/admin-dashboard/components/BoxDetails";
import { Card, CardContent } from "@/components/ui/card.tsx";

const defaultStartDate = new Date("2000-01-01");
const defaultEndDate = new Date("2100-12-31");
type ActionTypes = "allActions" | "Donated" | "Moved" | "Retired";

const ActivityLog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState<Date>(defaultStartDate);
  const [endDate, setEndDate] = useState<Date>(defaultEndDate);
  const [action, setAction] = useState<ActionTypes>("allActions");
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  // Get data entries
  const {
    data: activityLogs,
    isLoading,
    refetch,
  } = useQuery({
    queryFn: activityLogApi.getActivityLogs,
    queryKey: queryKeys.activityLog.all,
  });

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

  // Places popup relative to box selected
  const placeBy = (el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    document.documentElement.style.setProperty(
      "--popup-top",
      `${r.bottom + 8}px`,
    );
    document.documentElement.style.setProperty("--popup-left", `${r.left}px`);
  };

  // Handles box selected from table, sets anchor for popup
  const handleSelectBox = (boxId: string, el?: HTMLElement) => {
    if (el) {
      setAnchorEl(el);
      placeBy(el);
    }
    setSelectedBoxId((prev) => (prev === boxId ? null : boxId));
  };

  // Render box popup
  const getSelectedBoxesContent = () => {
    if (!selectedBoxId) return null;
    const box = boxes.find((b) => String(b.id) === String(selectedBoxId));
    if (!box) return null;
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
  };

  const content = getSelectedBoxesContent();

  // Close popup on escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedBoxId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Handles popup position on scroll/resize
  useEffect(() => {
    if (!anchorEl || !selectedBoxId) return;
    const onScrollOrResize = () => placeBy(anchorEl);
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [anchorEl, selectedBoxId]);

  // Handle loading and error states
  if (isLoadingBoxes) {
    return <div className="p-6">Loading inventory data...</div>;
  }

  // HTML for loading
  if (isBoxesError) {
    return (
      <div className="p-6 text-red-500">
        Error loading inventory: {boxesError?.message}
      </div>
    );
  }

  if (isLoading) {
    return <span></span>;
  }

  // Filter for search box filters
  const filteredLogs = activityLogs?.filter((log) => {
    var isInDate = true;
    var isCorrectAction = true;
    var isCorrectName = log.box_name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (action != "allActions" && action != log.action) {
      isCorrectAction = false;
    }

    if (startDate > new Date(log.moved_at!)) {
      isInDate = false;
    }

    if (endDate < new Date(log.moved_at!)) {
      isInDate = false;
    }

    return isInDate && isCorrectAction && isCorrectName;
  });

  return (
    <>
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        setAction={setAction}
        onRefetch={refetch}
      />
      <Card>
        <CardContent className="mt-6">
          <ActivityLogTable
            filteredData={filteredLogs!}
            isLoading={isLoading}
            onBoxSelect={handleSelectBox}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default ActivityLog;
