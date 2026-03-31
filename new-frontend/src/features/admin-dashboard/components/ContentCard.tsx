import { getAllIcons, getIconCache } from "@/lib/iconLoader";
import { BoxItem } from "@/types/box";
import { useEffect, useState } from "react";

const getIcon = (type: string): string => {
  const key = type.toLowerCase();
  return itemToIcon[key] ?? "📦"; // default icon
};

interface ContentCardProps {
  item: BoxItem;
}

const ContentCard = ({ item }: ContentCardProps) => {
  const [iconMap, setIconMap] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    const loadIcons = async () => {

      

      const cached = getIconCache();
      if (cached && cached.length > 0) {
        const map = new Map<string, string>();
        for (const icon of cached) {
          map.set(icon.name.toLowerCase().trim(), icon.data);
        }
        setIconMap(map);

      }


      const icons = await getAllIcons();
      const freshMap = new Map<string, string>();
      for (const icon of icons) {
        freshMap.set(icon.name.toLowerCase().trim(), icon.data);
      }
      setIconMap(freshMap);
    };

    loadIcons();
  }, []);
  const iconSrc = item.icon
    ? iconMap.get(item.icon.toLowerCase().trim())
    : undefined;
  return (
    <div className="p-4 bg-white rounded-lg border shadow-sm text-sm">
      <div className="flex items-center gap-3">
            <img
              src={iconSrc || "/src/assets/category_icons/Folder.svg"}
              alt={item.type}
              className="w-8 h-8 object-contain"
              onError={(e) =>
                ((e.currentTarget as HTMLImageElement).src =
                  "/src/assets/category_icons/Folder.svg")
              }
            />
        <div className="flex-1">
          <p className="font-medium">{item.type}</p>
          <p className="text-sm text-gray-600">
            {item.gender} • Size: {item.size}
          </p>
        </div>
        <div className="text-right">
          <p>Qty: {item.quantity}</p>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
