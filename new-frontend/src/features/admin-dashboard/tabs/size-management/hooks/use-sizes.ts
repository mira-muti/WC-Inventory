import {toast} from "@/hooks/use-toast"; //for success/error messages in UI
import {sizeApi} from "@/lib/api/sizes.ts";
import {queryKeys} from "@/lib/api/queryKeys"; //cache and track
import {Size, SizeWithUsage} from "@/types/size.ts";
import {useQueryClient, useQuery, useMutation} from "@tanstack/react-query"; //useQueryClient, useQuery, and
// useMutation are hooks provided by react-query for fetching data, managing cache, and performing mutations
// (creating, updating, and deleting data)

export function useSizes() {

    const queryClient = useQueryClient();

    const { data: sizes = [], isLoading } = useQuery<SizeWithUsage[]>({
        queryKey: queryKeys.sizes.all,
        queryFn: sizeApi.getSizes,
    });

    const createMutation = useMutation({
        mutationFn: sizeApi.createSize,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.sizes.all });
            toast({
                title: "Success",
                description: "Size created successfully",
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Error",
                description: error.message || "Failed to create size",
                variant: "destructive",
            });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Size> }) =>
            sizeApi.updateSize(id, data),
        onSuccess: (result) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.sizes.all });
            toast({
                title: "Success",
                description: "Size updated successfully",
            });
            return result;
        },
        onError: (error: Error) => {
            toast({
                title: "Error",
                description: error.message || "Failed to update size",
                variant: "destructive",
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: sizeApi.deleteSize,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.sizes.all });
            toast({
                title: "Success",
                description: "Size deleted successfully",
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Error",
                description: error.message || "Failed to delete size",
                variant: "destructive",
            });
        },
    });

    return {
        sizes,
        isLoading,
        createMutation,
        updateMutation,
        deleteMutation,
    };

}