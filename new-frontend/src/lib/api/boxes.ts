import { Box, BoxView } from "@/types/box";
import { supabase } from "../supabaseClient";

export const boxApi = {
  getBoxes: async () => {
    const { data, error } = await supabase
      .from("box_view")
      .select()
      .order("name", { ascending: true });

    if (error) throw new Error(error.message);
    return data as BoxView[];
  },

  getBox: async (boxId: string) => { //this is never used either
    const { data, error } = await supabase
      .from("box_view")
      .select()
      .eq("id", boxId)
      .single();

    if (error) throw new Error(error.message);
    return data as Box;
  },

  getBoxContents: async (boxId: string) => { //This doesnt even exist (the view)?
    const { data, error } = await supabase
      .from("box_contents_view")
      .select()
      .eq("box_id", boxId);

    if (error) throw new Error(error.message);
    return data;
  },

  moveBoxes: async (boxIds: string[], locationId: string, note?: string) => {
    const { data, error } = await supabase.rpc("move_boxes", {
      p_box_ids: boxIds,
      p_location_id: locationId,
      p_note: note,
    });

    if (error) throw new Error(error.message);
    return data;
  },

  donateBoxes: async (boxIds: string[], note?: string) => {
    // Get current user ID
    const currentUser = await supabase.auth.getUser();
    const userId = currentUser.data.user?.id;

    // Get current box information
    const { data: boxesData, error: boxesError } = await supabase
      .from("boxes")
      .select("box_id, location_id")
      .in("box_id", boxIds);

    if (boxesError) {
      console.error("Error fetching boxes:", boxesError);
      throw new Error(boxesError.message);
    }

    // Create movement records for each box
    const movements = boxIds.map((boxId) => {
      const box = boxesData?.find((b) => b.box_id === boxId);
      return {
        box_id: boxId,
        action: "Donated", // Using the box_movement_action enum
        from_location_id: box?.location_id || null,
        to_location_id: null, // No destination for donations
        moved_at: new Date().toISOString(),
        moved_by: userId || null,
        note: note || "Donated via inventory management",
      };
    });

    // Insert the donation movement records
    const { data: movementData, error: movementError } = await supabase
      .from("box_movements")
      .insert(movements);

    if (movementError) {
      console.error("Error creating movement records:", movementError);
      throw new Error(movementError.message);
    }

    // Update the boxes to remove their location (they're donated)
    const { data: updatedBoxes, error: updateError } = await supabase
      .from("boxes")
      .update({
        location_id: null,
        status: "Donated",
        updated_at: new Date().toISOString(),
      })
      .in("box_id", boxIds)
      .select();

    if (updateError) {
      console.error("Error updating boxes:", updateError);
      throw new Error(updateError.message);
    }

    console.log("Donation completed successfully:", {
      movements: movementData,
      boxes: updatedBoxes,
    });
    return { movements: movementData, boxes: updatedBoxes };
  },
};
