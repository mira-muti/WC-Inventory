//For when DB added
import { supabase } from "../supabaseClient";

export interface CategoryIcon {
  icon_id: string;
  name: string;
  data: string | null;
  mime_type: string | null;
  uploaded_by: string | null;
  created_at: string;
}

export type CategoryIconInsert = Omit<CategoryIcon, "icon_id" | "created_at">;
export type CategoryIconUpdate = Partial<
  Omit<CategoryIcon, "icon_id" | "created_at">
>;


function hexToUtf8(hex: string): string {
  if (hex.startsWith("\\x")) hex = hex.slice(2);
  const bytes = new Uint8Array(
    hex.match(/.{1,2}/g)!.map((b) => parseInt(b, 16))
  );
  const decoder = new TextDecoder("utf-8");
  return decoder.decode(bytes);
}


function normalizeIconData(icon: CategoryIcon): CategoryIcon {
  if (!icon.data) return icon;

  let data = icon.data.trim();


  if (data.startsWith("\\x")) {
    data = hexToUtf8(data);
  }


  if (data.startsWith("data:")) {
    return { ...icon, data };
  }

  const mime = icon.mime_type || "image/svg+xml";
  const formatted = `data:${mime};base64,${data}`;
  return { ...icon, data: formatted };
}

function normalizeIcons(data: CategoryIcon[]): CategoryIcon[] {
  return data.map(normalizeIconData);
}


export const iconApi = {
  getIcons: async (): Promise<CategoryIcon[]> => {
    const { data, error } = await supabase
      .from("category_icons")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return normalizeIcons(data as CategoryIcon[]);
  },


  getIconById: async (id: string): Promise<CategoryIcon> => {
    const { data, error } = await supabase
      .from("category_icons")
      .select("*")
      .eq("icon_id", id)
      .single();

    if (error) throw new Error(error.message);
    return normalizeIconData(data as CategoryIcon);
  },

  createIcon: async (newIcon: CategoryIconInsert): Promise<CategoryIcon> => {
    const { data, error } = await supabase
      .from("category_icons")
      .insert(newIcon)
      .select("*")
      .single();

    if (error) throw error;
    return normalizeIconData(data as CategoryIcon);
  },

  updateIcon: async (
    id: string,
    updatedIcon: CategoryIconUpdate
  ): Promise<CategoryIcon> => {
    const { data, error } = await supabase
      .from("category_icons")
      .update(updatedIcon)
      .eq("icon_id", id)
      .select("*")
      .single();

    if (error) throw error;
    return normalizeIconData(data as CategoryIcon);
  },

  deleteIcon: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("category_icons")
      .delete()
      .eq("icon_id", id);

    if (error) throw error;
  },
};