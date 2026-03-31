import { Category, CategoryInsert, CategoryUpdate } from "@/types/category";
import { supabase } from "../supabaseClient";
import { deleteCategory, updateCategory } from "../api";

export const categoryApi = {

    getCategories: async () => {
        const { data, error } = await supabase
            .from("categories")
            .select()
        if (error) throw new Error(error.message);

        return data as Category[];
    },
    createCategory: async (newCategory: CategoryInsert) => {
        const { data, error } = await supabase
            .from("categories")
            .insert(newCategory)
            .select("*")
            .single();

        if (error) throw error;
        return data;
    },
    updateCategory: async (id: string, updatedCategory: CategoryUpdate) => {
        const { data, error } = await supabase
            .from("categories")
            .update(updatedCategory)
            .eq("category_id", id)
            .select("*")
            .single();

        if (error) throw error;
        return data;
    },
    deleteCategory: async (id: string) => {
        const { error } = await supabase
            .from("categories")
            .delete()
            .eq("category_id", id);

        if (error) throw error
    },
};