// types/location.ts
import { Database } from "./supabase";

type LocationTable = Database["public"]["Tables"]["locations"];

export type Location = LocationTable["Row"];

export type LocationUpdate = LocationTable["Update"];

export type LocationInsert = LocationTable["Insert"];
