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
            children: ["homepage", "news", "blogs", "videos", "podcasts"],
            data: { title: "Content Aggregation" },
        },
        homepage: {
            index: "homepage",
            children: [],
            data: { title: "Homepage", url: "https://example.com" },
        },
        news: {
            index: "news",
            isFolder: true,
            children: ["news1", "news2"],
            data: { title: "News" },
        },
        news1: {
            index: "news1",
            children: [],
            data: {
                title: "Breaking News",
                url: "https://news.example.com/breaking",
                image: {
                    src: "https://blog.piercecountywa.gov/executive/files/2020/05/Breaking-News2.jpg.jpeg",
                },
            },
        },
        news2: {
            index: "news2",
            children: [],
            data: {
                title: "World News",
                url: "https://news.example.com/world",
            },
        },
        blogs: {
            index: "blogs",
            isFolder: true,
            children: ["blog1", "blog2"],
            data: { title: "Blogs" },
        },
        blog1: {
            index: "blog1",
            children: [],
            data: { title: "Tech Blog", url: "https://blog.example.com/tech" },
        },
        blog2: {
            index: "blog2",
            children: [],
            data: {
                title: "Lifestyle Blog",
                url: "https://blog.example.com/lifestyle",
            },
        },
        videos: {
            index: "videos",
            isFolder: true,
            children: ["video1", "video2"],
            data: { title: "Videos" },
        },
        video1: {
            index: "video1",
            children: [],
            data: {
                title: "iOS 18 Hands-On: Top 5 Features!",
                url: "https://www.youtube.com/watch?v=ArcI4A5nvBo",
                image: {
                    src: "https://i3.ytimg.com/vi/ArcI4A5nvBo/maxresdefault.jpg",
                    alt: "Tech Review Thumbnail",
                },
            },
        },
        video2: {
            index: "video2",
            children: [],
            data: {
                title: "Travel Vlog",
                url: "https://videos.example.com/travel-vlog",
                image: {
                    src: "https://blog.assets.thediscoverer.com/2019/09/tourist-vlogging.jpg",
                    alt: "Travel Vlog Thumbnail",
                },
            },
        },
        podcasts: {
            index: "podcasts",
            isFolder: true,
            children: ["podcast1", "podcast2"],
            data: { title: "Podcasts" },
        },
        podcast1: {
            index: "podcast1",
            children: [],
            data: {
                title: "Tech Podcast",
                url: "https://podcasts.example.com/tech",
            },
        },
        podcast2: {
            index: "podcast2",
            children: [],
            data: {
                title: "Health Podcast",
                url: "https://podcasts.example.com/health",
            },
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
                    <div className="max-w-2xl mx-auto p-4 flex flex-col gap-10">
                        <div className="flex items-center justify-center min-h-48 max-h-72 overflow-hidden w-full bg-muted rounded-lg">
                            <img
                                src={data.image}
                                alt=""
                                className="w-full h-full object-fill"
                            />
                        </div>
                        <div className="flex flex-row gap-2 justify-between items-center">
                            <div className="flex flex-col gap-1 items-start">
                                <h1 className="text-xl font-semibold tracking-tight">
                                    {data.title}
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Hold <kbd>Ctrl</kbd> to delete items
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
