import { Category, CategoryInsert, CategoryUpdate } from "@/types/category";
import { supabase } from "./supabaseClient";
import { Location, LocationInsert, LocationUpdate } from "@/types/location";
import * as Sentry from "@sentry/react";

/**
 * Fetch all categories.
 */
export const fetchCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    Sentry.captureException(error);
    throw new Error(error.message);
  }

  return data as Category[];
};

/**
 * Fetch a single category by ID.
 */
export const fetchCategoryById = async (
  categoryId: string,
): Promise<Category | null> => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("category_id", categoryId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    Sentry.captureException(error);
    throw new Error(error.message);
  }

  return data as Category;
};

/**
 * Create a new category.
 */
export const createCategory = async (
  category: CategoryInsert,
): Promise<Category> => {
  const { data, error } = await supabase
    .from("categories")
    .insert(category)
    .select("*")
    .single();

  if (error) {
    Sentry.captureException(error);
    throw new Error(error.message);
  }

  return data as Category;
};

/**
 * Update an existing category.
 */
export const updateCategory = async (
  categoryId: string,
  updates: CategoryUpdate,
): Promise<Category> => {
  const { data, error } = await supabase
    .from("categories")
    .update(updates)
    .eq("category_id", categoryId)
    .select("*")
    .single();

  if (error) {
    Sentry.captureException(error);
    throw new Error(error.message);
  }

  return data as Category;
};

/**
 * Delete a category.
 */
export const deleteCategory = async (categoryId: string): Promise<void> => {
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("category_id", categoryId);

  if (error) {
    Sentry.captureException(error);
    throw new Error(error.message);
  }
};

/**
 * Delete boxes 
 */
export const deleteBoxes = async (boxIds: string[]): Promise<void> => {
  for (const boxId of boxIds) {
   
    const { error: contentsError } = await supabase
      .from("box_contents")
      .delete()
      .eq("box_id", boxId);

    if (contentsError) throw new Error(contentsError.message);

    
    const { error: boxError } = await supabase
      .from("boxes")
      .delete()
      .eq("box_id", boxId);

    if (boxError) throw new Error(boxError.message);
  }
};




/**
 * Fetch all locations.
 */
export const fetchLocations = async (): Promise<Location[]> => {
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    Sentry.captureException(error);
    throw new Error(error.message);
  }

  return data as Location[];
};

/**
 * Fetch a single location by ID.
 */
export const fetchLocationById = async (
  locationId: string,
): Promise<Location | null> => {
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("location_id", locationId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    Sentry.captureException(error);
    throw new Error(error.message);
  }

  return data as Location;
};

/**
 * Create a new location.
 */
export const createLocation = async (
  location: LocationInsert,
): Promise<Location> => {
  const { data, error } = await supabase
    .from("locations")
    .insert(location)
    .select("*")
    .single();

  if (error) {
    Sentry.captureException(error);
    throw new Error(error.message);
  }

  return data as Location;
};

/**
 * Update an existing location.
 */
export const updateLocation = async (
  locationId: string,
  updates: LocationUpdate,
): Promise<Location> => {
  const { data, error } = await supabase
    .from("locations")
    .update(updates)
    .eq("location_id", locationId)
    .select("*")
    .single();

  if (error) {
    Sentry.captureException(error);
    throw new Error(error.message);
  }

  return data as Location;
};

/**
 * Delete a location.
 */
export const deleteLocation = async (locationId: string): Promise<void> => {
  const { error } = await supabase
    .from("locations")
    .delete()
    .eq("location_id", locationId);

  if (error) {
    Sentry.captureException(error);
    throw new Error(error.message);
  }
};



