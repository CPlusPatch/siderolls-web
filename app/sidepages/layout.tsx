"use client";

import {
    aggregator,
    useSidepages,
} from "@/classes/aggregator/content-aggregator";
import { Aside } from "@/components/navbar";
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Search } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { type FC, type ReactNode, useEffect, useState } from "react";

const useDarkMode = () => {
    const [darkMode, setDarkMode] = useState(true);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);

    return [darkMode, setDarkMode] as const;
};

const DashboardLayout: FC<{ children: ReactNode }> = ({ children }) => {
    const [darkMode, setDarkMode] = useDarkMode();
    const sidepages = useSidepages(aggregator);
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
                    <div className="ml-auto md:grow-0 flex-1 flex-row flex gap-x-3">
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="dark-mode"
                                defaultChecked={darkMode}
                                onCheckedChange={() =>
                                    setDarkMode((prev) => !prev)
                                }
                            />
                            <Label htmlFor="dark-mode" className="sr-only">
                                Toggle dark mode
                            </Label>
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
