// iconLoader.ts

import { iconApi, CategoryIcon } from "./api/icon";

// in-mem cache of all category icons as their data
let iconCache: CategoryIcon[] | null = null;

export async function getAllIcons(): Promise<CategoryIcon[]> {
  if (iconCache) {
    // No need to refresh cache on every call, let's assume it's fresh enough
    // for the duration of a user session unless explicitly invalidated.
    // refreshCache(); 
    return iconCache;
  }

  const icons = await iconApi.getIcons();
  iconCache = icons;
  return icons;
}

export function getIconCache() {
  return iconCache;
}

async function refreshCache() {
  try {
    const latest = await iconApi.getIcons();
    iconCache = latest;
  } catch (error) {
    console.error("Failed to refresh icon cache:", error);
  }
}

export async function getSpecificIcon(name: string): Promise<CategoryIcon | null> {
  const normalized = name.toLowerCase();

  if (iconCache) {
    const match = iconCache.find(
      (icon) => icon.name.toLowerCase() === normalized
    );
    return match || null;
  }

  const icons = await iconApi.getIcons();
  iconCache = icons;
  const match = icons.find((icon) => icon.name.toLowerCase() === normalized);
  return match || null;
}

export async function uploadIcon(
  file: File,
  name: string,
  uploadedBy: string | null = null
): Promise<CategoryIcon> {

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  try {

    if (!iconCache) {
      await getAllIcons();
    }

    const fileDataUrl = await readFileAsDataURL(file);

    // Check for duplicate icon data against the cache
    const existingIcon = iconCache!.find(icon => icon.data === fileDataUrl);
    if (existingIcon) {
      throw new Error(`An identical icon named "${existingIcon.name}" already exists. Please select it from the dropdown instead of re-uploading.`);
    }

    const newIcon = await iconApi.createIcon({
      name,
      data: fileDataUrl,
      mime_type: file.type,
      uploaded_by: uploadedBy,
    });

    // Update cache immediately with the new icon
    if (iconCache) iconCache.push(newIcon);
    else iconCache = [newIcon];

    return newIcon;
  } catch (error) {
    // Re-throw the error to be handled by the calling component
    throw error;
  }
}

export async function renameIcon(
  iconId: string,
  newName: string
): Promise<CategoryIcon> {
  const updated = await iconApi.updateIcon(iconId, { name: newName });

  if (iconCache) {
    const idx = iconCache.findIndex((i) => i.icon_id === iconId);
    if (idx !== -1) iconCache[idx] = updated;
  }

  refreshCache(); // Refresh after a change
  return updated;
}

export async function deleteIcon(iconId: string): Promise<void> {
  await iconApi.deleteIcon(iconId);

  if (iconCache) {
    iconCache = iconCache.filter((i) => i.icon_id !== iconId);
  }

  refreshCache(); // Refresh after a change
}