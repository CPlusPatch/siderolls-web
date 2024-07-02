import type { ContentItem } from "@/classes/sidepage/schema";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardTitle,
} from "@/components/ui/card";
import { Icon } from "@iconify-icon/react";
import { Edit, Trash } from "lucide-react";
import type { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const ContentGridItem: FC<
    { item: ContentItem } & ContentItemActions
> = ({ item, onDelete, onEdit }) => {
    return (
        <Card className="grid grid-cols-[auto_1fr_auto] gap-4 p-4">
            <CardContent className="p-0">
                <Avatar className="overflow-hidden size-20 rounded ring-ring/5 ring-1 relative">
                    <AvatarImage
                        src={item.type === "link" ? item.image : ""}
                        alt=""
                    />
                    <AvatarFallback className="animate-pulse rounded-none" />
                </Avatar>
            </CardContent>
            <div className="flex flex-col justify-around overflow-hidden text-ellipsis max-h-20">
                <CardTitle className="text-base font-semibold text-foreground line-clamp-1">
                    {item.title}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                </CardDescription>
            </div>
            <CardFooter className="p-0 flex flex-col gap-y-1 justify-around">
                <GridItemContextMenu
                    item={item}
                    onDelete={onDelete}
                    onEdit={onEdit}
                />
            </CardFooter>
        </Card>
    );
};

interface GridProps {
    items: ContentItem[];
}

interface ContentItemActions {
    onDelete?: (id: string) => void;
    onEdit?: (id: string) => void;
}

export const ContentGrid: FC<GridProps & ContentItemActions> = ({
    items,
    onDelete,
    onEdit,
}) => {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
                <ContentGridItem
                    key={item.id}
                    item={item}
                    onDelete={onDelete}
                    onEdit={onEdit}
                />
            ))}
        </div>
    );
};

export const GridItemContextMenu: FC<
    { item: ContentItem } & ContentItemActions
> = ({ item, onDelete }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild={true}>
                <Button variant="ghost" size="icon">
                    <Icon icon="tabler:dots" className="size-4" width="none" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mx-2">
                <DropdownMenuLabel>{item.title}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                    <DropdownMenuShortcut>⌘I</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => {
                        onDelete?.(item.id);
                    }}
                >
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Remove</span>
                    <DropdownMenuShortcut>⌫</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
