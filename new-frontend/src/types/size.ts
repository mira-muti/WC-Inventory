import {Database} from "./supabase"

type SizeTable= Database["public"]["Tables"]["sizes"] //specifying the table from supabase

// These are TypeScript types derived from the "sizes" table definition in Supabase
// `Size` refers to the full row of data in the "sizes" table
export type Size = SizeTable["Row"]

// `SizeInsert` represents the data structure expected when inserting a new record into the "sizes" table
export type SizeInsert = SizeTable["Insert"]

// `SizeUpdate` represents the data structure for updating a record in the "sizes" table
export type SizeUpdate = SizeTable["Update"]

// `SizeFormData` is a type representing the size data, excluding fields that are auto-generated in Supabase
// (size_id, created_at, and updated_at). These fields are typically managed by Supabase itself.
//export type SizeFormData= Omit<Size, "size_id" | "created_at" | "updated_at">
export interface SizeFormData {
    name: string;
    category: SizeCategoryEnum;
    region: SizeRegionEnum;
    gender: GenderEnum;
    is_numerical: boolean;
    numerical_value: number | null;
}

export type SizeCategoryEnum = "Adult" | "Kid" | "Shoe" | "Other"

export type SizeRegionEnum = "US" | "EU" | "UK" | "INT"

export type GenderEnum= "Male" | "Female" | "Kids" | "Unisex"

// Interface extending the `Size` type, adding an optional `usageCount` field that tracks how many times the size has been used
// also includes size_group which is the API response field name (while category is the DB field name)
export interface SizeWithUsage extends Size{
    usageCount?:number;
    size_group?: string; // API returns this field instead of category
}

