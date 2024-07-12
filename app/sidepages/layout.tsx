"use client";

import {
    aggregator,
    useSidepages,
} from "@/classes/aggregator/content-aggregator";
import type { ContentItem } from "@/classes/sidepage/schema";
import { Aside } from "@/components/navbar";
import { ThemeToggle } from "@/components/theme-trigger";
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { FC, ReactNode } from "react";

const sampleContent: ContentItem[] = [
    {
        id: "UrNgNgSkfNhxQHmB76RRq",
        type: "link",
        title: "Garbage Trucks: The Ultimate Compilation",
        created_at: "2024-07-12T14:49:12.911Z",
        url: "https://www.youtube.com/watch?v=UluH0QmnwfM",
        description:
            "Long story short, here is one clip each of every single truck that I’ve filmed (during daylight hours) from August of 2015 through May of 2017, over 135 diff…",
        image: "https://img.youtube.com/vi/UluH0QmnwfM/maxresdefault.jpg",
    },
    {
        id: "r2__usI9RtcvVmhkWqVhI",
        type: "link",
        title: "Massachusetts child diagnosed with Cystic Fibrosis fulfills dream of becoming a garbage truck driver",
        created_at: "2024-07-12T14:49:40.836Z",
        url: "https://www.yahoo.com/news/massachusetts-child-diagnosed-cystic-fibrosis-210600933.html",
        description:
            "A Massachusetts 4-year-old, who was diagnosed with Cystic Fibrosis got to fulfill his dream of becoming a garbage truck driver for a day thanks to Make-A-Wish Massachusetts and Rhode Island.",
        image: "https://media.zenfs.com/en/wpri-providence/0d244531637232d70e6b89dc8c90dbc1",
    },
    {
        id: "yo1bqkoXYOGcJ-UZGAtKA",
        type: "link",
        title: "Mayor Adams Unveils New Anti-Trash Technology, Launches Next Phase Of City’s War On Trash",
        created_at: "2024-07-12T14:49:59.149Z",
        url: "https://www.nyc.gov/office-of-the-mayor/news/089-24/mayor-adams-new-anti-trash-technology-launches-next-phase-city-s-war-trash",
        description:
            "New York City Mayor Eric Adams and New York City Department of Sanitation (DSNY) Commissioner Jessica Tisch today made two major announcements…",
        image: "http://www.nyc.gov/assets/home/images/press_release/2024/02/pr089-24-hero.jpg",
    },
    {
        id: "opXndcSo2izj3zNpMA8Da",
        type: "link",
        title: "Amazon.com: Maxx Action 19’’ 3-N-1 Maxx Recycler – Large Garbage Truck Toy with Lights, Sounds and Motorized Drive | Realistic Trash Truck with Dual Joystick Controllers - Sunny Days Entertainment | Green : Toys & Games",
        created_at: "2024-07-12T14:55:22.943Z",
        url: "https://www.amazon.com/Sunny-Days-Entertainment-Action-Recycler/dp/B0CBCWTC6P/",
        description:
            "Amazon.com: Maxx Action 19’’ 3-N-1 Maxx Recycler – Large Garbage Truck Toy with Lights, Sounds and Motorized Drive | Realistic Trash Truck with Dual Joystick Controllers - Sunny Days Entertainment | Green : Toys & Games",
        image: "https://images-na.ssl-images-amazon.com/images/I/81uXMYM1EUL.jpg",
    },
    {
        id: "T1KtMKqdtInpN-Jtqh9p7",
        type: "link",
        title: "Garbage truck - Wikipedia",
        created_at: "2024-07-12T14:58:06.475Z",
        url: "https://en.wikipedia.org/wiki/Garbage_truck",
        description: "From Wikipedia, the free encyclopedia",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/LA-City-Sanitation-trash-truck-1.jpg/1200px-LA-City-Sanitation-trash-truck-1.jpg",
    },
    {
        id: "eXc92ZUe715lnMXXuBxWg",
        type: "link",
        title: "Dumpster Rentals for Less | Budget Dumpster",
        created_at: "2024-07-12T14:58:34.025Z",
        url: "https://www.budgetdumpster.com/",
        description:
            "Budget Dumpster specializes in local dumpster rentals for homeowners and contractors alike. Call us to rent a dumpster in your area.",
        image: "http://budgetdumpster.com/images/budget-dumpster-homepage-opengraph.jpg",
    },
];

const DashboardLayout: FC<{ children: ReactNode }> = ({ children }) => {
    const { sidepages } = useSidepages(aggregator);
    const params = useParams();

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <Aside />
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 grow">
                <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                    <Breadcrumb className="hidden md:flex">
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild={true}>
                                    <Link href="/">Dashboard</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild={true}>
                                    <Link href="/sidepages">Sidepages</Link>
                                </BreadcrumbLink>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="flex items-center gap-1">
                                        <BreadcrumbEllipsis className="h-4 w-4" />
                                        <span className="sr-only">
                                            Toggle menu
                                        </span>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start">
                                        {sidepages.map((sidepage) => (
                                            <DropdownMenuItem key={sidepage.id}>
                                                <Link
                                                    href={`/sidepages/${sidepage.id}`}
                                                >
                                                    {sidepage.title}
                                                </Link>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </BreadcrumbItem>
                            {params.id && (
                                <>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>
                                            {
                                                sidepages.find(
                                                    (sidepage) =>
                                                        sidepage.id ===
                                                        params.id,
                                                )?.title
                                            }
                                        </BreadcrumbPage>
                                    </BreadcrumbItem>
                                </>
                            )}
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="ml-auto md:grow-0 flex-1 flex-row flex gap-x-3 items-center">
                        <Button
                            size="sm"
                            onClick={async () => {
                                const { id } = await aggregator.createSidepage({
                                    title: "Garbage Trucks",
                                    description:
                                        "All the photos of garbage trucks",
                                    creator: "user",
                                    associated: [],
                                });

                                for (const content of sampleContent) {
                                    await aggregator.addContentToSidepage(
                                        id,
                                        content,
                                    );
                                }
                            }}
                        >
                            Add dummy data
                        </Button>
                        <div className="flex items-center space-x-2">
                            <ThemeToggle />
                        </div>
                        <div className="relative ml-auto flex-1">
                            <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search..."
                                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                            />
                        </div>
                    </div>
                </header>
                <main className="grid flex-1 items-start gap-4 p-2 sm:px-6 sm:py-0 md:gap-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
