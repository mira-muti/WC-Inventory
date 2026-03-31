import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Size } from "@/types/size";
import { format } from "date-fns";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

interface SizeTableProps {
    sizes: Size[];
    categoryFilter?: string;
    onEdit: (size: Size) => void;
    onDelete: (sizeId: string) => void;
}

export function SizeTable({ sizes, categoryFilter, onEdit, onDelete }: SizeTableProps) {
    // Filter sizes based on category if filter is provided
    const filteredSizes = categoryFilter
        ? sizes.filter(size => size.category === categoryFilter)
        : sizes;

    if (!filteredSizes.length) {
        return (
            <div className="text-center py-4 text-muted-foreground">
                No sizes found
            </div>
        );
    }

    return (
        <div className="rounded-md border bg-white px-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Size Group</TableHead>
                        <TableHead>Region</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>Numerical</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredSizes.map((size) => (
                        <TableRow key={size.size_id}>
                            <TableCell className="font-medium">{size.name}</TableCell>
                            <TableCell>{size.size_group}</TableCell>
                            <TableCell>{size.region}</TableCell>
                            <TableCell>{size.gender}</TableCell>
                            <TableCell>{size.is_numerical ? "Yes" : "No"}</TableCell>
                            <TableCell>{size.numerical_value || "-"}</TableCell>
                            <TableCell>
                                {size.updated_at ? format(new Date(size.updated_at), 'PP') : '-'}
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={() => onEdit(size)}
                                        >
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => onDelete(size.size_id)}
                                            className="text-destructive"
                                        >
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}