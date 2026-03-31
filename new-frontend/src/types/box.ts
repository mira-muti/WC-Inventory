import { BoxStatus } from "./enums";
import { Database } from "./supabase";

type BoxTable = Database["public"]["Tables"]["boxes"];

export type Box = BoxTable["Row"];
//export type BoxView = Database["public"]["Views"]["box_view"]["Row"];

export interface BoxItem {
  type: string;
  icon:string;
  gender: "Men" | "Women" | "Kids" | "Unisex";
  size: string;
  quantity: number;
}

export interface BoxView {
  id: string;
  location: string;
  name: string;
  icon:string;
  status: BoxStatus;
  contents: BoxItem[];
  createdAt: string;
  updatedAt: string;
}
