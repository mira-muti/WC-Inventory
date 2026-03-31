import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo, useEffect } from "react";
import { Category } from "@/types/category";
import { SizeWithUsage } from "@/types/size.ts";

interface ItemFiltersProps {
  categories?: Category[];
  sizes?: SizeWithUsage[];
  selectedCategoryId: string;
  selectedSizeId: string;
  selectedGender: string;
  selectedStatus: string;
  selectedSizeGroup: string;
  onCategoryChange: (value: string) => void;
  onSizeChange: (value: string) => void;
  onGenderChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSizeGroupChange: (value: string) => void;
}

const ItemFilters = ({
  categories,
  sizes,
  selectedCategoryId,
  selectedSizeId,
  selectedGender,
  selectedStatus,
  selectedSizeGroup,
  onCategoryChange,
  onSizeChange,
  onGenderChange,
  onStatusChange,
  onSizeGroupChange,
}: ItemFiltersProps) => {
  const genders = ["Male", "Female", "Unisex", "Kids"];
  const activeItems = selectedStatus === "Active";

  const SHOE_CATEGORY_ID = "f9998911-97c2-43fb-86ef-b63162758a55";
  const SHOE_SIZES_IDS = sizes?.filter((size) => size.size_group === "Shoe").map((x) => x.size_id);
  // size.gender does not have "Kid", has "Unisex" instead
  const KID_SIZES_IDS = sizes?.filter((size) => size.size_group === "Kid").map((x) => x.size_id);
  // both size.size_group does not have "Female" or "Male", "Adult" instead
  const MALE_SIZES_IDS = sizes?.filter((size) => size.gender === "Male").map((x) => x.size_id);
  const FEMALE_SIZES_IDS = sizes?.filter((size) => size.gender === "Female").map((x) => x.size_id);

  // get unique size groups from sizes data, filtered by selected category
  const sizeGroups = useMemo(() => {
    if (!sizes) {
      return []
    };
    
    // filter sizes based on selected category first
    const relevantSizes = selectedCategoryId === SHOE_CATEGORY_ID
      ? sizes.filter((size) => size.size_group === "Shoe")
      : selectedCategoryId !== "all"
        ? sizes.filter((size) => size.size_group !== "Shoe")
        : sizes;
    
    const uniqueGroups = Array.from(new Set(relevantSizes.map((size) => size.size_group).filter((sg): sg is string => sg !== undefined)));

    return uniqueGroups.sort();
  }, [sizes, selectedCategoryId, SHOE_CATEGORY_ID]);

  const filteredSizes = useMemo(() => 
    sizes?.filter(
      (size) =>
          (selectedCategoryId === SHOE_CATEGORY_ID
            ? size.size_group === "Shoe"
            : selectedCategoryId !== "all"
              ? size.size_group !== "Shoe"
              : true
          )
          &&
          (selectedGender === "Male"
            ? size.gender === "Male"
            : (selectedGender === "Unisex" || selectedGender === "Kids")
              ? size.gender === "Unisex"
              : selectedGender === "Female"
                ? size.gender === "Female"
                : true
          )
          &&
          (selectedSizeGroup !== "all"
            ? size.size_group === selectedSizeGroup
            : true
          )
    ),
    [sizes, selectedCategoryId, selectedGender, selectedSizeGroup]
  );

  const filteredCategories = useMemo(() => {
    // filter based on selected size
    if (SHOE_SIZES_IDS?.includes(selectedSizeId)) {
      return categories?.filter((category) => category.name === "Shoes");
    }
    if (selectedSizeId !== "all") {
      return categories?.filter((category) => category.name !== "Shoes");
    }
    
    // filter based on selected size group
    if (selectedSizeGroup === "Shoe") {
      return categories?.filter((category) => category.name === "Shoes");
    }
    if (selectedSizeGroup !== "all") {
      return categories?.filter((category) => category.name !== "Shoes");
    }
    
    return categories;
  }, [categories, selectedSizeId, selectedSizeGroup, SHOE_SIZES_IDS]);

  const filteredGenders = useMemo(() => {
    // filter based on selected size first (most specific)
    if (MALE_SIZES_IDS?.includes(selectedSizeId)) {
      return genders?.filter((gender) => gender === "Male");
    }
    if (FEMALE_SIZES_IDS?.includes(selectedSizeId)) {
      return genders?.filter((gender) => gender === "Female");
    }
    if (KID_SIZES_IDS?.includes(selectedSizeId)) {
      return genders?.filter((gender) => (gender === "Unisex" || gender === "Kids"));
    }
    
    // filter based on selected size group
    if (selectedSizeGroup === "Adult") {
      return genders?.filter((gender) => gender === "Male" || gender === "Female" || gender === "Unisex");
    }
    if (selectedSizeGroup === "Kid") {
      return genders?.filter((gender) => gender === "Unisex" || gender === "Kids");
    }
    if (selectedSizeGroup === "Shoe") {
      return genders?.filter((gender) => gender === "Male" || gender === "Female" || gender === "Unisex");
    }
    
    // filter based on selected category
    if (selectedCategoryId === SHOE_CATEGORY_ID) {
      return genders?.filter((gender) => gender === "Male" || gender === "Female" || gender === "Unisex");
    }
    
    return genders;
  }, [genders, selectedSizeId, selectedSizeGroup, selectedCategoryId, MALE_SIZES_IDS, FEMALE_SIZES_IDS, KID_SIZES_IDS, SHOE_CATEGORY_ID]);

  // reset size group when category changes and current size group is no longer valid
  useEffect(() => {
    if (selectedSizeGroup !== "all" && !sizeGroups.includes(selectedSizeGroup)) {
      onSizeGroupChange("all");
    }
  }, [selectedCategoryId, selectedSizeGroup, sizeGroups, onSizeGroupChange]);

  // reset category when size group changes and current category is no longer valid
  useEffect(() => {
    if (selectedCategoryId !== "all" && filteredCategories && !filteredCategories.some(cat => cat.category_id === selectedCategoryId)) {
      onCategoryChange("all");
    }
  }, [selectedSizeGroup, selectedCategoryId, filteredCategories, onCategoryChange]);

  // reset gender when size group or category changes and current gender is no longer valid
  useEffect(() => {
    if (selectedGender !== "all" && !filteredGenders.includes(selectedGender)) {
      onGenderChange("all");
    }
  }, [selectedSizeGroup, selectedCategoryId, selectedGender, filteredGenders, onGenderChange]);

  // reset size selection when it is no longer valid after any filter change
  useEffect(() => {
    if (selectedSizeId !== "all" && filteredSizes && !filteredSizes.some(size => size.size_id === selectedSizeId)) {
      onSizeChange("all");
    }
  }, [selectedSizeGroup, selectedCategoryId, selectedGender, selectedSizeId, filteredSizes, onSizeChange]);


  return (

    <div className="h-full w-full flex flex-col justify-center">

      <div className="h-[45vh] flex flex-col justify-start gap-6">

        <button
          className="w-[92%] h-14 mx-auto flex items-center justify-center border-2 border-gray-200 
                    rounded-lg text-xl font-medium"
          onClick={() => onStatusChange(activeItems ? "Donated" : "Active")}
        >
          {activeItems ? "Active" : "Donated"}
        </button>

        <Select value={selectedCategoryId} onValueChange={onCategoryChange}>
          <SelectTrigger
            className="w-[92%] h-14 mx-auto flex items-center justify-between border-2 
                      rounded-lg text-xl px-4 [&>svg]:h-6 [&>svg]:w-6"
          >
            <SelectValue placeholder="All Items" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="text-lg text-black" value="all">All Items</SelectItem>
            {filteredCategories?.map(c => (
              <SelectItem className="text-lg text-black" key={c.category_id} value={c.category_id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedSizeGroup} onValueChange={onSizeGroupChange}>
          <SelectTrigger
            className="w-[92%] h-14 mx-auto flex items-center justify-between border-2 
                      rounded-lg text-xl px-4 [&>svg]:h-6 [&>svg]:w-6"
          >
            <SelectValue placeholder="All Size Groups" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="text-lg text-black" value="all">All Size Groups</SelectItem>
            {sizeGroups?.map(sg => (
              <SelectItem className="text-lg text-black" key={sg} value={sg}>
                {sg}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedGender} onValueChange={onGenderChange}>
          <SelectTrigger
            className="w-[92%] h-14 mx-auto flex items-center justify-between border-2 
                      rounded-lg text-xl px-4 [&>svg]:h-6 [&>svg]:w-6"
          >
            <SelectValue placeholder="All Genders" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="text-lg text-black" value="all">All Genders</SelectItem>
            {filteredGenders.map(g => (
              <SelectItem className="text-lg text-black" key={g} value={g}>
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedSizeId} onValueChange={onSizeChange}>
          <SelectTrigger
            className="w-[92%] h-14 mx-auto flex items-center justify-between border-2 
                      rounded-lg text-xl px-4 [&>svg]:h-6 [&>svg]:w-6"
          >
            <SelectValue placeholder="All Sizes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="text-lg text-black" value="all">All Sizes</SelectItem>
            {filteredSizes?.map(s => (
              <SelectItem className="text-lg text-black" key={s.size_id} value={s.size_id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

      </div>

    </div>

  );

};

export default ItemFilters;
