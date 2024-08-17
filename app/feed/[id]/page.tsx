"use client";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApi } from "@/lib/api";
import type { FC } from "react";
import TreeMain from "../trees/page";

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

    return (
        <div className="max-w-5xl mx-auto w-full p-4">
            <Tabs defaultValue="source" className="flex flex-col grow">
                <div className="flex items-center">
                    <TabsList>
                        <TabsTrigger value="source">Source</TabsTrigger>
                        <TabsTrigger value="more-info">More Info</TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value="source" className="py-4 h-full">
                    <div className="gap-8 grid grid-cols-1 lg:grid-cols-2 w-full">
                        <div className="h-full overflow-auto py-4 ring-1 w-full ring-ring/10 rounded bg-card">
                            <TreeMain />
                        </div>
                        <div className="overflow-hidden ring-1 ring-ring/10 rounded lg:max-w-xl w-full flex items-center justify-center">
                            <img
                                src={data.banner_image}
                                alt="Banner"
                                className="w-full h-full object-contain"
                            />
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
