import { Database } from "./supabase";

type BoxMovementsTable = Database["public"]["Tables"]["box_movements"];
type BoxMovementsView = Database["public"]["Views"]["box_movements_view"];
export type BoxMovementInsert = BoxMovementsTable["Insert"];
export type BoxMovement = BoxMovementsTable["Row"];

export type BoxMovementView = BoxMovementsView['Row'];