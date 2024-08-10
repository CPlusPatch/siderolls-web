import { CardTitle } from "@/components/ui/card";
import { Icon } from "@iconify-icon/react";
import { Edit, Folder } from "lucide-react";
import type { FC } from "react";
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
import Skeleton from "react-loading-skeleton";

export const ContentGridItem: FC<{ item: DataRow } & ContentItemActions> = ({
    item,
    onDelete,
    onEdit,
}) => {
    return (
        <>
            <Link href={`/feed/${item.id}`}>
                <div className="rounded relative border bg-card text-card-foreground shadow-sm overflow-hidden">
                    <div className="flex items-center justify-center w-full h-full bg-accent/10">
                        {item.banner_image ? (
                            <img
                                src={item.banner_image}
                                alt={item.title}
                                className="w-full"
                            />
                        ) : (
                            <Folder className="size-16 text-accent-foreground" />
                        )}
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 via-[4rem] to-card/0 to-[10rem]" />

                    <div className="grid absolute z-10 bottom-0 inset-x-0 p-4 grid-cols-[1fr_auto] items-center gap-x-4">
                        <div className="space-y-0 break-all">
                            <CardTitle className="font-semibold text-base line-clamp-2">
                                {item.title || <Skeleton />}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground">
                                {item.created_at ? (
                                    <TimeAgo date={item.created_at} />
                                ) : (
                                    <Skeleton />
                                )}
                            </p>
                        </div>
                        <div
                            className="shrink-0"
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                        >
                            {item.id ? (
                                <GridItemContextMenu
                                    item={item}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                />
                            ) : (
                                <Skeleton className="!size-10" />
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </>
    );
};

export const ContentGridItemSkeleton: FC = () => (
    <ContentGridItem
        item={{
            id: 3,
            title: "",
            created_at: "",
            banner_image: "",
            tags: [],
            links: [],
            content: "",
        }}
    />
);

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
