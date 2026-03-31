import type { Location } from "@/types/location";

export interface NestedLocation extends Location {
  subRows?: NestedLocation[];
}

export const buildLocationTree = (locations: Location[]): NestedLocation[] => {
  const locationMap = new Map<string | null, NestedLocation[]>();

  locations.forEach((location) => {
    const parentId = location.parent_id;
    if (!locationMap.has(parentId)) {
      locationMap.set(parentId, []);
    }
    // Spread location to avoid mutations.
    locationMap.get(parentId)?.push({ ...location });
  });

  const buildTree = (parentId: string | null): NestedLocation[] => {
    const children = locationMap.get(parentId) || [];
    return children.map((child) => ({
      ...child,
      subRows: buildTree(child.location_id),
    }));
  };

  return buildTree(null);
};
