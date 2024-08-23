"use client";

import { ContentGrid } from "@/components/ContentGrid";
import { useMitt } from "@/components/events/useMitt";
import { SortDropdown } from "@/components/forms/SortDropdown";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApi } from "@/lib/api";
import { File, Plus } from "lucide-react";
import { type FC, useEffect, useState } from "react";

const FeedMain: FC = () => {
    const api = useApi();
    const { data } = api.useGetAllRows();
    const [sortedValue, setSortedValue] = useState<"created_at" | "title">(
        "created_at",
    );
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

    const [loggedIn, setLoggedIn] = useState(false);
    const mitt = useMitt();

    // SSR-safe localStorage check if token is present
    useEffect(() => {
        const checkToken = () => {
            setLoggedIn(!!localStorage.getItem("token"));
        };

        if (typeof window !== "undefined") {
            mitt.emitter.on("set-token", checkToken);
            checkToken();
        }

        return () => {
            mitt.emitter.off("set-token", checkToken);
        };
    }, [mitt.emitter.on, mitt.emitter.off]);

    return (
        <div className="p-4 flex flex-col gap-y-4 w-full h-full overflow-hidden">
            <Tabs defaultValue="all" className="flex flex-col grow">
                <div className="flex items-center gap-4">
                    {loggedIn && (
                        <Button
                            size="sm"
                            onClick={() => {
                                mitt.emitter.emit("create-content");
                            }}
                        >
                            <Plus className="size-4 mr-2" aria-hidden={true} />
                            Add content
                        </Button>
                    )}
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="active">Active</TabsTrigger>
                        <TabsTrigger value="draft">Draft</TabsTrigger>
                        <TabsTrigger
                            value="archived"
                            className="hidden sm:flex"
                        >
                            Archived
                        </TabsTrigger>
                    </TabsList>
                    <div className="ml-auto flex items-center gap-2">
                        <SortDropdown
                            defaultValue={sortedValue}
                            defaultDirection={sortDirection}
                            onChange={(value, direction) => {
                                setSortedValue(value);
                                setSortDirection(direction);
                            }}
                        />
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-8 gap-1"
                        >
                            <File className="h-3.5 w-3.5" aria-hidden={true} />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Export
                            </span>
                        </Button>
                    </div>
                </div>
                <TabsContent value="all" className="py-4 h-full">
                    {data && data.length > 0 ? (
                        <ContentGrid
                            items={data}
                            /* sort={(a, b) => {
                                if (sortedValue === "created_at") {
                                    return sortDirection === "asc"
                                        ? new Date(a.created_at).getTime() -
                                              new Date(b.created_at).getTime()
                                        : new Date(b.created_at).getTime() -
                                              new Date(a.created_at).getTime();
                                }
                                if (sortedValue === "title") {
                                    return sortDirection === "asc"
                                        ? a.title.localeCompare(b.title)
                                        : b.title.localeCompare(a.title);
                                }
                                return 0;
                            }} */
                        />
                    ) : (
                        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm w-full h-full">
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h3 className="text-2xl font-bold tracking-tight">
                                    It's empty here
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    This feed has no content. Come back later
                                    for updates.
                                </p>
                            </div>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default FeedMain;
