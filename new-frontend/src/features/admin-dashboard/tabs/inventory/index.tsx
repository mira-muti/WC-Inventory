import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useInventory } from "../../hooks/useInventory";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useBoxDetails } from "../../hooks/useBoxDetails";
import BoxDetailsSlideOver from "./components/BoxDetailsSlideOver";
import { GenderEnum } from "@/types/enums";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { getSizeWeight } from "@/lib/utils/size"; 
import * as XLSX from "xlsx";



const Inventory = () => {
  const { data: inventory, isLoading, error } = useInventory();

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );
  const [currentDate, setCurrentDate] = useState<Dayjs | null>(dayjs());

  const [expandedGenders, setExpandedGenders] = useState<Set<string>>(
    new Set(),
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [selectedItem, setSelectedItem] = useState<
    {
      categoryId: string;
      categoryName: string;
      sizeId: string | null;
      sizeName: string | null;
      gender: GenderEnum | null;
    } | null
  >(null);

  const { data: boxDetails, isLoading: boxDetailsLoading } = useBoxDetails(
    selectedItem?.categoryId ?? "",
    selectedItem?.sizeId ?? null,
    selectedItem?.gender ?? null,
    { enabled: !!selectedItem },
  );

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };
  const toggleGender = (categoryId: string, gender: string) => {
    const key = `${categoryId}-${gender}`;
    setExpandedGenders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id); //deselect item
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSizeClick = (
    categoryId: string,
    categoryName: string,
    sizeId: string | null,
    sizeName: string | null,
    gender: GenderEnum | null,
  ) => {
    setSelectedItem({ categoryId, categoryName, sizeId, sizeName, gender });
  };
  
  const exportToExcel = () => {
    if (!inventory) return;
  
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const viewedDate = currentDate ? currentDate.format("MM/DD/YYYY") : "N/A";
  

    const rows: any[][] = [];
    rows.push([`Inventory as of: ${viewedDate}`]);
    rows.push([]); 
    rows.push(["Category", "Gender", "Size", "Available", "New Stock", "Donations"]);
  
    const sortedInventory = [...inventory].sort((a, b) =>
      a.category_name.localeCompare(b.category_name)
    );
  
    for (const category of sortedInventory) {
      const categoryTotal = getAmount(category.items);
      const categoryNewStock = getRefills(category.items, currentDate);
      const categoryDonations = getDistributions(category.items, currentDate);
  
      rows.push([category.category_name, "", "", categoryTotal, categoryNewStock, categoryDonations]);
  
      for (const gender of [...category.genders].sort((a, b) =>
        a.gender.localeCompare(b.gender)
      )) {
        const sizeTotals: Record<string, { qty: number; newStock: number; donations: number }> = {};
  
        for (const size of gender.sizes) {
          const key = size.size_name || "No Size";
          const qty = getAmount(size.items);
          const newStock = getRefills(size.items, currentDate);
          const donations = getDistributions(size.items, currentDate);
  
          if (!sizeTotals[key]) sizeTotals[key] = { qty: 0, newStock: 0, donations: 0 };
          sizeTotals[key].qty += qty;
          sizeTotals[key].newStock += newStock;
          sizeTotals[key].donations += donations;
        }
  
        const genderTotal = Object.values(sizeTotals).reduce((s, v) => s + v.qty, 0);
        const genderNewStock = Object.values(sizeTotals).reduce((s, v) => s + v.newStock, 0);
        const genderDonations = Object.values(sizeTotals).reduce((s, v) => s + v.donations, 0);
  
        rows.push(["", gender.gender, "", genderTotal, genderNewStock, genderDonations]);
  
        Object.entries(sizeTotals)
          .sort(([a], [b]) => getSizeWeight(a) - getSizeWeight(b))
          .forEach(([sizeName, { qty, newStock, donations }]) => {
            rows.push(["", "", String(sizeName), qty, newStock, donations]);
          });
      }
    }
  
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
  

    XLSX.writeFile(workbook, `inventory_export_${today}.xlsx`);
  };

  const getAmount = (
    items: { createdAt: string; donatedAt: string; quantity: number }[],
  ) => {
    return items.map((item) => item.quantity).reduce((a, b) => a + b, 0);
  };

  const getRefills = (
    items: { createdAt: string; donatedAt: string; quantity: number }[],
    date: Dayjs | null,
  ) => {
    if (!date) return 0;
    const dateString = date.startOf("day").toISOString().split("T")[0]; // "YYYY-MM-DD"
    return items
      .filter((item) => {
        const createdDate =
          dayjs(item.createdAt).startOf("day").toISOString().split("T")[0];
        return createdDate === dateString;
      })
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  const getDistributions = (
    items: { createdAt: string; donatedAt: string; quantity: number }[],
    date: Dayjs | null,
  ) => {
    if (!date) return 0;
    const dateString = date.startOf("day").toISOString().split("T")[0];
    return items
      .filter((item) =>
        item.donatedAt &&
        dayjs(item.donatedAt).startOf("day").toISOString().split("T")[0] ===
          dateString
      )
      .reduce((sum, item) => sum + item.quantity, 0);
  };
  if (isLoading) return <div>Loading inventory...</div>;
  if (error) {
    return <div>Error loading inventory: {(error as Error).message}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex gap-4 mb-6">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={currentDate}
            onChange={(val) => setCurrentDate(val)}
            slotProps={{
              textField: {
                InputProps: {
                  sx: {
                    height: "40px",
                    pl: "5px",
                    backgroundColor: "transparent",
                  },
                },
                sx: {
                  width: "15rem",
                  height: "41px",
                  borderRadius: "0.3rem",
                  border: "1px solid #e0e0e0",
                  backgroundColor: "white",

                  // 💡 Style the input text when NOT focused and when focused
                  "& .MuiInputBase-input": {
                    color: "#000", // Make the input text black
                    fontWeight: 400,
                    fontSize: "0.875rem",
                    fontFamily: "Poppins",
                  },

                  // 💡 Style the placeholder text
                  "& .MuiInputBase-input::placeholder": {
                    color: "#000", // Force black placeholder
                    opacity: 1, // Required to make the color show
                  },

                  "& .MuiOutlinedInput-root": {
                    height: "40px",
                    "& fieldset": { border: "none" },
                    "&:hover fieldset": { border: "none" },
                    "&.Mui-focused fieldset": { border: "none" },
                  },
                },
              },
            }}
          />
        </LocalizationProvider>
        <Button 
          onClick={exportToExcel}
          className="h-[39px]"
        >
          Export to Excel
          </Button>
      </div>

      <Card className="mt-6 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Items</TableHead>
              <TableHead className="font-bold">Current Inventory</TableHead>
              <TableHead className="font-bold">New Stock</TableHead>
              <TableHead className="font-bold">Donations</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(inventory ?? [])
            .sort((a, b) => a.category_name.localeCompare(b.category_name))
            .map((item) => (
              <>
                <TableRow
                  key={item.category_id}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleCategory(item.category_id)}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {expandedCategories.has(item.category_id)
                        ? <ChevronDown size={16} />
                        : <ChevronRight size={16} />}
                      {item.category_name}
                    </div>
                  </TableCell>
                  <TableCell>{getAmount(item.items)}</TableCell>
                  <TableCell>{getRefills(item.items, currentDate)}</TableCell>
                  <TableCell>
                    {getDistributions(item.items, currentDate)}
                  </TableCell>
                </TableRow>
                {expandedCategories.has(item.category_id) &&
                  [...item.genders]
                  .sort((a, b) => a.gender.localeCompare(b.gender))
                  .map((genderItem) => (
                    <>
                      <TableRow
                        key={`${item.category_id}-${genderItem.gender}`}
                        className="cursor-pointer hover:bg-gray-100"
                        onClick={() =>
                          toggleGender(item.category_id, genderItem.gender)}
                      >
                        <TableCell className="pl-8">
                          <div className="flex items-center gap-2">
                            {expandedGenders.has(
                                `${item.category_id}-${genderItem.gender}`,
                              )
                              ? <ChevronDown size={16} />
                              : <ChevronRight size={16} />}
                            {genderItem.gender}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getAmount(
                            genderItem.sizes.flatMap((size) => size.items),
                          )}
                        </TableCell>
                        <TableCell>
                          {getRefills(
                            genderItem.sizes.flatMap((size) => size.items),
                            currentDate,
                          )}
                        </TableCell>
                        <TableCell>
                          {getDistributions(
                            genderItem.sizes.flatMap((size) => size.items),
                            currentDate,
                          )}
                        </TableCell>
                      </TableRow>
                      {expandedGenders.has(
                        `${item.category_id}-${genderItem.gender}`,
                      ) &&
                      [...genderItem.sizes].sort((a, b) =>  getSizeWeight(a.size_name) - getSizeWeight(b.size_name)).map((size) => (
                          <TableRow
                            key={`${item.category_id}-${genderItem.gender}-${
                              size.size_id || "no-size"
                            }`}
                            className="cursor-pointer hover:bg-gray-100"
                            onClick={() =>
                              handleSizeClick(
                                item.category_id,
                                item.category_name,
                                size.size_id,
                                size.size_name,
                                size.gender,
                              )}
                          >
                            <TableCell className="pl-12">
                              {size.size_name}
                            </TableCell>
                            <TableCell>{getAmount(size.items)}</TableCell>
                            <TableCell>
                              {getRefills(size.items, currentDate)}
                            </TableCell>
                            <TableCell>
                              {getDistributions(size.items, currentDate)}
                            </TableCell>
                          </TableRow>
                        ))}
                    </>
                  ))}
              </>
            ))}
          </TableBody>
        </Table>
      </Card>

      <BoxDetailsSlideOver
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        categoryName={selectedItem?.categoryName || ""}
        sizeName={selectedItem?.sizeName || null}
        boxDetails={boxDetails}
        isLoading={boxDetailsLoading}
      />
    </div>
  );
};

export default Inventory;
