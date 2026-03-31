import { Database } from "./supabase";

type CategoryTable = Database["public"]["Tables"]["categories"];

export type Category = CategoryTable["Row"];

export type CategoryInsert = CategoryTable["Insert"];

export type CategoryUpdate = CategoryTable["Update"];

export type CategoryFormData = Omit<Category, "category_id">;

