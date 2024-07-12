"use client";

import {
    aggregator,
    useSidepages,
} from "@/classes/aggregator/content-aggregator";
import type { Sidepage } from "@/classes/sidepage/schema";
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
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { Edit, Ellipsis, Folder } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FC } from "react";
import Skeleton from "react-loading-skeleton";
import TimeAgo from "react-timeago-i18n";

const DashboardMain: FC = () => {
    const { sidepages, loading } = useSidepages(aggregator);
    const router = useRouter();

    return (
        <div className="p-4 flex flex-col gap-y-4 w-full h-full overflow-hidden">
            {loading ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {/* biome-ignore lint/style/useNamingConvention: Empty variable */}
                    {Array.from({ length: 8 }).map((_, i) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: This is a skeleton loader, items won't change
                        <SidepageSkeleton key={i} />
                    ))}
                </div>
            ) : sidepages.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {sidepages.map((sidepage) => (
                        <SidepageRenderer
                            key={sidepage.id}
                            sidepage={sidepage}
                            onDelete={(id) => {
                                aggregator.removeSidepage(id);
                            }}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm w-full h-full">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h3 className="text-2xl font-bold tracking-tight">
                            You have no sidepages
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Create a sidepage to get started
                        </p>
                        <Button
                            className="mt-4"
                            onClick={async () => {
                                const { id } = await aggregator.createSidepage({
                                    title: "Untitled Sidepage",
                                    description: "An untitled sidepage",
                                    creator: "user",
                                    associated: [],
                                });
                                router.push(`/sidepages/${id}`);
                            }}
                        >
                            Create Sidebage
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

interface SidepageRendererProps {
    sidepage: Sidepage;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}

const SidepageRenderer: FC<SidepageRendererProps> = ({
    sidepage,
    onEdit,
    onDelete,
}) => {
    return (
        <div className="space-y-4">
            <Link href={`/sidepages/${sidepage.id}`}>
                <div className="rounded-lg relative border bg-card text-card-foreground shadow-sm aspect-[16/9] overflow-hidden">
                    <div className="flex items-center justify-center w-full h-full bg-accent/10">
                        <Folder className="size-16 text-accent-foreground" />
                    </div>

                    {/* Shadow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-card/40" />

                    <div className="grid absolute z-10 bottom-0 inset-x-0 p-4 grid-cols-[1fr_auto] items-center gap-x-4">
                        <div className="space-y-1 break-all">
                            <CardTitle className="font-semibold text-base line-clamp-2">
                                {sidepage.title || <Skeleton />}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {sidepage.created_at ? (
                                    <TimeAgo date={sidepage.created_at} />
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
                            {sidepage.id ? (
                                <SidepageContextMenu
                                    sidepage={sidepage}
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
        </div>
    );
};

const SidepageContextMenu: FC<SidepageRendererProps> = ({
    sidepage,
    onEdit,
    onDelete,
}) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild={true}>
                <Button variant="ghost" size="icon">
                    <Ellipsis className="size-4" width="none" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mx-2">
                <DropdownMenuLabel>{sidepage.title}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onEdit?.(sidepage.id)}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                    <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete?.(sidepage.id)}>
                    <Icon className="mr-2 h-4 w-4" icon="tabler:trash" />
                    <span>Delete</span>
                    <DropdownMenuShortcut>⌫</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const SidepageSkeleton: FC = () => (
    <SidepageRenderer
        sidepage={{
            id: "",
            title: "",
            description: "",
            creator: "",
            created_at: "",
            updated_at: "",
            associated: [],
            content: [],
        }}
    />
);

export default DashboardMain;
