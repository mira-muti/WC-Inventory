import { LocationNode } from ".";

export const buildLocationTree = (locations: LocationNode[]): LocationNode[] => {
  const locationMap = new Map<string, LocationNode>();
  const rootNodes: LocationNode[] = [];

  // First, create all nodes with empty children arrays
  locations.forEach(location => {
    locationMap.set(location.location_id, { ...location, children: [] });
  });

  // Then, build the tree structure
  locations.forEach(location => {
    const node = locationMap.get(location.location_id)!;
    if (location.parent_id === null) {
      rootNodes.push(node);
    } else {
      const parentNode = locationMap.get(location.parent_id);
      if (parentNode) {
        parentNode.children.push(node);
      }
    }
  });

  return rootNodes;
};

