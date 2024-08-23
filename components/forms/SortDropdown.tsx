import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ListFilter } from "lucide-react";
import { type FC, useState } from "react";

type SortableValue = "created_at" | "title";
type Direction = "asc" | "desc";

export const SortDropdown: FC<{
    defaultValue?: SortableValue;
    defaultDirection?: Direction;
    onChange?: (value: SortableValue, direction: Direction) => void;
}> = ({ defaultValue, defaultDirection, onChange }) => {
    const [value, setValue] = useState<SortableValue>(
        defaultValue ?? "created_at",
    );
    const [direction, setDirection] = useState<Direction>(
        defaultDirection ?? "desc",
    );

    const handleSelect = (value: SortableValue, direction: Direction) => {
        setValue(value);
        setDirection(direction);
        onChange?.(value, direction);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild={true}>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                    <ListFilter className="h-3.5 w-3.5" aria-hidden={true} />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Sort
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                    checked={direction === "asc"}
                    onClick={() => handleSelect(value, "asc")}
                >
                    Ascending
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={direction === "desc"}
                    onClick={() => handleSelect(value, "desc")}
                >
                    Descending
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                    checked={value === "created_at"}
                    onClick={() => handleSelect("created_at", direction)}
                >
                    Date
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={value === "title"}
                    onClick={() => handleSelect("title", direction)}
                >
                    Title
                </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
