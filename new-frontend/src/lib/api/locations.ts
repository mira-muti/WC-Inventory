import { Location, LocationInsert, LocationUpdate } from "@/types/location";
import { supabase } from "../supabaseClient";

export const locationApi = {
  getLocations: async () => {
    const { data, error } = await supabase.from("locations").select();
    if (error) throw new Error(error.message);

    return data as Location[];
  },

  createLocation: async (newLocation: LocationInsert) => {
    const { data, error } = await supabase
      .from("locations")
      .insert(newLocation)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  updateLocation: async ({
    id,
    data,
  }: {
    id: string;
    data: LocationUpdate;
  }) => {
    const { data: updatedLocation, error } = await supabase
      .from("locations")
      .update(data)
      .eq("location_id", id)
      .select()
      .single();

    if (error) throw error;
    return updatedLocation;
  },

  deleteLocation: async (id: string) => {
    const { error } = await supabase
      .from("locations")
      .delete()
      .eq("location_id", id);

    if (error) throw error;
  },
};

export const fetchLocationsByParent = async (parentId: string | null) => {
  try {
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .eq("parent_id", parentId)
      .order("name");

    if (error) throw error;
    return data as Location[];
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
};

export const fetchLocationHierarchy = async (locationId: string) => {
  const { data, error } = await supabase.rpc("get_location_hierarchy", {
    location_id: locationId,
  });

  if (error) throw error;
  return data as Location[];
};

export const getLocationName = async (locationId: string): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from("locations")
      .select("name")
      .eq("location_id", locationId)
      .single();

    if (error) throw error;
    return data?.name || "";
  } catch (error) {
    console.error("Error fetching location name:", error);
    return "";
  }
};

export type { Location };
