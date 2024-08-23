"use client";
import { initializeDataProvider } from "@/components/tree/DataProvider";
import TreeComponent, { type Items } from "@/components/tree/Tree";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApi } from "@/lib/api";
import { Plus } from "lucide-react";
import type { FC } from "react";

const FeedMain: FC<{
    params: {
        id: string;
    };
}> = ({ params }) => {
    const api = useApi();
    const { data } = api.useGetRowById(params.id);

    if (!data) {
        return null;
    }

    const items: Items = {
        root: {
            index: "root",
            isFolder: true,
            children: ["child1", "child2"],
            data: { title: "Root item" },
        },
        child1: {
            index: "child1",
            children: [],
            data: { title: "Child item 1", url: "https://example.com" },
        },
        child2: {
            index: "child2",
            isFolder: true,
            children: ["child3"],
            data: { title: "Child item 2" },
        },
        child3: {
            index: "child3",
            children: [],
            data: { title: "Child item 3" },
        },
    };

    const dataProvider = initializeDataProvider(items);

    const handleAddItem = () => {
        const name = prompt("New item name");
        if (!name) {
            return;
        }

        dataProvider.addItem("root", name);
    };

    return (
        <div className="max-w-3xl mx-auto w-full h-full p-4">
            <Tabs
                defaultValue="source"
                className="flex flex-col gap-4 grow h-full"
            >
                <div className="flex items-center">
                    <TabsList>
                        <TabsTrigger value="source">Source</TabsTrigger>
                        <TabsTrigger value="more-info">More Info</TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value="source" className="h-full">
                    <div className="max-w-2xl mx-auto p-4 flex flex-col gap-6">
                        <div className="flex flex-row gap-2 justify-between items-center">
                            <div className="flex flex-col gap-1 items-start">
                                <h1 className="text-xl font-semibold tracking-tight">
                                    {data.title}
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Hold <kbd>Shift</kbd> to delete items
                                </p>
                            </div>
                            <Button
                                onClick={handleAddItem}
                                size="icon"
                                variant="secondary"
                                className="ml-auto"
                            >
                                <Plus className="size-5" />
                                <span className="sr-only">Add item</span>
                            </Button>
                        </div>
                        <TreeComponent provider={dataProvider} />
                    </div>
                </TabsContent>
                <TabsContent value="more-info" className="py-4 h-full">
                    <div className="text-pretty mt-5 mx-auto prose dark:prose-invert">
                        {data.tags.length > 0 && (
                            <div className="space-x-2 mb-4">
                                {data.tags.map((tag) => (
                                    <Badge
                                        key={tag}
                                        variant="secondary"
                                        className="capitalize"
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        )}
                        <h1>{data.title}</h1>
                        <div
                            /* biome-ignore lint/style/useNamingConvention: No */
                            /* biome-ignore lint/security/noDangerouslySetInnerHtml: No */
                            dangerouslySetInnerHTML={{ __html: data.content }}
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default FeedMain;
