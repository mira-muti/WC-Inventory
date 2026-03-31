import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { LocationTable } from "./components/location-table";
import { LocationInsert, Location } from "@/types/location";
import LocationForm from "./components/create-location-form";
import { useLocations } from "./hooks/use-locations";

const LocationManagement = () => {
  const {
    locations,
    createMutation,
    updateMutation,
    deleteMutation,
  } = useLocations();
  const [globalFilter, setGlobalFilter] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const handleSubmit = async (data: LocationInsert) => {
    if (selectedLocation) {
      await updateMutation.mutateAsync({
        id: selectedLocation.location_id,
        data,
      });
    } else {
      await createMutation.mutateAsync(data);
    }
    handleClose();
  };

  const handleDelete = async (id: string) => {
    const hasChildren = locations.some((loc) => loc.parent_id === id);
    if (hasChildren) {
      toast({
        title: "Cannot Delete",
        description: "Please delete or move child locations first",
        variant: "destructive",
      });
      return;
    }
    if (window.confirm("Are you sure you want to delete this location?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleEdit = (location: Location) => {
    setSelectedLocation(location);
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setSelectedLocation(null);
  };

  return (
    <>
      <div>
        <LocationTable
          locations={locations}
          onEdit={handleEdit}
          onDelete={handleDelete}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          onAdd={() => setIsDialogOpen(true)}
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedLocation ? "Edit Location" : "Create New Location"}
            </DialogTitle>
            <DialogDescription>
              {selectedLocation
                ? "Edit the details of the existing location"
                : "Add a new location to the system"}
            </DialogDescription>
          </DialogHeader>
          <LocationForm
            locations={locations.filter(loc => loc.location_id !== selectedLocation?.location_id)}
            onSubmit={handleSubmit}
            initialData={selectedLocation}
            isLoading={
              createMutation.isPending || updateMutation.isPending
            }
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LocationManagement;