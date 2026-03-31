import { supabase } from "@/lib/supabaseClient";
import { BoxView } from "@/types/box";
import { useQuery } from "@tanstack/react-query";

export function useBoxView() {
  const { data: boxes, isLoading, error, isError } = useQuery({
    queryFn: async () => {
      const { data } = await supabase.from("box_view").select();

      return data as BoxView[];
    },
    queryKey: ["box_contents_view"],
  });

  return {
    boxes,
    error,
    isError,
    isLoading,
  };
}
