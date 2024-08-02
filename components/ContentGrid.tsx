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
import { Masonry } from "masonic";
import Link from "next/link";
import TimeAgo from "react-timeago-i18n";

export const ContentGridItem: FC<{ item: DataRow } & ContentItemActions> = ({
    item,
    onDelete,
    onEdit,
}) => {
    return (
        <>
            <Link className="space-y-4" href={`/feed/${item.id}`}>
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
                    {item.banner_image ? (
                        <img
                            src={item.banner_image}
                            alt="Thumbnail"
                            className="w-full h-full"
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
            </Link>
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
        <Masonry
            items={items.toSorted(sort)}
            columnGutter={32}
            maxColumnCount={4}
            render={({ data }) => (
                <ContentGridItem
                    item={data}
                    onDelete={onDelete}
                    onEdit={onEdit}
                />
            )}
        />
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
