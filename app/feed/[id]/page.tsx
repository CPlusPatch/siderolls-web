"use client";
import TreeComponent, { type Items } from "@/components/tree/Tree";
import {
    addItem,
    initializeDataProvider,
} from "@/components/tree/dataProvider";
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

        addItem(dataProvider, items, name);
    };

    return (
        <div className="max-w-5xl mx-auto w-full h-full p-4">
            <Tabs defaultValue="source" className="flex flex-col grow h-full">
                <div className="flex items-center">
                    <TabsList>
                        <TabsTrigger value="source">Source</TabsTrigger>
                        <TabsTrigger value="more-info">More Info</TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value="source" className="py-4 h-full">
                    <div className="gap-8 grid grid-cols-1 lg:grid-cols-2 w-full h-full">
                        <div className="h-fit overflow-auto p-4 ring-1 w-full ring-ring/10 rounded bg-card flex flex-col gap-4">
                            <div className="flex flex-row gap-2">
                                <Button onClick={handleAddItem} size={"icon"}>
                                    <Plus className="size-4" />
                                </Button>
                            </div>
                            <TreeComponent
                                items={items}
                                provider={dataProvider}
                            />
                        </div>
                        <div className="lg:max-w-xl w-full flex items-start justify-center h-fit">
                            <div className="ring-1 ring-ring/10 flex items-center justify-center rounded overflow-hidden">
                                <img
                                    src={data.banner_image}
                                    alt="Banner"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>
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
