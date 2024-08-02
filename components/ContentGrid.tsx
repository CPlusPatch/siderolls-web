import { CardTitle } from "@/components/ui/card";
import { Icon } from "@iconify-icon/react";
import { Edit } from "lucide-react";
import type { FC } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";

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
import type { DataRow } from "@/lib/api";
import TimeAgo from "react-timeago-i18n";

export const ContentGridItem: FC<{ item: DataRow } & ContentItemActions> = ({
    item,
    onDelete,
    onEdit,
}) => {
    return (
        <>
            <div className="space-y-4">
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm aspect-[16/9] overflow-hidden">
                    {item.banner_image ? (
                        <img
                            src={item.banner_image}
                            alt="Thumbnail"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full">
                            <Icon
                                icon="tabler:link"
                                className="size-16 text-muted-foreground"
                                width="none"
                            />
                        </div>
                    )}
                </div>
                <div className="grid grid-cols-[auto_1fr_auto] items-start gap-x-4">
                    <Avatar className="rounded">
                        <AvatarFallback className="rounded">
                            <Icon
                                icon="tabler:link"
                                className="size-6 text-foreground"
                                width="none"
                            />
                        </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1 break-words overflow-hidden">
                        <CardTitle className="font-semibold text-base line-clamp-2">
                            {item.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            <TimeAgo date={item.created_at} />
                        </p>
                    </div>
                    <div className="shrink-0">
                        <GridItemContextMenu
                            item={item}
                            onDelete={onDelete}
                            onEdit={onEdit}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

interface GridProps {
    items: DataRow[];
}

interface ContentItemActions {
    onDelete?: (id: string) => void;
    onEdit?: (id: string) => void;
    sort?: (a: DataRow, b: DataRow) => number;
}

export const ContentGrid: FC<GridProps & ContentItemActions> = ({
    items,
    onDelete,
    onEdit,
    sort,
}) => {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.toSorted(sort).map((item) => (
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
    { item: DataRow } & ContentItemActions
> = ({ item }) => {
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
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
