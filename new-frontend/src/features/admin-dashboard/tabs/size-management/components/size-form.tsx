import React, { FC } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Size, SizeFormData, SizeCategoryEnum, SizeRegionEnum, GenderEnum } from "@/types/size";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
    name: z.string()
        .min(1, "Name is required")
        .max(50, "Name must be 50 characters or less"),
    category: z.enum(["Adult", "Kid", "Shoe", "Other"] as const),
    region: z.enum(["US", "EU", "UK", "INT"] as const),
    gender: z.enum(["Male", "Female", "Kids", "Unisex"] as const),
    is_numerical: z.boolean().default(false),
    numerical_value: z.number().nullable(),
});

//type FormValues = z.infer<typeof formSchema>;

export interface SizeFormProps {
    onSubmit: (values: SizeFormData) => Promise<void>;
    initialData?: Size;
    isLoading: boolean;
    onClose: () => void;
}

const SizeForm: FC<SizeFormProps> = ({
                                         onSubmit,
                                         initialData,
                                         isLoading,
                                         onClose,
                                     }) => {
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name || "",
            category: (initialData?.category as SizeCategoryEnum) || "Adult",
            region: (initialData?.region as SizeRegionEnum) || "US",
            gender: (initialData?.gender as GenderEnum) || "Unisex",
            is_numerical: initialData?.is_numerical || false,
            numerical_value: initialData?.numerical_value || null,
        },
    });

    type FormData = {
        name: string;
        category: SizeCategoryEnum;
        region: SizeRegionEnum;
        gender: GenderEnum;
        is_numerical: boolean;
        numerical_value: number | null;
    };


    const values = form.getValues();
    const isNumerical = values.is_numerical;

    const handleSubmit = async (values: FormData) => {
        try {
            await onSubmit(values as SizeFormData);
        } catch (error: any) {
            if (error.message?.includes('duplicate key value')) {
                form.setError("name", {
                    type: "manual",
                    message: "A size with these specifications already exists"
                });
            }
        }
    };



    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Size Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter size name (e.g., XL, 42, 10)"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="category"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Adult">Adult</SelectItem>
                                            <SelectItem value="Kid">Kid</SelectItem>
                                            <SelectItem value="Shoe">Shoe</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="region"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Region</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select region" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="US">US</SelectItem>
                                            <SelectItem value="EU">EU</SelectItem>
                                            <SelectItem value="UK">UK</SelectItem>
                                            <SelectItem value="INT">International</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Gender</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Male">Male</SelectItem>
                                        <SelectItem value="Female">Female</SelectItem>
                                        <SelectItem value="Kids">Kids</SelectItem>
                                        <SelectItem value="Unisex">Unisex</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="is_numerical"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        Numerical Size
                                    </FormLabel>
                                    <FormDescription>
                                        Check if this size can be represented as a number (e.g., shoe sizes)
                                    </FormDescription>
                                </div>
                            </FormItem>
                        )}
                    />

                    {isNumerical && (
                        <FormField
                            control={form.control}
                            name="numerical_value"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Numerical Value</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.5"
                                            value={field.value ?? ""}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                field.onChange(value ? parseFloat(value) : null);
                                            }}
                                            name={field.name}
                                            onBlur={field.onBlur}
                                            ref={field.ref}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        The numerical representation of this size (e.g., 42 for EU shoe size)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                </div>

                <div className="flex justify-end space-x-4">
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
                        disabled={isLoading}
                    >
                        {initialData ? 'Update' : 'Create'} Size
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default SizeForm;