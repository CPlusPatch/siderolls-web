"use client";

import {
    aggregator,
    useContent,
    useSidepages,
} from "@/classes/aggregator/content-aggregator";
import { ContentGrid } from "@/components/ContentGrid";
import { CreateParamHandler } from "@/components/events/CreateParamHandler";
import { AddContentForm } from "@/components/forms/AddContent";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { File, ListFilter, PlusCircle } from "lucide-react";
import type { FC } from "react";

const DashboardMain: FC<{
    params: {
        id: string;
    };
}> = ({ params }) => {
    const content = useContent(aggregator, params.id);
    const sidepages = useSidepages(aggregator);

    return (
        <div className="p-4 flex flex-col gap-y-4 w-full h-full overflow-hidden">
            <CreateParamHandler sidepageId={params.id} />
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
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild={true}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 gap-1"
                                >
                                    <ListFilter className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                        Sort
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem checked={true}>
                                    Date
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>
                                    Title
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>
                                    Type
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
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
                    </div>
                </div>
                <TabsContent value="all" className="py-4 h-full">
                    {content.length > 0 ? (
                        <ContentGrid
                            items={content}
                            onDelete={(id) => {
                                aggregator.removeContentItem(
                                    sidepages[0]?.id,
                                    id,
                                );
                            }}
                        />
                    ) : (
                        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm w-full h-full">
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h3 className="text-2xl font-bold tracking-tight">
                                    It's empty here
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Press the "Add Content" button to get
                                    started
                                </p>
                            </div>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default DashboardMain;
