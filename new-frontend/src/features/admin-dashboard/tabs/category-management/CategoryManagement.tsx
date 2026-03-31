import { useEffect, useState } from "react";
import type { Category } from "@/types/category";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import CategoryForm, { CategoryFormProps } from "./components/category-form";
import CategoriesTable from "./components/category-table";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCategories } from "./hooks/use-categories";
import { getAllIcons } from "@/lib/iconLoader";

const CategoryManagement = () => {
    const {
        categories,
        isLoading,
        createMutation,
        updateMutation,
        deleteMutation,
    } = useCategories();
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    const sortedCategories = [...categories].sort((a, b) => a.name.localeCompare(b.name));
    const [globalFilter, setGlobalFilter] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);


    const handleSubmit: CategoryFormProps["onSubmit"] = async (data) => {
        try {
            if (selectedCategory) {
                await updateMutation.mutateAsync({
                    id: selectedCategory.category_id,
                    data,
                });
            } else {
                await createMutation.mutateAsync(data);
            }
        } catch (error) {
            console.error('Form submission error:', error);
        }
        handleClose();
    };

    const handleDelete = (id: string) => {
        // Check if category has any children
        const hasChildren = categories.some(category => category.parent_id === id);

        if (hasChildren) {
            toast({
                title: "Cannot Delete",
                description: "This category has sub-categories. Please delete or reassign them first.",
                variant: "destructive"
            });
            return;
        }

        if (window.confirm("Are you sure you want to delete this category?")) {
            deleteMutation.mutate(id);
        }
    };

    const handleClose = () => {
        setIsDialogOpen(false);
        setSelectedCategory(null);

    };

    const handleEdit = (category: Category) => {
        setSelectedCategory(category);  // Update selectedCategory to the full Category
        setIsDialogOpen(true);  // Open the dialog to edit
    };

    useEffect(() => {
        const fetchIcons = async () => {
            getAllIcons();
          
        };
        fetchIcons();
      }, []);


    if (isLoading) return <div>Loading...</div>;

    return (
        <>
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search categories..."
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                    <Button onClick={() => setIsDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Category
                    </Button>
                </div>

                <CategoriesTable
                    data={sortedCategories}
                    filter={globalFilter}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    expandedCategories={expandedCategories}
                    setExpandedCategories={setExpandedCategories}
                />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={handleClose}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedCategory ? "Edit Category" : "Create New Category"}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedCategory
                                ? "Edit the details of the existing category"
                                : "Add a new category to the system"}
                        </DialogDescription>
                    </DialogHeader>
                    <CategoryForm
                        categories={categories.filter(
                            (category) => category.category_id !== selectedCategory?.category_id
                        )}
                        onSubmit={handleSubmit}
                        initialData={selectedCategory}
                        isLoading={createMutation.isPending || updateMutation.isPending}
                        onClose={handleClose}
                    />
                </DialogContent>
        
            </Dialog>
        </>
    );
};

export default CategoryManagement;

