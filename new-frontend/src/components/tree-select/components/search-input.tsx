import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const SearchInput = ({ value, onChange, disabled = false }: SearchInputProps): JSX.Element => {
  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search locations..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-8"
        disabled={disabled}
      />
    </div>
  );
};

export default SearchInput;
