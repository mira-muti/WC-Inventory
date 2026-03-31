import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import TreeSelect from "@/components/tree-select";
import { Location, LocationInsert } from "@/types/location";


export const locationFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim(),
  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .nullable()
    .transform((val) => (val === "" ? null : val)),
  parent_id: z.string().nullable(),
  // Level is computed based on parent, no need for direct input
  level: z
    .number()
    .min(1, "Level must be at least 1")
    .max(10, "Maximum nesting level exceeded"),
  location_id: z.string().optional() // For updates
});

export type LocationFormValues = z.infer<typeof locationFormSchema>;

interface LocationFormProps {
  locations: ReadonlyArray<Location>;
  onSubmit: (values: LocationInsert) => Promise<void>;
  initialData?: Location | null;
  isLoading: boolean;
}

export const LocationForm = ({
  locations,
  onSubmit,
  initialData,
  isLoading,
}: LocationFormProps): JSX.Element => {
  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? null,
      parent_id: initialData?.parent_id ?? null,
      level: initialData?.level ?? 1,
      location_id: initialData?.location_id
    },
    mode: "onChange"
  });

  const { control, handleSubmit, setValue, formState } = form;

  const onFormSubmit = async (data: LocationFormValues): Promise<void> => {
    try {
      // Convert form values to LocationInsert type -- TODO - > Check if update or insert
      const locationData: LocationInsert = {
        name: data.name,
        description: data.description,
        parent_id: data.parent_id,
        level: data.level,
        ...(initialData?.location_id && { location_id: initialData.location_id })
      };

      await onSubmit(locationData);
      form.reset(data);
    } catch (error) {
      form.reset(data, {
        keepValues: true,
        keepDirty: true,
        keepErrors: true,
      });
      throw error;
    }
  };

  // Compute max allowed level based on hierarchy
  const maxLevel = Math.max(...locations.map(loc => loc.level ?? 1), 0) + 1;

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="space-y-4"
      >
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter location name"
                  disabled={isLoading}
                  maxLength={100}
                  onBlur={(e) => {
                    field.onBlur();
                    setValue("name", e.target.value.trim(), {
                      shouldValidate: true,
                    });
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  placeholder="Enter description"
                  disabled={isLoading}
                  maxLength={500}
                  onBlur={(e) => {
                    field.onBlur();
                    setValue("description", e.target.value.trim() || null, {
                      shouldValidate: true,
                    });
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="parent_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent Location (Optional)</FormLabel>
              <FormControl>
                <TreeSelect
                  items={locations}
                  selectedId={field.value}
                  onSelect={(id) => {
                    field.onChange(id);
                    // Update level based on parent
                    const parent = locations.find(loc => loc.location_id === id);
                    const newLevel = parent ? (parent.level ?? 0) + 1 : 1;

                    if (newLevel <= maxLevel) {
                      setValue("level", newLevel, { shouldValidate: true });
                    }
                  }}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        <Button
          type="submit"
          disabled={isLoading || !formState.isDirty || !formState.isValid}
          className="w-full"
        >
          {isLoading ? "Saving..." : `${initialData ? "Update" : "Create"} Location`}
        </Button>
      </form>
    </Form>
  );
};

export default LocationForm;