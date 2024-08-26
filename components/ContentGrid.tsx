import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
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
import { Icon } from "@iconify-icon/react";
import { Edit, Folder } from "lucide-react";
import { Masonry } from "masonic";
import Link from "next/link";
import type { FC } from "react";
import Skeleton from "react-loading-skeleton";
import TimeAgo from "react-timeago-i18n";

export const ContentGridItem: FC<{ item: DataRow } & ContentItemActions> = ({
    item,
    onDelete,
    onEdit,
}) => {
    return (
        <>
            <Link href={`/feed/${item.id}`}>
                <div className="rounded relative border bg-card/80 text-card-foreground shadow-sm overflow-hidden">
                    <div className="flex items-center justify-center w-full h-full bg-accent/10">
                        {item.image ? (
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full"
                            />
                        ) : (
                            <Folder className="size-16 text-accent-foreground" />
                        )}
                    </div>

                    <div className="grid sm:py-4 px-4 py-3 grid-cols-[1fr_auto] items-center gap-x-4 border-t border-border">
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
            image: "",
            tags: [],
            links: [],
            content: "",
            data: {},
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
            maxColumnCount={6}
            columnWidth={200}
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
                    <span className="sr-only">More options</span>
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
