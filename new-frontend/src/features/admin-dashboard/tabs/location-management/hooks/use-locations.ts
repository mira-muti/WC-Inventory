import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { locationApi } from "@/lib/api/locations";
import { queryKeys } from "@/lib/api/queryKeys";
import { toast } from "@/hooks/use-toast";
import type { Location, LocationUpdate } from "@/types/location";

export function useLocations() {
  const queryClient = useQueryClient();

  const { data: locations = [], isLoading } = useQuery<Location[]>({
    queryKey: queryKeys.locations.all,
    queryFn: () => locationApi.getLocations(),
  });

  const createMutation = useMutation({
    mutationFn: locationApi.createLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.locations.all });
      toast({
        title: "Success",
        description: "Location created successfully",
      });
    },
    onError: (_) => {
      toast({
        title: "Error",
        description: "Failed to create location",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: LocationUpdate }) =>
      locationApi.updateLocation({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.locations.all });
      toast({
        title: "Success",
        description: "Location updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update location",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => locationApi.deleteLocation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.locations.all });
      toast({
        title: "Success",
        description: "Location deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete location",
        variant: "destructive",
      });
    },
  });

  return {
    locations,
    isLoading,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
