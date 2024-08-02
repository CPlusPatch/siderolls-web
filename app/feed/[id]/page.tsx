"use client";
import { Badge } from "@/components/ui/badge";
import { useApi } from "@/lib/api";
import type { FC } from "react";

const FeedMain: FC<{
    params: {
        id: string;
    };
}> = ({ params }) => {
    const api = useApi();
    const { data } = api.useGetRowById(params.id);

    return (
        <div className="p-4 gap-8 grid grid-cols-1 lg:grid-cols-[auto_1fr] w-full overflow-hidden max-w-5xl mx-auto">
            {data && (
                <>
                    <div className="overflow-hidden ring-1 ring-ring/10 rounded lg:max-w-xl w-full flex items-center justify-center">
                        <img
                            src={data.banner_image}
                            alt="Banner"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div className="h-full overflow-auto py-4">
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
                        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                            {data.title}
                        </h1>
                        {data.content.split("\n").map((paragraph) => (
                            <p
                                key={paragraph}
                                className="leading-7 [&:not(:first-child)]:mt-6"
                            >
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default FeedMain;
