"use client";

import {
    aggregator,
    useSidepages,
} from "@/classes/aggregator/content-aggregator";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FC } from "react";

const DashboardMain: FC = () => {
    const sidepages = useSidepages(aggregator);
    const router = useRouter();

    return (
        <div className="p-4 flex flex-col gap-y-4 w-full h-full overflow-hidden">
            {sidepages.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {sidepages.map((sidepage) => (
                        <Link
                            key={sidepage.id}
                            href={`/sidepages/${sidepage.id}`}
                        >
                            <Card className="p-6 flex flex-col gap-4">
                                <CardHeader className="p-0">
                                    <CardTitle>{sidepage.title}</CardTitle>
                                </CardHeader>
                                <CardDescription className="p-0">
                                    {sidepage.description}
                                </CardDescription>
                                <CardFooter className="p-0">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                    >
                                        Edit
                                    </Button>
                                </CardFooter>
                            </Card>
                        </Link>
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
                                    sidepoints: [],
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

export default DashboardMain;
