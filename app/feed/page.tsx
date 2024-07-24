"use client";

import { ContentGrid, type ContentItem } from "@/components/ContentGrid";
import { AddContentForm } from "@/components/forms/AddContent";
import { SortDropdown } from "@/components/forms/SortDropdown";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { File, PlusCircle } from "lucide-react";
import { type FC, useState } from "react";

const FeedMain: FC = () => {
    const content: ContentItem[] = [];
    const [sortedValue, setSortedValue] = useState<
        "created_at" | "type" | "title"
    >("created_at");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
    const authenticated = true;

    return (
        <div className="p-4 flex flex-col gap-y-4 w-full h-full overflow-hidden">
            <Tabs defaultValue="all" className="flex flex-col grow">
                <div className="flex items-center">
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
                            <File className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Export
                            </span>
                        </Button>
                        {authenticated && (
                            <AddContentForm>
                                <Button
                                    size="sm"
                                    className="h-8 gap-1"
                                    type="button"
                                >
                                    <PlusCircle className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                        Add Content
                                    </span>
                                </Button>
                            </AddContentForm>
                        )}
                    </div>
                </div>
                <TabsContent value="all" className="py-4 h-full">
                    {content.length > 0 ? (
                        <ContentGrid
                            items={content}
                            sort={(a, b) => {
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
                                if (sortedValue === "type") {
                                    return sortDirection === "asc"
                                        ? a.type.localeCompare(b.type)
                                        : b.type.localeCompare(a.type);
                                }
                                return 0;
                            }}
                        />
                    ) : (
                        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm w-full h-full">
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h3 className="text-2xl font-bold tracking-tight">
                                    It's empty here
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {authenticated
                                        ? `Press the "Add Content" button to get
                                        started`
                                        : "This feed has no content. Come back later for updates."}
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
