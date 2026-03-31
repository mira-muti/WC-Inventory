import { supabase } from "@/lib/supabaseClient";
import { BoxStatus, GenderEnum } from "@/types/enums";
import { useQuery } from "@tanstack/react-query";

interface RawBoxContent {
  category_id: string;
  quantity: number;
  gender: string;
  size_id: string | null;
  categories: { name: string };
  sizes: { name: string } | null;
  boxes: { status: BoxStatus; created_at: string; donated_at: string };
}

interface SizeItem {
  size_id: string | null;
  size_name: string | null;
  gender: GenderEnum | null;
  items: { createdAt: string; donatedAt: string; quantity: number }[];
}

interface GenderItem {
  gender: string;
  sizes: SizeItem[];
}

export interface InventoryItem {
  category_id: string;
  category_name: string;
  items: { createdAt: string; donatedAt: string; quantity: number }[];
  genders: GenderItem[];
}

// Define intermediate aggregation types
interface SizeAggregation {
  size_id: string | null;
  size_name: string | null;
  items: { createdAt: string; donatedAt: string; quantity: number }[];
  gender: GenderEnum | null;
}

interface GenderAggregation {
  gender: string;
  sizes: Record<string, SizeAggregation>;
}

interface CategoryAggregation {
  category_id: string;
  category_name: string;
  items: { createdAt: string; donatedAt: string; quantity: number }[];
  genders: Record<string, GenderAggregation>;
}

const fetchInventory = async (): Promise<InventoryItem[]> => {
  const { data, error } = await supabase
    .from("box_contents")
    .select(`
      category_id,
      quantity,
      gender,
      size_id,
      categories (name),
      sizes (name),
      boxes (status, created_at, donated_at)
    `)
    .returns<RawBoxContent[]>();

  if (error) throw new Error(error.message);
  if (!data) return [];

  const aggregatedData = data.reduce(
    (acc: Record<string, CategoryAggregation>, item: RawBoxContent) => {
      const categoryId = item.category_id;
      const categoryName = item.categories.name;
      const gender = item.gender;
      const sizeId = item.size_id || "no-size"; // Handle null size_id
      const sizeName = item.sizes?.name || "No Size";
      const quantity = item.quantity;
      const createdAt = item.boxes.created_at;
      const donatedAt = item.boxes.donated_at;

      // Initialize category if it doesn't exist
      if (!acc[categoryId]) {
        acc[categoryId] = {
          category_id: categoryId,
          category_name: categoryName,
          items: [],
          genders: {},
        };
      }

      // Update total quantity
      acc[categoryId].items.push({
        createdAt,
        donatedAt,
        quantity,
      });

      // Initialize gender if it doesn't exist
      if (!acc[categoryId].genders[gender]) {
        acc[categoryId].genders[gender] = {
          gender,
          sizes: {},
        };
      }

      // Initialize size if it doesn't exist
      if (!acc[categoryId].genders[gender].sizes[sizeId]) {
        acc[categoryId].genders[gender].sizes[sizeId] = {
          size_id: item.size_id, // Keep original null value
          size_name: sizeName,
          items: [],
          gender: gender as GenderEnum,
        };
      }

      // Update quantity
      acc[categoryId].genders[gender].sizes[sizeId].items.push({
        createdAt,
        donatedAt,
        quantity,
      });

      return acc;
    },
    {},
  );

  // Transform aggregated data into final format
  //TODO: Type Issue!
  return Object.values(aggregatedData).map((item: CategoryAggregation) => ({
    category_id: item.category_id,
    category_name: item.category_name,
    items: item.items,
    genders: Object.values(item.genders).map((gender: GenderAggregation) => ({
      gender: gender.gender,
      sizes: Object.values(gender.sizes),
    })),
  }));
};

export const useInventory = () => {
  return useQuery<InventoryItem[], Error>({
    queryKey: ["inventory"],
    queryFn: fetchInventory,
  });
};
