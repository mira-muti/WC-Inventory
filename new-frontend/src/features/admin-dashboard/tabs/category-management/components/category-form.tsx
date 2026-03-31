import React, { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import IconSelector from "@/components/icon-selector";
import { Category, CategoryFormData } from "@/types/category";
import { Upload } from "lucide-react";
import { uploadIcon } from "@/lib/iconLoader";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

export interface CategoryFormProps {
  categories: ReadonlyArray<Category>;
  onSubmit: (values: CategoryFormData) => Promise<void>;
  initialData?: Category | null;
  isLoading: boolean;
  onClose: () => void;
}

const CategoryForm: FC<CategoryFormProps> = ({
  categories,
  onSubmit,
  initialData,
  isLoading,
  onClose,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CategoryFormData>(() => ({
    name: initialData?.name || "",
    description: initialData?.description || "",
    level: initialData?.level || 0,
    icon: initialData?.icon || null,
    parent_id: initialData?.parent_id || null,
  }));

  const [parentSearch, setParentSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [breadcrumb, setBreadcrumb] = useState<Category[]>([]);
  const [iconRefreshKey, setIconRefreshKey] = useState(0);
  const [fileInputKey, setFileInputKey] = useState(0);

  const currentParent = breadcrumb[breadcrumb.length - 1];
  const searchQuery = (
    breadcrumb.map((c) => c.name).join("") + "" + parentSearch
  )
    .toLowerCase()
    .replace(/\s/g, "");

//HELPER FUNCTIONS:
  const getCategoryPath = (category: Category): string => {
    const path: string[] = [category.name];
    let currentCategory = category;

    while (currentCategory.parent_id) {
      const parent = categories.find((c) => c.category_id === currentCategory.parent_id);
      if (!parent) break;
      path.unshift(parent.name);
      currentCategory = parent;
    }

    return path.join(" → ");
  };

  const getCategoryBreadcrumb = (category: Category): Category[] => {
    const chain: Category[] = [];
    let current: Category | undefined = category;
    while (current) {
      chain.unshift(current);
      current = categories.find((c) => c.category_id === current?.parent_id);
    }
    return chain;
  };

  const filteredCategories = categories
    .filter((category) => {
      //Don't show the category itself as a parent option
      if (formData.parent_id && category.category_id === formData.parent_id) {
        return false;
      }

      const isTopLevel = !category.parent_id;
      const isDirectChildOfCurrent =
        currentParent && category.parent_id === currentParent.category_id;

      if (currentParent) {
        if (!isDirectChildOfCurrent) return false;
      } else {
        if (!isTopLevel) return false;
      }

      if (!searchQuery.trim()) return true;

      const path = getCategoryPath(category)
        .toLowerCase()
        .replace(/\s/g, "")
        .replace(/→/g, "");

      return path.includes(searchQuery);
    })
    .sort((a, b) => {
      const aDepth = getCategoryPath(a).split(" → ").length;
      const bDepth = getCategoryPath(b).split(" → ").length;
      return aDepth - bDepth;
    });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleParentSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParentSearch(e.target.value);
    setShowSuggestions(true);
  };

  const handleSelectParent = (category: Category) => {
    setFormData((prev) => ({
      ...prev,
      parent_id: category.category_id,
      level: category.level || 0,
    }));

    const chain = getCategoryBreadcrumb(category);
    setBreadcrumb(chain);
    setParentSearch("");
  };

  const handleClearParent = () => {
    setFormData((prev) => ({
      ...prev,
      parent_id: null,
      level: 0,
    }));
    setBreadcrumb([]);
    setParentSearch("");
    setShowSuggestions(false);
  };

  const handleIconChange = (newIcon: string | null) => {
    setFormData((prev) => ({
      ...prev,
      icon: newIcon,
    }));
  };

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;
    const file = fileInput.files?.[0];
    if (!file) return;

    fileInput.value = "";
    setFileInputKey(prev => prev + 1);

    try {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const dataUrl = ev.target?.result as string;
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const user_id = user?.id;

        // Generate a clean filename without extension
        const cleanFilename = file.name.replace(/\.[^/.]+$/, "");

        try {
          // The duplicate check is now handled in the uploadIcon function
          const newIcon = await uploadIcon(
            file,
            cleanFilename,
            user_id
          );

          setFormData((prev) => ({
            ...prev,
            icon: newIcon.name,
          }));
          setIconRefreshKey(Date.now());

          toast({
            title: "Success",
            description: `Icon "${newIcon.name}" uploaded successfully!`,
          });
        } catch (uploadError) {
          console.error("Upload failed:", uploadError);
          
          if (uploadError.message && uploadError.message.includes("already exists")) {
            toast({
              title: "Duplicate Icon",
              description: uploadError.message,
              variant: "destructive",
            });
          } else {
            toast({
              title: "Error",
              description: `Failed to upload icon: ${uploadError.message || "Unknown error"}`,
              variant: "destructive",
            });
          }
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error("File processing failed:", error);
      toast({
        title: "Error",
        description: `Failed to process file: ${error.message || "Unknown error"}`,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        level: initialData.level || 0,
        icon: initialData.icon || null,
        parent_id: initialData.parent_id || null,
      });

      if (initialData.parent_id) {
        const parent = categories.find(
          (c) => c.category_id === initialData.parent_id
        );
        if (parent) {
          const chain = getCategoryBreadcrumb(parent);
          setBreadcrumb(chain);
        }
      } else {
        setBreadcrumb([]);
        setParentSearch("");
      }
    }
  }, [initialData, categories]);

  // Handle click outside to close suggestions dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const dropdown = document.getElementById("parent-category-dropdown");
      const input = document.getElementById("parent-category-input");

      if (
        dropdown &&
        input &&
        !dropdown.contains(e.target as Node) &&
        !input.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="flex items-center gap-4">
        <label
          htmlFor="icon"
          className="text-gray-700 font-medium w-24 flex-shrink-0"
        >
          Icon:
        </label>

        <div className="flex-1 flex items-center gap-2">
          <div className="flex-1">
            <IconSelector
              value={formData.icon}
              onChange={handleIconChange}
              className="w-full"
              refreshTrigger={iconRefreshKey}
            />
          </div>

          <input
            key={fileInputKey}
            type="file"
            id="icon-upload"
            accept=".svg"
            className="hidden"
            onChange={handleIconUpload}
          />

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => document.getElementById("icon-upload")?.click()}
            className="shrink-0"
            title="Upload custom icon"
          >
            <Upload className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-2">
        <label htmlFor="name" className="text-gray-700 font-medium">
          Name:
        </label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Category Name"
          maxLength={100}
          required
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="description" className="text-gray-700 font-medium">
          Description:
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          placeholder="Category Description"
          className="min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      <div className="grid gap-2 relative">
        <label htmlFor="parent" className="text-gray-700 font-medium">
          Parent Category (Optional):
        </label>

        <div className="relative">
          <div
            className="flex items-center gap-1 border border-input rounded-md px-3 py-2 text-sm cursor-text bg-transparent min-h-[40px]"
            onClick={() => setShowSuggestions(true)}
          >
            {breadcrumb.map((c, idx) => (
              <React.Fragment key={c.category_id}>
                <button
                  type="button"
                  className="hover:underline text-gray-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    setBreadcrumb(breadcrumb.slice(0, idx + 1));
                    setFormData((prev) => ({
                      ...prev,
                      parent_id: c.category_id,
                      level: c.level ?? 0,
                    }));
                  }}
                >
                  {c.name}
                </button>
                {idx < breadcrumb.length - 1 && <span>→</span>}
              </React.Fragment>
            ))}

            <input
              id="parent-category-input"
              type="text"
              className="flex-1 outline-none bg-transparent text-gray-700 placeholder-gray-400"
              value={parentSearch}
              onChange={handleParentSearch}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => {
                if (
                  e.key === "Backspace" &&
                  parentSearch === "" &&
                  breadcrumb.length > 0
                ) {
                  const newBreadcrumb = breadcrumb.slice(0, -1);
                  setBreadcrumb(newBreadcrumb);

                  const last = newBreadcrumb[newBreadcrumb.length - 1];
                  setFormData((prev) => ({
                    ...prev,
                    parent_id: last ? last.category_id : null,
                    level: last ? last.level ?? 0 : 0,
                  }));
                }
              }}
              placeholder={
                breadcrumb.length === 0
                  ? "Search for parent category..."
                  : ""
              }
            />

            {breadcrumb.length > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearParent();
                }}
                className="ml-auto text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {showSuggestions && (
          <div
            id="parent-category-dropdown"
            className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md border border-gray-200 shadow-lg z-10"
            onMouseDown={(e) => e.preventDefault()}
          >
            {filteredCategories.length > 0 ? (
              <div className="py-1 max-h-60 overflow-y-auto">
                {filteredCategories.map((category) => (
                  <div
                    key={category.category_id}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectParent(category)}
                  >
                    {getCategoryPath(category)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-3 py-2 text-gray-500">
                No categories found
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-black text-white hover:bg-gray-800"
          disabled={isLoading}
        >
          {initialData ? "Update" : "Add"} Category
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;