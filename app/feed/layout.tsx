"use client";
import { ThemeToggle } from "@/components/theme-trigger";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";
import { type FC, type ReactNode, useEffect } from "react";

const DashboardLayout: FC<{ children: ReactNode }> = ({ children }) => {
    // If ctrl + shift + a is pressed, ask for the token
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "a" && event.ctrlKey && event.altKey) {
                event.preventDefault();
                localStorage.setItem("token", prompt("Enter your token") ?? "");
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            {/* <Aside /> */}
            <div className="flex flex-col sm:gap-4 sm:py-4 grow">
                <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                    <Breadcrumb className="hidden md:flex">
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild={true}>
                                    <Link href="/">Home</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild={true}>
                                    <Link href="/feed">Feed</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="ml-auto md:grow-0 flex-1 flex-row flex gap-x-3 items-center">
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
