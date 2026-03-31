import { fetchCategories } from "@/lib/api";
import { queryKeys } from "@/lib/api/queryKeys";
import { sizeApi, sizeApiKeys } from "@/lib/api/sizes";
import { useQuery } from "@tanstack/react-query";

export function useSearchFiltersQueries() {

  const { data: categories } = useQuery({
    queryFn: fetchCategories,
    queryKey: queryKeys.categories.all,
  });

  // why not queryKeys.sizes.all ?
  // queryKeys.sizes.all : "sizes"
  // sizeApiKeys.all : "all"
  const { data: sizes } = useQuery({
    queryFn: sizeApi.getSizes,
    queryKey: sizeApiKeys.all
  })

  return {
    sizes,
    categories,
  }

}
