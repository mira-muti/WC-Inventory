import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useSearchFiltersQueries } from "../hooks/useSearchFiltersQueries";
import { Search } from "lucide-react";
import { SearchBar } from "@/components/search-bar";

interface SearchFiltersProps {
  onSearch: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSizeChange: (value: string) => void;
  onGenderChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  actionButtons?: React.ReactNode;
}

const SearchFilters = ({
  onSearch,
  onCategoryChange,
  onSizeChange,
  onGenderChange,
  onStatusChange,
  actionButtons,
}: SearchFiltersProps) => {
  const { categories, sizes } = useSearchFiltersQueries();
  const genders = ["Male", "Female", "Unisex", "Kids"];
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [selectedSizeId, setSelectedSizeId] = useState<string>("all");
  const [selectedGender, setSelectedGender] = useState<string>("all");

  const handleCategoryChange = (value: string) => {
    setSelectedCategoryId(value);
    // onCategoryChange needs category name for filter logic
    const selected = categories?.find((c) => c.category_id === value);
    onCategoryChange(value === "all" ? "all" : (selected?.name ?? "all"));
  };

  const handleSizeChange = (value: string) => {
    setSelectedSizeId(value);
    // onSizeChange needs size name for filter logic
    const selected = sizes?.find((s) => s.size_id === value);
    onSizeChange(value === "all" ? "all" : (selected?.name ?? "all"));
  };

  const handleGenderChange = (value: string) => {
    setSelectedGender(value);
    onGenderChange(value);
  };

  const SHOE_CATEGORY_ID = "f9998911-97c2-43fb-86ef-b63162758a55";
  const SHOE_SIZES_IDS = sizes
    ?.filter((size) => size.category === "Shoe")
    .map((x) => x.size_id);
  // size.gender does not have "Kid", has "Unisex" instead
  const KID_SIZES_IDS = sizes
    ?.filter((size) => size.category === "Kid")
    .map((x) => x.size_id);
  // both size.category does not have "Female" or "Male", "Adult" instead
  const MALE_SIZES_IDS = sizes
    ?.filter((size) => size.gender === "Male")
    .map((x) => x.size_id);
  const FEMALE_SIZES_IDS = sizes
    ?.filter((size) => size.gender === "Female")
    .map((x) => x.size_id);

  // add useMemo if sizes, categories or genders grow large or cause re-render lag

  const filteredSizes = sizes?.filter(
    (size) =>
      (selectedCategoryId === SHOE_CATEGORY_ID
        ? size.category === "Shoe"
        : selectedCategoryId !== "all"
          ? size.category !== "Shoe"
          : true) &&
      (selectedGender === "Male"
        ? size.gender === "Male"
        : selectedGender === "Unisex" || selectedGender === "Kids"
          ? size.gender === "Unisex"
          : selectedGender === "Female"
            ? size.gender === "Female"
            : true),
  );

  const filteredCategories = SHOE_SIZES_IDS?.includes(selectedSizeId)
    ? categories?.filter((category) => category.name === "Shoes")
    : selectedSizeId !== "all"
      ? categories?.filter((category) => category.name !== "Shoes")
      : categories;

  const filteredGenders = MALE_SIZES_IDS?.includes(selectedSizeId)
    ? genders?.filter((gender) => gender === "Male")
    : FEMALE_SIZES_IDS?.includes(selectedSizeId)
      ? genders?.filter((gender) => gender === "Female")
      : KID_SIZES_IDS?.includes(selectedSizeId)
        ? genders?.filter((gender) => gender === "Unisex" || gender === "Kids")
        : genders;

  return (
    <div className="flex justify-between items-center gap-4">
      <div className="flex-1 flex gap-4">
        <div className="flex flex-1 relative">
          <Input
            placeholder="Search by box ID…"
            className="max-w-xs bg-white pl-9"
            onChange={(e) => onSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>

        <Select defaultValue="all" onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-32 bg-white">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Items</SelectItem>
            {filteredCategories?.map((category) => (
              <SelectItem
                key={category.category_id}
                value={category.category_id} // can't guarantee unique category name, use category id
              >
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select defaultValue="all" onValueChange={handleSizeChange}>
          <SelectTrigger className="w-32 bg-white">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sizes</SelectItem>
            {filteredSizes?.map((size) => (
              <SelectItem
                key={size.size_id}
                value={size.size_id} // can't guarantee unique size name, use size id
              >
                {size.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select defaultValue="all" onValueChange={handleGenderChange}>
          <SelectTrigger className="w-32 bg-white">
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genders</SelectItem>
            {filteredGenders?.map((g) => (
              <SelectItem key={g} value={g}>
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select defaultValue="Active" onValueChange={onStatusChange}>
          <SelectTrigger className="w-32 bg-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="Active" value="Active">
              Active
            </SelectItem>
            <SelectItem key="Donated" value="Donated">
              Donated
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      {actionButtons}
    </div>
  );
};

export default SearchFilters;
