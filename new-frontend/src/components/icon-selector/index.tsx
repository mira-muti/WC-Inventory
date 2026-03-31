import { type FC, useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CommandInput,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, Edit2, Save, Trash2, X } from "lucide-react";
import { getAllIcons, renameIcon, deleteIcon } from "@/lib/iconLoader";
import { CategoryIcon } from "@/lib/api/icon";


function hexToUtf8(data: string): string {
  const hex = data.startsWith("\\x") ? data.slice(2) : data;

  let result = "";
  for (let i = 0; i < hex.length; i += 2) {
    const byte = parseInt(hex.slice(i, i + 2), 16);
    if (!Number.isNaN(byte)) {
      result += String.fromCharCode(byte);
    }
  }
  return result;
}


interface IconSelectorProps {
  value: string | null;
  onChange: (value: string) => void;
  className?: string;
  refreshTrigger?: any;
}

const IconSelector: FC<IconSelectorProps> = ({
  value,
  onChange,
  className,
  refreshTrigger,
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [iconNames, setIconNames] = useState<string[]>([]);
  const [iconsMap, setIconsMap] = useState<Record<string, string>>({});
  const [iconIds, setIconIds] = useState<Record<string, string>>({});
  const [editingName, setEditingName] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const ignoreBlurRef = useRef(false);

  function normalizeIconData(icon: CategoryIcon): CategoryIcon {
    if (!icon.data) return icon;
  
    if (icon.data.startsWith("data:image/svg+xml;base64,")) {
      return icon;
    }
  
    let data = icon.data.trim();
  
    if (data.startsWith("\\x")) {
      data = hexToUtf8(data);
    }
  
    data = data
      .replace(/<\?xml[^>]*>/g, "")
      .replace(/<!DOCTYPE[^>]*>/g, "")
      .replace(/<!--[\s\S]*?-->/g, "")
      .trim();
  
    const svg = data.match(/<svg[\s\S]*<\/svg>/i)?.[0];
    if (!svg) {
      return {
        ...icon,
        data: `data:image/svg+xml;base64,${btoa(data)}`,
      };
    }
  
    const cleanedSvg = svg.replace(/(width|height)="[^"]*"/g, "").trim();
    const base64 = btoa(cleanedSvg);
  
    return {
      ...icon,
      data: `data:image/svg+xml;base64,${base64}`,
    };
  }

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const icons = await getAllIcons();
  
        const names: string[] = [];
        const map: Record<string, string> = {};
        const ids: Record<string, string> = {};
  
        for (const raw of icons) {
          const icon = normalizeIconData(raw);
  
          names.push(icon.name);
  
          if (icon.data) {
            map[icon.name] = icon.data;
          }
  
          ids[icon.name] = icon.icon_id;
        }
  
        setIconNames(names);
        setIconsMap(map);
        setIconIds(ids);
      } catch (err) {
        console.error("Failed to load icons:", err);
      } finally {
        setLoading(false);
      }
    };
  
    load();
  }, [refreshTrigger]);

  const handleRename = async (oldName: string) => {
    const newName = tempName.trim();
    if (!newName || newName === oldName) {
      setEditingName(null);
      return;
    }

    try {
      await renameIcon(iconIds[oldName], newName);

      // Update UI locally
      setIconNames((prev) => prev.map((n) => (n === oldName ? newName : n)));
      setIconsMap((prev) => {
        const updated = { ...prev };
        updated[newName] = prev[oldName];
        delete updated[oldName];
        return updated;
      });
      setIconIds((prev) => {
        const updated = { ...prev };
        updated[newName] = prev[oldName];
        delete updated[oldName];
        return updated;
      });

      if (value === oldName) {
        onChange(newName);
        setRefreshKey(Date.now());
      }
    } catch (err) {
      console.error("Rename failed:", err);
    } finally {

      setEditingName(null);
    }
  };

  const handleDelete = async (name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await deleteIcon(iconIds[name]);
      setIconNames((prev) => prev.filter((n) => n !== name));
      setIconsMap((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
      setIconIds((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
      if (value === name) onChange("");
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const currentIcon =
  value && iconsMap[value]
    ? iconsMap[value]
    : "/src/assets/category_icons/Folder.svg";
  useEffect(() => {
      if (value && iconsMap[value]) {
        setRefreshKey(Date.now());
      }
    }, [iconsMap, value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={className ?? "w-[200px] justify-between"}
          disabled={loading}
        >
          <div className="flex items-center gap-2">
            <img
              key={refreshKey}
              src={currentIcon}
              alt={value ?? "icon"}
              className="h-4 w-4 object-contain"
              onError={(e) =>
                ((e.currentTarget as HTMLImageElement).src =
                  "/src/assets/category_icons/Folder.svg")
              }
            />
            <span>{value || "Select icon..."}</span>
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[260px] p-0"
        onWheel={(e) => e.stopPropagation()}
      >
        <Command>
          <CommandInput
            placeholder="Search icons..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandEmpty>
            {loading ? "Loading icons..." : "No icons found."}
          </CommandEmpty>

          {!loading && (
            <ScrollArea className="h-64">
              <CommandGroup>
                {iconNames
                  .filter((name) =>
                    name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((name) => (
                    <CommandItem
                      key={name}
                      value={name}
                      onSelect={() => {
                        if (editingName) return;
                        onChange(name);
                        setOpen(false);
                      }}
                      className="cursor-pointer grid grid-cols-[auto_1fr_auto] items-center gap-2 py-2"
                    >
                      <img
                        key={refreshKey}
                        src={iconsMap[name]}
                        alt={name}
                        className="h-4 w-4 object-contain justify-self-start"
                        onError={(e) =>
                          ((e.currentTarget as HTMLImageElement).src =
                            "/src/assets/category_icons/Folder.svg")
                        }
                      />

                      <div className="flex items-center min-w-0">
                        {editingName === name ? (
                          <input
                            autoFocus
                            className="border px-1 rounded-sm text-sm bg-white outline-none w-full truncate"
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                ignoreBlurRef.current = true;
                                handleRename(name);
                              }
                              if (e.key === "Escape") {
                                ignoreBlurRef.current = true;
                                setEditingName(null);
                              }
                            }}
                            onBlur={() => {
                              if (ignoreBlurRef.current) {
                                ignoreBlurRef.current = false;
                                return;
                              }
                              handleRename(name);
                            }}
                          />
                        ) : (
                          <span className="truncate max-w-[130px]">{name}</span>
                        )}
                        {value === name && (
                          <Check className="ml-1 h-4 w-4 text-muted-foreground shrink-0" />
                        )}
                      </div>

                      <div className="flex items-center gap-1 justify-self-end">
                        {editingName === name ? (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-green-600"
                              onMouseDown={() =>
                                (ignoreBlurRef.current = true)
                              } 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRename(name);
                              }}
                            >
                              <Save size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-gray-400"
                              onMouseDown={() =>
                                (ignoreBlurRef.current = true)
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingName(null);
                              }}
                            >
                              <X size={14} />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingName(name);
                                setTempName(name);
                              }}
                            >
                              <Edit2 size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(name);
                              }}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </>
                        )}
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </ScrollArea>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default IconSelector; 