import type { ContentItem } from "@/classes/sidepage/schema";
import { CardTitle } from "@/components/ui/card";
import { Icon } from "@iconify-icon/react";
import { Edit, Trash } from "lucide-react";
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
import TimeAgo from "react-timeago-i18n";

export const ContentGridItem: FC<
    { item: ContentItem } & ContentItemActions
> = ({ item, onDelete, onEdit }) => {
    return (
        <>
            <div className="space-y-4">
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm aspect-[16/9] overflow-hidden">
                    {item.type === "link" && !!item.image ? (
                        <img
                            src={item.type === "link" ? item.image : ""}
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
                    <div className="space-y-1">
                        <CardTitle className="font-semibold text-base line-clamp-2">
                            {item.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            <TimeAgo date={item.dateAdded} />
                        </p>
                    </div>
                    <div>
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                {item.type === "link" && (
                    <DropdownMenuItem
                        onClick={() => {
                            navigator.clipboard.writeText(item.url);
                        }}
                    >
                        <Icon
                            className="mr-2 h-4 w-4"
                            icon="tabler:clipboard"
                        />
                        <span>Copy Link</span>
                        <DropdownMenuShortcut>⏎</DropdownMenuShortcut>
                    </DropdownMenuItem>
                )}
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
