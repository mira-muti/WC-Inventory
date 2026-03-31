import { Database } from "./supabase";

type BoxContentTable = Database["public"]["Tables"]["box_contents"];

export type BoxContent = BoxContentTable["Row"];
export type InsertBoxContent = BoxContentTable["Insert"];
