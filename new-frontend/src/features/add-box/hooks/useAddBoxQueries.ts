import { fetchLocations, fetchCategories } from "@/lib/api";
import { queryKeys } from "@/lib/api/queryKeys";
import { sizeApi, sizeApiKeys } from "@/lib/api/sizes";
import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export function useAddBoxQueries() {

  const { data: locations } = useQuery({
    queryFn: fetchLocations,
    queryKey: queryKeys.locations.all,
  });

  const { data: categories } = useQuery({
    queryFn: fetchCategories,
    queryKey: queryKeys.categories.all,
  });

  const { data: sizes } = useQuery({
    queryFn: sizeApi.getSizes,
    queryKey: sizeApiKeys.all
  })

  const { data: boxCount } = useQuery({
    queryFn: async () => {
      const { data, error } = await supabase
        .from("boxes")
        .select("box_number", { head: false })
        .order("box_number", { ascending: false })
        .limit(1);
  
      if (error) throw error;
  
      return data?.[0]?.box_number || 0;
    },
    queryKey: ["maxBoxNumber"],
  });

  return {
    locations,
    sizes,
    categories,
    boxCount,
  }

}
