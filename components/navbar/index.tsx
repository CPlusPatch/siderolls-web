import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Bookmark,
    Home,
    LineChart,
    Network,
    Package,
    Settings,
    Text,
    Users2,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { FC } from "react";

export const Aside: FC = () => {
    const params = useParams();

    return (
        <aside className="fixed inset-y-0 left-0 z-50 hidden w-14 -hover:w-56 duration-75 flex-col border-r bg-background sm:flex">
            <nav className="flex flex-col items-start gap-4 px-3 sm:py-5">
                <Link
                    href="#"
                    className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                >
                    <Text className="h-4 w-4 transition-all group-hover:scale-110" />
                    <span className="sr-only">Sidepages</span>
                </Link>
                <Tooltip>
                    <TooltipTrigger asChild={true}>
                        <Link
                            href="#"
                            className="flex h-9 w-9 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                        >
                            <Home className="h-5 w-5" />
                            <span className="sr-only">Dashboard</span>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">Dashboard</TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild={true}>
                        <Link
                            href="#"
                            className="flex h-9 w-9 items-center justify-center rounded bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                        >
                            <Network className="h-5 w-5" />
                            <span className="sr-only">Network</span>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">Network</TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild={true}>
                        <Link
                            href="#"
                            className="flex h-9 w-9 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                        >
                            <Package className="h-5 w-5" />
                            <span className="sr-only">Products</span>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">Products</TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild={true}>
                        <Link
                            href="#"
                            className="flex h-9 w-9 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                        >
                            <Users2 className="h-5 w-5" />
                            <span className="sr-only">Users</span>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">Users</TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild={true}>
                        <Link
                            href="#"
                            className="flex h-9 w-9 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                        >
                            <LineChart className="h-5 w-5" />
                            <span className="sr-only">Analytics</span>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">Analytics</TooltipContent>
                </Tooltip>
            </nav>
            <nav className="mt-auto flex flex-col items-start gap-4 px-3 sm:py-5">
                {params.id && (
                    <Tooltip>
                        <TooltipTrigger asChild={true}>
                            <Link
                                href="#"
                                className="flex h-9 w-9 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                                ref={(node) => {
                                    if (node) {
                                        node.setAttribute(
                                            "href",
                                            `javascript:window.open("${window.location.origin}/sidepages/${params.id}?create=" + encodeURIComponent(window.location.href), "_blank")`,
                                        );
                                    }
                                }}
                            >
                                <Bookmark className="h-5 w-5" />
                                <span className="sr-only">Add to Sidepage</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            Drag this link to your bookmarks bar
                        </TooltipContent>
                    </Tooltip>
                )}
                <Tooltip>
                    <TooltipTrigger asChild={true}>
                        <Link
                            href="#"
                            className="flex h-9 w-9 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                        >
                            <Settings className="h-5 w-5" />
                            <span className="sr-only">Settings</span>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">Settings</TooltipContent>
                </Tooltip>
            </nav>
        </aside>
    );
};
