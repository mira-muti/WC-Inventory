import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Package, PencilSimple, Trash, X } from "@phosphor-icons/react";
import { useAddBoxQueries } from "./hooks/useAddBoxQueries";
import { useSaveBox } from "./hooks/useCreateBox";
import { GenderEnum } from "@/types/enums";
import { BoxContent, InsertBoxContent } from "@/types/boxContent";
import { buildLocationTree } from "./utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { useMobile } from "./hooks/useMobile";
import { getAllIcons, getIconCache } from '@/lib/iconLoader';


const AddBox = () => {
  // Get URL search params to check if we're in update mode
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const boxIdParam = searchParams.get("boxId");
  const boxNameParam = searchParams.get("boxName");
  const isUpdateMode = !!boxIdParam;

  // Where should we go back to after create/update?
  const loc = useLocation();
  const from = (loc.state as { from?: string } | null)?.from ?? "/box-lookup";

  // Add toast for notifications
  const { toast } = useToast();

  // Maintain all existing state variables
  const [items, setItems] = useState<BoxContent[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");
  const [sizeId, setSizeId] = useState<string>("");
  const [gender, setGender] = useState<GenderEnum | "">("");
  const [quantity, setQuantity] = useState<number>(1);
  const [note, setNote] = useState<string>("");
  const [location, setLocation] = useState<{
    room: string;
    level: string;
    aisle: string;
    row: string;
  }>({
    room: "",
    level: "",
    aisle: "",
    row: "",
  });
  const [nextBoxId, setNextBoxId] = useState<number | null>(null);
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Add state for sidebar visibility
  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  // Use existing queries
  const { locations, categories, sizes, boxCount } = useAddBoxQueries();

  // Fetch box data when in update mode
  useEffect(() => {
    const fetchBoxData = async () => {
      if (!isUpdateMode || !boxIdParam) return;

      try {
        // Fetch box info including location
        const { data: boxInfo, error: boxError } = await supabase
          .from("boxes")
          .select("*, locations(*)")
          .eq("box_id", boxIdParam)
          .single();

        if (boxError) {
          console.error("Error fetching box info:", boxError);
          toast({
            title: "Error",
            description: "Failed to load box information",
            variant: "destructive",
          });
          return;
        }

        // Set the location if it exists
        if (boxInfo && boxInfo.location_id) {
          // We need to traverse the location hierarchy to set all levels
          const locationId = boxInfo.location_id;

          // Function to build location hierarchy
          const buildLocationHierarchy = async (locId: string) => {
            const hierarchy: string[] = [];
            let currentId: string | null = locId;

            while (currentId) {
              const { data: loc } = await supabase
                .from("locations")
                .select("*")
                .eq("location_id", currentId)
                .single();

              if (loc && typeof loc === "object" && "location_id" in loc) {
                hierarchy.unshift(currentId); // Add to beginning
                currentId = (loc as any).parent_id || null;
              } else {
                break;
              }
            }

            return hierarchy;
          };

          const hierarchy = await buildLocationHierarchy(locationId);

          // Set location based on hierarchy depth
          if (hierarchy.length >= 1) {
            setLocation((prev) => ({ ...prev, room: hierarchy[0] }));
          }
          if (hierarchy.length >= 2) {
            setLocation((prev) => ({ ...prev, level: hierarchy[1] }));
          }
          if (hierarchy.length >= 3) {
            setLocation((prev) => ({ ...prev, aisle: hierarchy[2] }));
          }
          if (hierarchy.length >= 4) {
            setLocation((prev) => ({ ...prev, row: hierarchy[3] }));
          }
        }

        // Fetch box contents
        const { data: boxData, error } = await supabase
          .from("box_contents")
          .select(
            `
            *,
            categories(name),
            sizes(name)
          `,
          )
          .eq("box_id", boxIdParam);

        if (error) {
          console.error("Error fetching box data:", error);
          toast({
            title: "Error",
            description: "Failed to load box data",
            variant: "destructive",
          });
          return;
        }

        if (boxData && boxData.length > 0) {
          // Transform the data to match the items format
          const transformedItems: BoxContent[] = boxData.map((item: any) => ({
            box_content_id: item.box_content_id,
            box_id: item.box_id,
            category_id: item.category_id,
            size_id: item.size_id,
            gender: item.gender,
            quantity: item.quantity,
          }));

          setItems(transformedItems);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchBoxData();
  }, [isUpdateMode, boxIdParam]);

  // Reset all state to default values
  const resetForm = () => {
    setItems([]);
    setCategoryId("");
    setSizeId("");
    setGender("");
    setQuantity(1);
    setLocation({
      room: "",
      level: "",
      aisle: "",
      row: "",
    });
    setShowLocationModal(false);
    setEditingItemIndex(null);
    setIsEditing(false);
    setShowSidebar(false);
    setNote("");
  };

  const isMobile = useMobile();

  // Set the next box ID when component loads or box count changes
  useEffect(() => {
    if (boxCount !== undefined) {
      setNextBoxId(boxCount + 1);
    }
  }, [boxCount]);

  // Additional effect to populate form fields when editing an item
  useEffect(() => {
    if (
      editingItemIndex !== null &&
      editingItemIndex >= 0 &&
      editingItemIndex < items.length
    ) {
      const itemToEdit = items[editingItemIndex];
      setCategoryId(itemToEdit.category_id);
      setSizeId(itemToEdit.size_id);
      setGender(itemToEdit.gender);
      setQuantity(itemToEdit.quantity);
      setIsEditing(true);
    } else {
      // Reset form when not editing
      if (isEditing) {
        setCategoryId("");
        setSizeId("");
        setGender("");
        setQuantity(1);
        setIsEditing(false);
      }
    }
  }, [editingItemIndex, items]);

  const [iconSrcMap, setIconSrcMap] = useState<Map<string, string>>(new Map());

  useEffect(() => {
  const loadIcons = async () => {
    try {

      const cached = getIconCache();

      if (cached && cached.length > 0) {
        const map = new Map<string, string>();
        for (const icon of cached) {
          map.set(icon.name.toLowerCase().trim(), icon.data);
        }
        setIconSrcMap(map);
      }


      const icons = await getAllIcons();
      const freshMap = new Map<string, string>();
      for (const icon of icons) {
        freshMap.set(icon.name.toLowerCase().trim(), icon.data);
      }
      setIconSrcMap(freshMap);
    } catch (error) {
      console.error("Failed to fetch icons:", error);
    }
  };

  loadIcons();
}, []);
  const locationTree = locations
    ? buildLocationTree(locations.map((loc) => ({ ...loc, children: [] })))
    : [];

  // Filter out any parent categories
  const leafCategories = categories?.filter(
    (category) => !categories.some((c) => c.parent_id === category.category_id),
  );

  // Define saveBox mutation with callbacks
  const saveBoxMutation = useSaveBox({
    items,
    location,
    note,
    boxId: boxIdParam,
    isUpdateMode,
    onAddSuccess: (data) => {
      const boxId = data?.box_id ?? boxIdParam ?? "";

      if (isUpdateMode) {
        // Show update success notification
        toast({
          title: "Box Updated Successfully",
          description: "Box contents have been updated.",
        });

        // Navigate back to box lookup with the box selected
        navigate(boxId ? `${from}?selectedBoxId=${boxIdParam}` : from);
        return;
      } else {
        // Show create success notification
        toast({
          title: "Box Created Successfully",
          description: "Box has been created and saved to inventory.",
        });

        // Reset the form
        resetForm();

        // Update the next box ID after saving
        if (nextBoxId !== null) {
          setNextBoxId(nextBoxId + 1);
        }
      }
    },
  });

  // Handle box creation
  const handleCreateBox = () => {
    // Validate we have items to save
    if (items.length === 0) {
      toast({
        title: "Box is empty",
        description: "Please add at least one item to the box.",
        variant: "destructive",
      });
      return;
    }

    // Validate we have a location
    if (!location.room) {
      toast({
        title: "Location is required",
        description: "Please select a location for the box.",
        variant: "destructive",
      });
      return;
    }

    // Call the mutation function to save the box
    saveBoxMutation.mutate();
  };

  // New function to get formatted location path
  const getLocationPath = () => {
    if (!location.room) return "";

    const path = [];
    if (location.room) {
      const roomNode = locationTree.find(
        (node) => node.location_id === location.room,
      );
      if (roomNode) path.push(roomNode.name);
    }

    if (location.level) {
      const levelNodes =
        locationTree.find((node) => node.location_id === location.room)
          ?.children || [];
      const levelNode = levelNodes.find(
        (node) => node.location_id === location.level,
      );
      if (levelNode) path.push(levelNode.name);
    }

    if (location.aisle) {
      const aisleNodes =
        locationTree
          .find((node) => node.location_id === location.room)
          ?.children.find((node) => node.location_id === location.level)
          ?.children || [];
      const aisleNode = aisleNodes.find(
        (node) => node.location_id === location.aisle,
      );
      if (aisleNode) path.push(aisleNode.name);
    }

    if (location.row) {
      const rowNodes =
        locationTree
          .find((node) => node.location_id === location.room)
          ?.children.find((node) => node.location_id === location.level)
          ?.children.find((node) => node.location_id === location.aisle)
          ?.children || [];
      const rowNode = rowNodes.find(
        (node) => node.location_id === location.row,
      );
      if (rowNode) path.push(rowNode.name);
    }

    return path.join(" > ");
  };

  // Update add item functionality to support editing
  const handleAdd = () => {
    if (!categoryId || !sizeId || !gender) return;

    const newItem: InsertBoxContent = {
      category_id: categoryId,
      size_id: sizeId,
      gender: gender as GenderEnum,
      quantity,
      box_id: ""
    };

    if (isEditing && editingItemIndex !== null) {
      // Update existing item
      const updatedItems = [...items];
      updatedItems[editingItemIndex] = newItem;
      setItems(updatedItems);
      setEditingItemIndex(null);
    } else {
      // Add new item
      setItems([...items, newItem]);
    }

    // Reset form
    setCategoryId("");
    setSizeId("");
    setGender("");
    setQuantity(1);
    setIsEditing(false);
  };

  // New function to handle item deletion
  const handleDeleteItem = () => {
    if (editingItemIndex !== null) {
      const updatedItems = items.filter(
        (_, index) => index !== editingItemIndex,
      );
      setItems(updatedItems);
      setEditingItemIndex(null);
      setCategoryId("");
      setSizeId("");
      setGender("");
      setQuantity(1);
      setIsEditing(false);
      setNote("");
    }
  };

  // Function to handle clicking on an item to edit
  const handleEditItem = (index: number) => {
    setEditingItemIndex(index);
  };

  // Function to cancel editing
  const handleCancelEdit = () => {
    setEditingItemIndex(null);
    setCategoryId("");
    setSizeId("");
    setGender("");
    setQuantity(1);
    setNote("");
    setIsEditing(false);
  };

  // Location selection component
  const LocationSelector = () => (
    <Card className="shadow-sm mt-4">
      <CardContent className="p-6 space-y-4">
        <p className="font-semibold">Location</p>
        {findChildren(null).length > 0 && (
          <Select
            value={location.room}
            onValueChange={(value) =>
              setLocation({
                ...location,
                room: value,
                level: "",
                aisle: "",
                row: "",
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Room" />
            </SelectTrigger>
            <SelectContent>
              {findChildren(null).map((room) => (
                <SelectItem key={room.location_id} value={room.location_id}>
                  {room.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {location.room && findChildren(location.room).length > 0 && (
          <Select
            value={location.level}
            onValueChange={(value) =>
              setLocation({ ...location, level: value, aisle: "", row: "" })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Level" />
            </SelectTrigger>
            <SelectContent>
              {findChildren(location.room).map((level) => (
                <SelectItem key={level.location_id} value={level.location_id}>
                  {level.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {location.level && findChildren(location.level).length > 0 && (
          <Select
            value={location.aisle}
            onValueChange={(value) =>
              setLocation({ ...location, aisle: value, row: "" })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Aisle" />
            </SelectTrigger>
            <SelectContent>
              {findChildren(location.level).map((aisle) => (
                <SelectItem key={aisle.location_id} value={aisle.location_id}>
                  {aisle.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {location.aisle && findChildren(location.aisle).length > 0 && (
          <Select
            value={location.row}
            onValueChange={(value) => setLocation({ ...location, row: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Row" />
            </SelectTrigger>
            <SelectContent>
              {findChildren(location.aisle).map((row) => (
                <SelectItem key={row.location_id} value={row.location_id}>
                  {row.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <Button className="w-full" onClick={() => setShowLocationModal(false)}>
          Save Location
        </Button>
      </CardContent>
    </Card>
  );

  // Find children nodes function (keep existing functionality)
  const findChildren = (parentId: string | null): LocationNode[] => {
    if (!locationTree.length) return [];
    if (!parentId) return locationTree;

    const findNode = (nodes: LocationNode[]): LocationNode | null => {
      for (const node of nodes) {
        if (node.location_id === parentId) return node;
        const found = findNode(node.children);
        if (found) return found;
      }
      return null;
    };
    return findNode(locationTree)?.children || [];
  };

  //to block creating Box if no item or no location
  const hasItems = items.length > 0;
  const hasLocation = 
    location.room != "";
  
    
  
  const canCreateBox = hasItems && hasLocation;

  // New function to open sidebar when clicking empty area
  const handleOpenSidebar = () => {
    if (items.length === 0) {
      setShowSidebar(true);
      setCategoryId("");
      setSizeId("");
      setGender("");
      setQuantity(1);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 p-4 flex">
        <div className={`flex-1 ${showSidebar ? "mr-4" : ""}`}>
          <Card className="shadow-sm h-full">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {isUpdateMode
                  ? `Updating ${boxNameParam || "Box"}`
                  : `Creating Box ${boxCount! + 1}`}
              </h2>

              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin size={24} />
                    <span className="font-medium">Location</span>
                  </div>
                  <button
                    onClick={() => setShowLocationModal(!showLocationModal)}
                  >
                    <PencilSimple size={20} />
                  </button>
                </div>

                <div className="text-gray-700">
                  {getLocationPath() || "Select a location"}
                </div>
              </div>

              {showLocationModal && <LocationSelector />}

              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package size={24} />
                  <span className="font-medium">Items</span>
                </div>

                <div
                  className="border-2 border-dashed border-blue-200 bg-blue-50 rounded-lg p-6 min-h-[calc(100vh-300px)] relative flex"
                  onClick={items.length === 0 ? handleOpenSidebar : undefined}
                >
                  {items.length === 0 ? (
                    <div className="text-center text-blue-500 cursor-pointer flex flex-col absolute inset-0 items-center justify-center">
                      <div className="flex justify-center mb-2">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 5V19M5 12H19"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      </div>
                    )
                    : (
                      <div className="w-full self-start">
                        {items.map((item, index) => {
                          const category = categories?.find((c) =>
                            c.category_id === item.category_id
                          );
                          const imgsrc = category?.icon? iconSrcMap.get(category.icon.toLowerCase().trim()): undefined;

                          return (
                            <div
                              key={index}
                              className={`p-3 bg-white rounded shadow mb-2 w-full cursor-pointer hover:bg-gray-50 transition-colors ${
                                editingItemIndex === index
                                  ? "ring-2 ring-blue-400"
                                  : ""
                              }`}
                              onClick={() => handleEditItem(index)}
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                  <div className="text-gray-500">
                                    <img
                                      src={imgsrc || "/src/assets/category_icons/Folder.svg" }
                                      alt={category?.name || "Item"}
                                      className="h-6 w-6 object-contain"
                                      onError={(e) =>
                                        ((e.currentTarget as HTMLImageElement).src =
                                          "/src/assets/category_icons/Folder.svg")
                                      }
                                    />
                                  </div>
                                  <div>
                                    <p className="font-medium">
                                      {category?.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {sizes?.find((s) =>
                                        s.size_id === item.size_id
                                      )?.name} • {item.gender}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <p className="font-medium">
                                    {category?.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {
                                      sizes?.find(
                                        (s) => s.size_id === item.size_id,
                                      )?.name
                                    }{" "}
                                    • {item.gender}
                                  </p>
                                </div>
                              </div>
                              <div className="text-gray-500 font-medium">
                                x{item.quantity}
                              </div>
                            </div>
                        );
                      })}

                      {/* Add a "Add more items" button */}
                      {!showSidebar && items.length > 0 && (
                        <Button
                          className="mt-4 w-full bg-blue-50 border-dashed border-blue-200 border-2 text-blue-500 hover:bg-blue-100"
                          onClick={() => setShowSidebar(true)}
                        >
                          + Add more items
                        </Button>
                      )}
                      </div>
                    )}
                </div>

                {/* Create box button */}
                {!showSidebar && (
                  <Button
                    className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 flex justify-center items-center gap-2"
                    onClick={handleCreateBox}
                    disabled={saveBoxMutation.isPending || !canCreateBox}
                  >
                    <Package size={20} />
                    <span>
                      {saveBoxMutation.isPending
                        ? isUpdateMode
                          ? "Updating..."
                          : "Creating..."
                        : isUpdateMode
                          ? "Update box"
                          : "Create box"}
                    </span>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {showSidebar && (
            isMobile ? (
              // mobile view
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white w-full max-w-sm rounded-lg shadow-lg p-4 relative mx-4">
                  <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowSidebar(false)}
                  >
                    <X size={20} />
                  </button>
                          <div className="mb-6 mt-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium">
                          {isEditing ? "Edit item" : "Add items"}
                        </h3>
                        {isEditing && (
                          <button
                            className="text-red-500 hover:text-red-700 transition-colors"
                            onClick={handleDeleteItem}
                            aria-label="Delete item"
                          >
                            <Trash size={20} />
                          </button>
                        )}
                      </div>

                      <div className="space-y-4">
                        <Select value={categoryId} onValueChange={setCategoryId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {leafCategories?.map((category) => (
                              <SelectItem
                                key={category.category_id}
                                value={category.category_id}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          value={gender}
                          onValueChange={(val) => setGender(val as GenderEnum)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Gender" />
                          </SelectTrigger>
                          <SelectContent>
                            {["Male", "Female", "Unisex", "Kids"].map((g) => (
                              <SelectItem key={g} value={g}>
                                {g}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select value={sizeId} onValueChange={setSizeId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Size" />
                          </SelectTrigger>
                          <SelectContent>
                            {sizes?.map((size) => (
                              <SelectItem key={size.size_id} value={size.size_id}>
                                {size.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Quantity
                          </label>
                          <Input
                          type="number"
                          min={1}
                          value={quantity}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '') {
                              setQuantity(val);
                            } else {
                              const num = Number(val);
                              if (!isNaN(num)) {
                                setQuantity(num);
                              }
                            }
                          }}
                          onBlur={() => {
                            if (quantity === '' || quantity < 1) {
                              setQuantity(1);
                            }
                          }}
                          />
                        </div>

                        <div className="flex gap-2">
                          {isEditing && (
                            <Button
                              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800"
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </Button>
                          )}
                          <Button
                            className={`${
                              isEditing ? "flex-1" : "w-full"
                            } bg-blue-600 hover:bg-blue-700`}
                            onClick={handleAdd}
                            disabled={!categoryId || !sizeId || !gender}
                          >
                            {isEditing ? "Update" : "Add item"}
                          </Button>
                        </div>
                      </div>
                    </div>

                <Button
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 flex justify-center items-center gap-2 mb-4"
                  onClick={handleCreateBox}
                  disabled={!canCreateBox || saveBoxMutation.isPending}
                >
                  <span>
                    {saveBoxMutation.isPending ? "Creating..." : "Create box"}
                  </span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-80 bg-white rounded-lg shadow-sm p-4 border relative">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => setShowSidebar(false)}
              >
                <X size={20} />
              </button>

              <div className="mb-6 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">
                    {isEditing ? "Edit item" : "Add items"}
                  </h3>
                  {isEditing && (
                    <button
                      className="text-red-500 hover:text-red-700 transition-colors"
                      onClick={handleDeleteItem}
                      aria-label="Delete item"
                    >
                      <Trash size={20} />
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {leafCategories?.map((category) => (
                        <SelectItem
                          key={category.category_id}
                          value={category.category_id}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={gender}
                    onValueChange={(val) => setGender(val as GenderEnum)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Male", "Female", "Unisex", "Kids"].map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sizeId} onValueChange={setSizeId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Size" />
                    </SelectTrigger>
                    <SelectContent>
                      {sizes?.map((size) => (
                        <SelectItem key={size.size_id} value={size.size_id}>
                          {size.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <Input
                      min={1}
                      value={quantity}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "") {
                          setQuantity(val);
                        } else {
                          const num = Number(val);
                          if (!isNaN(num)) {
                            setQuantity(num);
                          }
                        }
                      }}
                      onBlur={() => {
                        if (quantity === "" || quantity < 1) {
                          setQuantity(1);
                        }
                      }}
                    />
                  </div>

                  <div className="flex gap-2">
                    {isEditing && (
                      <Button
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                    )}
                    <Button
                      className={`${
                        isEditing ? "flex-1" : "w-full"
                      } bg-blue-600 hover:bg-blue-700`}
                      onClick={handleAdd}
                      disabled={!categoryId || !sizeId || !gender}
                    >
                      {isEditing ? "Update" : "Add item"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <label className="text-sm font-semibold text-gray-800">
                    Note 
                  </label>
                  <span className="text-xs text-gray-500">(optional)</span>
                </div>
                <textarea
                  placeholder="Add additional notes about this box..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              <Button
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 flex justify-center items-center gap-2 mb-4"
                onClick={handleCreateBox}
                disabled={items.length === 0 || saveBoxMutation.isPending}
              >
                <span>
                  {saveBoxMutation.isPending ? "Creating..." : "Create box"}
                </span>
              </Button>
            </div>
          )
        )}
        
      </div>
    </div>
  );
};

export default AddBox;