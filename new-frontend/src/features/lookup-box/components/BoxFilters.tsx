import { Check, X } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { BoxView } from "@/types/box";


interface BoxFiltersProps {
  boxes: BoxView[];
  boxIdFilters: Record<string, string>;
  handleBoxIdFilterChange: (id: string, name: string) => void;
  clearAllBoxIds: () => void;
}

const BoxFilters = ({
  boxes,
  boxIdFilters,
  handleBoxIdFilterChange,
  clearAllBoxIds,
}: BoxFiltersProps) => {

  const [open, setOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");

  return (

    <>

      <h2 className="flex-1 flex flex-col justify-center text-2xl text-black tracking-wide text-center mb-4">
        Input Box ID(s)
      </h2>

      <div className="flex-[3] flex flex-col">

        <Popover open={open} onOpenChange={setOpen}>

          <PopoverTrigger asChild>
            <div
              className="w-full min-h-[4rem] max-h-[16rem] h-sm:max-h-[10rem] lg:max-h-[25rem] overflow-y-auto flex-1 flex flex-wrap content-start items-start gap-3 rounded-lg border-2 border-black bg-gray-200 hover:bg-gray-300 text-lg mb-10 p-5 font-medium text-gray-800 shadow duration-300 ease-in-out cursor-text"
              onClick={() => setOpen(true)}
            >
              {Object.entries(boxIdFilters).length > 0 ? (
                Object.entries(boxIdFilters).map(([id, name]) => (
                  <Badge
                    key={id}
                    variant="secondary"
                    className="flex items-center gap-3 bg-gray-50 text-black border border-black text-lg"
                  >
                    {name}
                    <X
                      size={22}
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBoxIdFilterChange(id, name);
                      }}
                    />
                  </Badge>
                ))
              ) : (
                <span className="text-gray-500">
                  e.g. Box 04
                </span>
              )}
            </div>
          </PopoverTrigger>

          <PopoverContent 
            className="p-0 w-full" 
            side="bottom" 
            avoidCollisions={false}
          >
            <Command shouldFilter={false}>

              <CommandInput
                placeholder="Search boxes ..."
                value={inputValue}
                onValueChange={setInputValue}
              />

              <CommandList className="max-h-[8rem] overflow-y-auto">
                <CommandEmpty>
                  <p className="text-red-600 font-medium p-2">
                    Error: No matching boxes
                  </p>
                </CommandEmpty>

                <CommandGroup>
                  {boxes.filter((box) =>
                    box.name.toLowerCase().includes(inputValue.toLowerCase())
                  ).map((box) => (
                    <CommandItem
                      key={box.id}
                      onSelect={() => {
                        handleBoxIdFilterChange(box.id, box.name);
                        setInputValue("");
                      }}
                    >
                      <Check
                        className={
                          `mr-2 h-4 w-4 
                          ${ box.id in boxIdFilters
                            ? "opacity-100"
                            : "opacity-0"
                          }
                        `}
                      />
                      {box.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>

            </Command>
          </PopoverContent>

        </Popover>

        {Object.entries(boxIdFilters).length > 0 && (
          <div className="flex justify-center mt-2 h-sm:mt-0.5">
            <button
              onClick={clearAllBoxIds}
              className="py-2 px-4 text-lg rounded-lg text-gray-500 hover:text-gray-900 border border-black"
            >
              Clear all
            </button>
          </div>
        )}

      </div>

    </>
  );
};

export default BoxFilters;