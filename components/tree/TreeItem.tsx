"use client";

import { Button } from "@/components/ui/button";
import { ExternalLink, GripVertical, Image, Trash } from "lucide-react";
import { type FC, type ReactNode, memo, useEffect, useState } from "react";
import type {
    TreeInformation,
    TreeItemRenderContext,
} from "react-complex-tree";
import { Card, CardTitle } from "../ui/card.tsx";
import type { CustomTreeDataProvider } from "./DataProvider.tsx";
import Sidebar from "./Sidebar.tsx";
import type { Item } from "./Tree.tsx";

const byteValueNumberFormatter = Intl.NumberFormat("en", {
    notation: "compact",
    style: "unit",
    unit: "byte",
    unitDisplay: "narrow",
});

type NonUndefined<T> = T extends undefined ? never : T;

const TreeItemContainer: FC<{
    context: TreeItemRenderContext<string>;
    children: ReactNode;
    depth: number;
}> = memo(({ context, children, depth }) => (
    <li
        {...context.itemContainerWithChildrenProps}
        style={{ marginLeft: `${depth === 0 ? 0 : 2.75}rem` }}
        className="flex flex-col gap-2"
    >
        {children}
    </li>
));

const TreeItemContent: FC<{
    arrow: ReactNode;
    context: TreeItemRenderContext<string>;
    title: ReactNode;
    item: Item;
    provider: CustomTreeDataProvider<Item["data"]>;
    isCtrlPressed: boolean;
}> = memo(({ arrow, context, title, item, provider, isCtrlPressed }) => (
    <div className="flex flex-row items-center gap-1">
        {arrow}
        <div
            className="w-full justify-start text-left text-primary underline-offset-4 inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground leading-6 overflow-hidden h-10"
            {...context.itemContainerWithoutChildrenProps}
        >
            <span className="overflow-hidden text-ellipsis w-full">
                {title}
            </span>
            {item.data.url && (
                <Button
                    size="icon"
                    variant="ghost"
                    className="shrink-0"
                    title="This item has a link"
                >
                    <ExternalLink className="size-4" aria-hidden={true} />
                </Button>
            )}
            {item.data.image && (
                <Button
                    size="icon"
                    variant="ghost"
                    className="shrink-0"
                    title="This item has an image"
                >
                    <Image className="size-4" aria-hidden={true} />
                </Button>
            )}
        </div>
        <Sidebar item={item} provider={provider} />
        {isCtrlPressed && (
            <Button
                size="icon"
                variant="destructive"
                onClick={() => {
                    provider.removeItem(String(item.index));
                }}
                className="shrink-0"
                title="Delete item"
            >
                <Trash className="size-4" aria-hidden={true} />
            </Button>
        )}
        <Button
            {...context.interactiveElementProps}
            size="icon"
            variant="ghost"
            className="shrink-0 cursor-grab"
            type="button"
        >
            <GripVertical className="size-4" aria-hidden={true} />
            <span className="sr-only">Drag handle</span>
        </Button>
    </div>
));

const TreeItemImageCard: FC<{
    image: NonUndefined<Item["data"]["image"]>;
}> = memo(({ image }) => (
    <Card className="flex justify-between items-stretch p-4 overflow-hidden gap-4">
        <div className="grow flex flex-col justify-center items-start py-4 gap-2">
            <CardTitle className="text-lg font-semibold line-clamp-1 overflow-ellipsis">
                {image.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
                {byteValueNumberFormatter.format(image.size ?? 0)}
            </p>
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                {image.type}
            </code>
        </div>
        <div className="shrink-0 w-1/3 max-w-36 flex items-center justify-center">
            <img
                src={image.src}
                alt={image.alt}
                className="max-w-full w-full h-auto object-cover rounded"
            />
        </div>
    </Card>
));

const TreeItem: FC<{
    provider: CustomTreeDataProvider<Item["data"]>;
    item: Item;
    depth: number;
    children: ReactNode | null;
    title: ReactNode;
    arrow: ReactNode;
    context: TreeItemRenderContext<string>;
    info: TreeInformation;
}> = ({ provider, title, arrow, context, children, item, depth }) => {
    const [isCtrlPressed, setIsCtrlPressed] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey) {
                setIsCtrlPressed(true);
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            if (!event.ctrlKey) {
                setIsCtrlPressed(false);
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
        <TreeItemContainer context={context} depth={depth}>
            <TreeItemContent
                arrow={arrow}
                context={context}
                title={title}
                item={item}
                provider={provider}
                isCtrlPressed={isCtrlPressed}
            />
            {item.data.image && <TreeItemImageCard image={item.data.image} />}
            {children}
        </TreeItemContainer>
    );
};

export default TreeItem;
