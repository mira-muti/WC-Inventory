import { useState } from "react";
import { Size } from "@/types/size";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSizes } from "./hooks/use-sizes";
import { SizeTable } from "./components/size-table";
import SizeForm from "./components/size-form";
import { sizeApi } from "@/lib/api/sizes";



const SizeManagement = () => {
    const {
        sizes,
        isLoading,
        createMutation,
        updateMutation,
        deleteMutation
    } = useSizes();

    const [filter, setFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
    const [regionFilter, setRegionFilter] = useState<string | undefined>();
    const [sortBy, setSortBy] = useState<"updated" | "asc" | "desc">("updated");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedSize, setSelectedSize] = useState<Size | undefined>(undefined);
    const [updateConfirmation, setUpdateConfirmation] = useState<{
        show: boolean;
        size: Size | undefined;
        newData: any;
        usageCount: number;
    }>({
        show: false,
        size: undefined,
        newData: null,
        usageCount: 0
    });

    const handleSubmit = async (data: any) => {
        try {
            if (selectedSize) {
                // Check if size is in use
                const usageCount = await sizeApi.checkSizeUsage(selectedSize.size_id);
                if (usageCount > 0) {
                    setUpdateConfirmation({
                        show: true,
                        size: selectedSize,
                        newData: data,
                        usageCount
                    });
                    return;
                }
                // If not in use, proceed with update
                await updateMutation.mutateAsync({
                    id: selectedSize.size_id,
                    data,
                });
            } else {
                await createMutation.mutateAsync(data);
            }
            handleClose();
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteMutation.mutateAsync(id);
            toast({
                title: "Success",
                description: "Size deleted successfully",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to delete size",
                variant: "destructive"
            });
        }
    };

    const handleClose = () => {
        setIsDialogOpen(false);
        setSelectedSize(undefined);
    };

    const handleEdit = (size: Size) => {
        setSelectedSize(size);
        setIsDialogOpen(true);
    };

    const handleUpdateConfirm = async () => {
        if (updateConfirmation.size && updateConfirmation.newData) {
            try {
                await updateMutation.mutateAsync({
                    id: updateConfirmation.size.size_id,
                    data: updateConfirmation.newData
                });
                handleClose();
            } catch (error) {
                console.error('Error updating size:', error);
            }
        }
        setUpdateConfirmation({ show: false, size: undefined, newData: null, usageCount: 0 });
    };

    // Helper function to get size weight for sorting
    const getSizeWeight = (size: string): number => {
        const sizeStr = size.toUpperCase();
        
        // Handle numerical sizes
        if (!isNaN(Number(sizeStr))) {
            return Number(sizeStr) + 1000; // Put numerical sizes after letter sizes
        }

        // Base weights for standard sizes
        const baseWeights: { [key: string]: number } = {
            'XXS': 100,
            'XS': 200,
            'S': 300,
            'M': 400,
            'L': 500,
            'XL': 600,
            'XXL': 700
        };

        // Check if the size exists in baseWeights
        if (baseWeights[sizeStr]) {
            return baseWeights[sizeStr];
        }

        // Handle sizes with multiple X's
        if (sizeStr.includes('S')) {
            const xCount = (sizeStr.match(/X/g) || []).length;
            if (xCount > 2) {
                // For sizes like XXXS, XXXXS, etc.
                return 100 - ((xCount - 2) * 50); // Makes XXXS=50, XXXXS=0, etc.
            }
        } else if (sizeStr.includes('L')) {
            const xCount = (sizeStr.match(/X/g) || []).length;
            if (xCount > 2) {
                // For sizes like XXXL, XXXXL, etc.
                return 700 + ((xCount - 2) * 50); // Makes XXXL=750, XXXXL=800, etc.
            }
        }

        // For any other format, use string comparison weight
        return 1500; // Put unknown formats at the end
    };

    const sortSizes = (sizesToSort: Size[]) => {
        return [...sizesToSort].sort((a, b) => {
            switch (sortBy) {
                case "asc":
                    // Sort by numerical value if both sizes have it
                    if (a.numerical_value !== null && b.numerical_value !== null) {
                        return a.numerical_value - b.numerical_value;
                    }
                    // Get weights for non-numerical sizes
                    const weightA = getSizeWeight(a.name);
                    const weightB = getSizeWeight(b.name);
                    
                    // If both have weights, use them
                    if (weightA && weightB) {
                        return weightA - weightB;
                    }
                    // If only one has numerical value, put non-numerical last
                    if (a.numerical_value === null && b.numerical_value !== null) return 1;
                    if (a.numerical_value !== null && b.numerical_value === null) return -1;
                    // If neither has numerical value or weights, sort by name
                    return a.name.localeCompare(b.name);
                case "desc":
                    // Sort by numerical value if both sizes have it
                    if (a.numerical_value !== null && b.numerical_value !== null) {
                        return b.numerical_value - a.numerical_value;
                    }
                    // Get weights for non-numerical sizes
                    const weightADesc = getSizeWeight(a.name);
                    const weightBDesc = getSizeWeight(b.name);
                    
                    // If both have weights, use them
                    if (weightADesc && weightBDesc) {
                        return weightBDesc - weightADesc;
                    }
                    // If only one has numerical value, put non-numerical last
                    if (a.numerical_value === null && b.numerical_value !== null) return 1;
                    if (a.numerical_value !== null && b.numerical_value === null) return -1;
                    // If neither has numerical value or weights, sort by name in reverse
                    return b.name.localeCompare(a.name);
                case "updated":
                default:
                    // Sort by updated_at date
                    const aDate = a.updated_at ? new Date(a.updated_at) : new Date(0);
                    const bDate = b.updated_at ? new Date(b.updated_at) : new Date(0);
                    return bDate.getTime() - aDate.getTime();
            }
        });
    };
    
    const filteredSizes = sortSizes(
        sizes.filter(size => {
            const matchesSearch = 
                size.name.toLowerCase().includes(filter.toLowerCase()) ||
                size.category.toLowerCase().includes(filter.toLowerCase()) ||
                size.region.toLowerCase().includes(filter.toLowerCase()) ||
                size.gender.toLowerCase().includes(filter.toLowerCase());
            
            const matchesCategory = !categoryFilter || size.category === categoryFilter;
            const matchesRegion = !regionFilter || size.region === regionFilter;
            
            return matchesSearch && matchesCategory && matchesRegion;
        })
    );

    if (isLoading) return <div>Loading...</div>;

    return (
        <>
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">

                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search sizes..."
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="pl-8 w-[300px]"
                            />
                        </div>

                        <Select
                            value={categoryFilter || "all"}
                            onValueChange={(v) => setCategoryFilter(v === "all" ? undefined : v)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Categories" /> 
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                <SelectItem value="Adult">Adult Sizes</SelectItem>
                                <SelectItem value="Kid">Kid Sizes</SelectItem>
                                <SelectItem value="Shoe">Shoe Sizes</SelectItem>
                            </SelectContent>
                        </Select>


                        <Select
                            value={regionFilter || "all"}
                            onValueChange={(v) => setRegionFilter(v === "all" ? undefined : v)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Regions" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Regions</SelectItem>
                                <SelectItem value="US">US</SelectItem>
                                <SelectItem value="EU">EU</SelectItem>
                                <SelectItem value="UK">UK</SelectItem>
                                <SelectItem value="INT">International</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={sortBy}
                            onValueChange={(v) => setSortBy(v as "updated" | "asc" | "desc")}
                        >
                            <SelectTrigger>
                                <div className="flex items-center gap-1.5">
                                    <span>Sort By:</span> 
                                    <SelectValue
                                        placeholder="Sort By"
                                    />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="updated">Last Updated</SelectItem>
                                <SelectItem value="asc">Smallest to Largest</SelectItem>
                                <SelectItem value="desc">Largest to Smallest</SelectItem>
                            </SelectContent>
                        </Select>

                    </div>
                    <Button onClick={() => setIsDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Size
                    </Button>
                </div>

                <SizeTable
                    sizes={filteredSizes}
                    categoryFilter={categoryFilter}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            <Dialog open={isDialogOpen} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedSize ? "Edit Size" : "Create New Size"}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedSize
                                ? "Edit the details of the existing size"
                                : "Add a new size to the system"}
                        </DialogDescription>
                    </DialogHeader>
                    <SizeForm
                        initialData={selectedSize}
                        onSubmit={handleSubmit}
                        isLoading={createMutation.isPending || updateMutation.isPending}
                        onClose={handleClose}
                    />
                </DialogContent>
            </Dialog>

            <AlertDialog
                open={updateConfirmation.show}
                onOpenChange={(open) => !open && setUpdateConfirmation({
                    show: false,
                    size: undefined,
                    newData: null,
                    usageCount: 0
                })}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Size Update</AlertDialogTitle>
                        <AlertDialogDescription>
                            This size is currently assigned to {updateConfirmation.usageCount} items in the inventory.
                            Updating this size will affect all these items. Are you sure you want to proceed?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleUpdateConfirm}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default SizeManagement;