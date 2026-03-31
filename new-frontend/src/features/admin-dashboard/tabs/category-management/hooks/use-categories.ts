import { toast } from "@/hooks/use-toast";
import { categoryApi } from "@/lib/api/categories";
import { queryKeys } from "@/lib/api/queryKeys";
import { Category } from "@/types/category";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";

export function useCategories() {
    const queryClient = useQueryClient();
  
    const { data: categories = [], isLoading } = useQuery<Category[]>({
      queryKey: queryKeys.categories.all,
      queryFn: categoryApi.getCategories,
    });

    const createMutation = useMutation({
        mutationFn: categoryApi.createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
            toast({
                title: "Success",
                description: "Category created successfully",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to create category",
                variant: "destructive",
            });
        },
    });

    const updateMutation = useMutation({
            mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) =>
                categoryApi.updateCategory(id, data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
                toast({
                    title: "Success",
                    description: "Category updated successfully",
                });
            },
            onError: () => {
                toast({
                    title: "Error",
                    description: "Failed to update category",
                    variant: "destructive",
                });
            },
        });
        const deleteMutation = useMutation({
            mutationFn: categoryApi.deleteCategory,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
                toast({
                    title: "Success",
                    description: "Category deleted successfully",
                });
            },
            onError: (_) => {
                toast({
                    title: "Error",
                    description: "Failed to delete category. It may have dependent sub-categories.",
                    variant: "destructive",
                });
            },
        });

    return { 
        categories,
        isLoading,
        createMutation,
        updateMutation,
        deleteMutation,
    };
}