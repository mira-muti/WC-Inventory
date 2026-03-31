import { supabase } from "..//supabaseClient.ts";
import { SizeInsert, SizeUpdate } from "@/types/size.ts";

export const sizeApiKeys = {
  all: ["all"] as const,
};

//Creating an API object to handle operations related to sizes
// (export means make it available outside this file, const means make sizeApi not re-assignable to a different object)
export const sizeApi = {
  getSizes: async () => {
    //asynchronus function (excecutes in one block / strict sequence)
    const { data, error } = await supabase.from("sizes").select(`
                *,
                box_contents (
                    size_id
                )
            `);

    if (error) throw new Error(error.message);

    // If data is successfully fetched, map over the results to include a "usageCount"
    if (data) {
      return data.map((size) => ({
        ...size,
        usageCount: size.box_contents?.length || 0, // Add a usage count based on the box contents length, defaulting to 0 if no box contents are found
      }));
    } else {
      throw new Error("500, No data was fetched!! Size data is null!");
    }
  },

  createSize: async (newSize: SizeInsert) => {
    const { data, error } = await supabase
      .from("sizes")
      .insert(newSize)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  },

  checkSizeUsage: async (sizeId: string): Promise<number> => {
    const { data, error } = await supabase
      .from("box_contents")
      .select("*")
      .eq("size_id", sizeId);

    if (error) {
      throw new Error(error.message);
    }

    return data?.length || 0;
  },

  updateSize: async (id: string, updatedSize: SizeUpdate) => {
    const { data, error } = await supabase
      .from("sizes")
      .update(updatedSize)
      .eq("size_id", id)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  },

  // Deletes a size based on its ID
  deleteSize: async (id: string) => {
    try {
      // First, check if the size is in use by querying the "box_contents" table
      const { data: boxContents, error: countError } = await supabase
        .from("box_contents")
        .select("*")
        .eq("size_id", id);

      // If there's an error fetching the count, throw the error
      if (countError) throw countError;

      // If the size is still in use (i.e., count > 0), prevent deletion and throw an error
      if (boxContents && boxContents.length > 0) {
        throw new Error(
          `Cannot delete size as it is used by ${boxContents.length} items.`,
        );
      }

      // If the size is not in use, proceed with deletion
      const { error } = await supabase.from("sizes").delete().eq("size_id", id);

      // If an error occurs during deletion, throw the error
      if (error) throw error;
    } catch (error: any) {
      throw new Error(error.message || "Failed to delete size");
    }
  },
};
