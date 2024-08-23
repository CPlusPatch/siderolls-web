"use client";

import { Button } from "@/components/ui/button";
import { GripVertical, Trash } from "lucide-react";
import { type FC, type ReactNode, useEffect, useState } from "react";
import type {
    TreeInformation,
    TreeItemRenderContext,
} from "react-complex-tree";
import type { CustomTreeDataProvider } from "./DataProvider";
import Sidebar from "./Sidebar";
import type { Item } from "./Tree";

const TreeItem: FC<{
    provider: CustomTreeDataProvider<Item["data"]>;
    item: Item;
    depth: number;
    children: ReactNode | null;
    title: ReactNode;
    arrow: ReactNode;
    context: TreeItemRenderContext<string>;
    info: TreeInformation;
}> = ({ provider, title, arrow, depth, context, children, item }) => {
    const [isShiftPressed, setIsShiftPressed] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Shift") {
                setIsShiftPressed(true);
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.key === "Shift") {
                setIsShiftPressed(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    return (
        <li
            {...context.itemContainerWithChildrenProps}
            style={{ marginLeft: `${depth * 1}rem` }}
            className="flex flex-col gap-2"
        >
            <div className="flex flex-row items-center gap-1">
                {arrow}
                <div
                    className="w-full justify-start text-left text-primary underline-offset-4 inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground leading-6"
                    {...context.itemContainerWithoutChildrenProps}
                >
                    {title}
                </div>
                <Sidebar item={item} provider={provider} />
                {isShiftPressed && (
                    <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => {
                            provider.removeItem(String(item.index));
                        }}
                        className="shrink-0"
                    >
                        <Trash className="size-4" />
                    </Button>
                )}
                <Button
                    {...context.interactiveElementProps}
                    size="icon"
                    variant="ghost"
                    className="shrink-0 cursor-grab"
                    type="button"
                >
                    <GripVertical className="size-4" />
                </Button>
            </div>
            {item.data.image && (
                <div className="flex justify items-center rounded overflow-hidden border ml-12">
                    <img
                        src={item.data.image.src}
                        alt={item.data.image.alt}
                        className="max-w-full w-full h-full object-cover"
                    />
                </div>
            )}
            {children}
        </li>
    );
};

export default TreeItem;
