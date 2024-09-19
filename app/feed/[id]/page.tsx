"use client";
import { initializeDataProvider } from "@/components/tree/DataProvider";
import TreeComponent, { type Items } from "@/components/tree/Tree";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type DataRow, useClient } from "@/lib/api";
import type { Output } from "@/lib/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { type FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
    title: z.string().min(1, {
        message: "Title must be at least 1 character.",
    }),
});

const UseItemForm: FC<{
    onSubmit: (data: z.infer<typeof FormSchema>) => void;
}> = ({ onSubmit }) => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: "",
        },
    });

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-12"
            >
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Current Goals" {...field} />
                            </FormControl>
                            <FormDescription>
                                This will appear as the title of the new tree.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">
                    Submit
                </Button>
            </form>
        </Form>
    );
};

const FeedMain: FC<{
    params: {
        id: string;
    };
}> = ({ params }) => {
    const client = useClient();
    const [output, setOutput] = useState<Output<DataRow> | undefined>(
        undefined,
    );

    useEffect(() => {
        const fetchRow = async () => {
            const response = await client?.getRow(params.id);
            setOutput(response);

            const data = response?.data.data as Record<string, Items> | null;

            if (data === undefined) {
                return;
            }

            setDataProviders(
                Object.values(
                    data === null
                        ? {
                              Main: items,
                          }
                        : data,
                ).map((items) => initializeDataProvider(items, { onEditItem })),
            );
        };

        fetchRow();
    }, [client, params.id]);

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
                    name: "Breaking-News2.jpg",
                    size: 2050110,
                    type: "image/jpeg",
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
                    size: 186362,
                    type: "image/jpeg",
                    name: "maxresdefault.jpg",
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
                    size: 80684,
                    name: "tourist-vlogging.jpg",
                    type: "image/jpeg",
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

    const onEditItem = () => {
        setDataProviders((prevDataProviders) => {
            client?.editRow(params.id, {
                data: Object.fromEntries(
                    prevDataProviders.map((provider) => [
                        provider.data.items.root.data.title,
                        provider.data.items,
                    ]),
                ),
            });
            return prevDataProviders;
        });
    };

    const [dataProviders, setDataProviders] = useState<
        ReturnType<typeof initializeDataProvider>[]
    >([]);

    const [currentProviderIndex, setCurrentProviderIndex] = useState(0);

    const handleAddItem = () => {
        const name = prompt("New item name");
        if (!name) {
            return;
        }

        setDataProviders((prevDataProviders) => {
            if (prevDataProviders[currentProviderIndex]) {
                prevDataProviders[currentProviderIndex].addItem("root", name);
            } else {
                console.error("No data provider found");
            }
            return prevDataProviders;
        });
    };

    return (
        <div className="max-w-6xl mx-auto w-full h-full p-4">
            {dataProviders[0] && (
                <Tabs
                    onValueChange={(value) => {
                        setCurrentProviderIndex(
                            dataProviders.findIndex(
                                (provider) =>
                                    provider.data.items.root.data.title ===
                                    value,
                            ),
                        );
                    }}
                    defaultValue={dataProviders[0].data.items.root.data.title}
                    className="flex flex-col gap-4 grow h-full"
                >
                    <div className="flex items-center">
                        <TabsList>
                            {dataProviders.map((provider) => (
                                <TabsTrigger
                                    key={provider.data.items.root.data.title}
                                    value={provider.data.items.root.data.title}
                                >
                                    {provider.data.items.root.data.title}
                                </TabsTrigger>
                            ))}
                            <TabsTrigger value="more-info">
                                More Info
                            </TabsTrigger>
                            <TabsTrigger value="create-new">
                                <Plus className="size-5" />
                            </TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent
                        value={dataProviders[0].data.items.root.data.title}
                        className="h-full"
                    >
                        <div className="mx-auto p-4 flex flex-col lg:flex-row gap-10 lg:divide-x-2">
                            <div className="flex items-center justify-center min-h-48 overflow-hidden w-full bg-muted rounded-lg">
                                <img
                                    src={output?.data.image}
                                    alt=""
                                    className="w-full h-full object-fill"
                                />
                            </div>
                            <div className="flex flex-col gap-10 lg:w-2/3 lg:pl-16 overflow-hidden">
                                <div className="flex flex-row gap-2 justify-between items-center">
                                    <div className="flex flex-col gap-1 items-start">
                                        <h1 className="text-xl font-semibold tracking-tight">
                                            {output?.data.title}
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
                                        <span className="sr-only">
                                            Add item
                                        </span>
                                    </Button>
                                </div>
                                <TreeComponent provider={dataProviders[0]} />
                            </div>
                        </div>
                    </TabsContent>
                    {dataProviders.slice(1).map((provider) => (
                        <TabsContent
                            value={provider.data.items.root.data.title}
                            className="h-full"
                            key={provider.data.items.root.data.title}
                        >
                            <div className="max-w-2xl mx-auto p-4 flex flex-col gap-10">
                                <div className="flex flex-row gap-2 justify-between items-center">
                                    <div className="flex flex-col gap-1 items-start">
                                        {/* <h1 className="text-xl font-semibold tracking-tight">
                                {output?.data.title}
                            </h1> */}
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
                                        <span className="sr-only">
                                            Add item
                                        </span>
                                    </Button>
                                </div>
                                <TreeComponent provider={provider} />
                            </div>
                        </TabsContent>
                    ))}
                    <TabsContent value="more-info" className="py-4 h-full">
                        <div className="text-pretty mt-5 mx-auto prose dark:prose-invert">
                            {(output?.data.tags.length ?? 0) > 0 && (
                                <div className="space-x-2 mb-4">
                                    {output?.data.tags.map((tag) => (
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
                            <h1>{output?.data.title}</h1>
                            <div
                                /* biome-ignore lint/security/noDangerouslySetInnerHtml: No */
                                dangerouslySetInnerHTML={{
                                    /* biome-ignore lint/style/useNamingConvention: No */
                                    __html: output?.data.content ?? "",
                                }}
                            />
                        </div>
                    </TabsContent>
                    <TabsContent value="create-new" className="h-full">
                        {/* Text field to ask for name of new category */}
                        <Card className="max-w-lg w-full mx-auto my-10">
                            <CardHeader>
                                <CardTitle>Create new tree</CardTitle>
                                <CardDescription>
                                    Just give it a name and you're good to go!
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <UseItemForm
                                    onSubmit={({ title }) => {
                                        setDataProviders([
                                            ...dataProviders,
                                            initializeDataProvider(
                                                {
                                                    root: {
                                                        index: "root",
                                                        isFolder: true,
                                                        children: [],
                                                        data: {
                                                            title,
                                                        },
                                                    },
                                                },
                                                {
                                                    onEditItem,
                                                },
                                            ),
                                        ]);
                                    }}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            )}
        </div>
    );
};

export default FeedMain;
