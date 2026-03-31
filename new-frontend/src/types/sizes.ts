import { Database } from "./supabase";

type SizeTable = Database["public"]["Tables"]["sizes"];

export type Size = SizeTable["Row"];

