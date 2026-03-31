import { Search } from "lucide-react";
import { Input } from "../ui/input";

export const SearchBar = ({
    value,
    onChange,
}: {
    value: string;
    onChange: (value: string) => void;
}) => (
    <div className="relative max-w-sm">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
            placeholder="Search locations..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="pl-8"
        />
    </div>
);