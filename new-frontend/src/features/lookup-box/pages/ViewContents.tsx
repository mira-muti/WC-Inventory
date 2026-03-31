import { useQuery } from "@tanstack/react-query";
import { boxApi } from "@/lib/api/boxes";
import { ArrowLeft } from "lucide-react";
import { BoxStatus } from "@/types/enums";
import BoxDetails from "@/features/admin-dashboard/components/BoxDetails";
import { BoxItem } from "@/types/box";
import { useState } from "react";
import { useNavigate, } from "react-router-dom";
// import { useLocation } from "react-router-dom";
import { useLookupState } from "..";
import Header from "../components/Header";


interface BoxItemWithId {
  id: string;
  type: string;
  gender: "Men" | "Women" | "Kids" | "Unisex";
  size: string;
  quantity: number;
}

interface BoxViewWithNewBoxItem {
  id: string;
  location: string;
  name: string;
  status: BoxStatus;
  contents: BoxItemWithId[];
  createdAt: string;
  updatedAt: string;
}

const ViewContents = () => {
  const navigate = useNavigate();
  const [toggleTotal, setToggleTotal] = useState<boolean>(true);

  // const { state } = useLocation();
  // const selectedBoxIds = state?.boxIds || []; // useLocation state if you want it to persist across refresh
  const { selectedBoxIds, } = useLookupState();

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

  const filteredBoxes = boxes.filter((box) => selectedBoxIds.includes(box.id)) as BoxViewWithNewBoxItem[];

  const getSelectedBoxesContent = () => {
    if (toggleTotal) {
      const combinedContents: Record<string, BoxItem> = {};
      
      filteredBoxes.forEach((box) => {
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
        boxName={`${filteredBoxes.length} boxes selected`}
        location=""
        createdAt=""
        updatedAt=""
        contents={Object.values(combinedContents)}
        isMultiSelect={true}
        />
      );
    }
    else {
      return (
        <>
          {filteredBoxes.map((box) => (
              <BoxDetails 
                boxName={box.name}
                location={box.location || ""}
                createdAt={box.createdAt || ""}
                updatedAt={box.updatedAt || ""}
                contents={box.contents}
              />
          ))}
        </>
      );
    } 
  };

  const handleGoBack = () => {
    navigate("/lookup/filter-results");
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
    <div className="h-screen flex flex-col gap-5 items-center bg-white overflow-hidden">
      
      <div className="w-full max-w-screen-md mb-2">

        <Header
          handleGoBack={handleGoBack}
          title={"Content View"}
        />

        <div className="flex justify-end gap-2 px-4">
          <span>
            Box
          </span>
          <div
            onClick={() => setToggleTotal(!toggleTotal)}
            className="relative w-12 h-6 rounded-full cursor-pointer transition-colors bg-blue-500"
          >
            <div
              className={`
                absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow transition-transform
                ${toggleTotal ? "translate-x-6" : "translate-x-0"}
              `}
            />
          </div>
          <span>
            Total
          </span>
        </div>

      </div>

      <div className="flex-1 w-full max-w-screen-md overflow-y-auto p-2 space-y-6">

        {filteredBoxes.length === 0 && (
          <p className="text-gray-500 text-lg text-center py-6">
            No boxes selected
          </p>
        )}

        {filteredBoxes.length !== 0 && getSelectedBoxesContent()}

      </div>

    </div>
  );

};

export default ViewContents;
