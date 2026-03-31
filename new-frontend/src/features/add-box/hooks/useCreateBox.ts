import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { BoxContent } from "@/types/boxContent";

interface BoxLocation {
  room: string;
  level: string;
  aisle: string;
  row: string;
}

interface UseSaveBoxParams {
  items: BoxContent[];
  location: BoxLocation;
  note: string | undefined;
  boxId?: string | null; 
  isUpdateMode?: boolean;


  onAddSuccess: (data?: any) => void;   
  onSuccess?: (data?: any) => void;    
}

export const useSaveBox = ({
  items,
  location,
  note,
  onAddSuccess,
  onSuccess,
  boxId,
  isUpdateMode = false,
}: UseSaveBoxParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const userId = user?.id ?? null;

      if (isUpdateMode && boxId) {
        const { error: boxError } = await supabase
          .from("boxes")
          .update({
            location_id:
              location.row ||
              location.aisle ||
              location.level ||
              location.room,
            updated_at: new Date().toISOString(),
          })
          .eq("box_id", boxId);

        if (boxError) throw boxError;

        const { error: deleteError } = await supabase
          .from("box_contents")
          .delete()
          .eq("box_id", boxId);

        if (deleteError) throw deleteError;

        if (items.length > 0) {
          const boxContents = items.map((item) => ({
            category_id: item.category_id,
            size_id: item.size_id,
            gender: item.gender,
            quantity: item.quantity,
            box_id: boxId,
          }));

          const { error: contentsError } = await supabase
            .from("box_contents")
            .insert(boxContents);

          if (contentsError) throw contentsError;
        }

        const { data: updatedBox, error: fetchError } = await supabase
          .from("boxes")
          .select("*")
          .eq("box_id", boxId)
          .single();

        if (fetchError) throw fetchError;

        return updatedBox;
      }
      const { data: boxData, error: boxError } = await supabase
        .from("boxes")
        .insert({
          location_id:
            location.row ||
            location.aisle ||
            location.level ||
            location.room,
          description: note || null,
        })
        .select()
        .single();

      if (boxError) throw boxError;

      const boxContents = items.map((item) => ({
        ...item,
        box_id: boxData.box_id,
      }));

      const { error: contentsError } = await supabase
        .from("box_contents")
        .insert(boxContents);

      if (contentsError) throw contentsError;

      // Movement entry
      const { error: movementError } = await supabase
        .from("box_movements")
        .insert({
          moved_by: userId,
          box_id: boxData.box_id,
          to_location_id:
            location.row ||
            location.aisle ||
            location.level ||
            location.room,
          action: "Created",
          note: note || "Box created",
        });

      if (movementError) throw movementError;

      return boxData;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["boxes"] });
      queryClient.invalidateQueries({ queryKey: ["boxCount"] });
      onAddSuccess?.(data);

      onSuccess?.(data);
    },
  });
};