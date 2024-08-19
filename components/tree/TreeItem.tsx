import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import type { FC, ReactNode } from "react";
import type {
    TreeItem as LibTreeItem,
    StaticTreeDataProvider,
    TreeInformation,
    TreeItemRenderContext,
} from "react-complex-tree";
import Sidebar from "./Sidebar";
import type { Item, Items } from "./Tree";
import { removeItem } from "./dataProvider";

const TreeItem: FC<{
    provider: StaticTreeDataProvider;
    items: Items;
    item: LibTreeItem<Item["data"]>;
    depth: number;
    children: ReactNode | null;
    title: ReactNode;
    arrow: ReactNode;
    context: TreeItemRenderContext<string>;
    info: TreeInformation;
}> = ({ provider, title, items, arrow, depth, context, children, item }) => {
    return (
        <li
            {...context.itemContainerWithChildrenProps}
            style={{ marginLeft: `${depth * 1}rem` }}
            className="flex flex-col gap-2"
        >
            <div className="flex flex-row items-center">
                <div
                    className="w-full justify-start text-left text-primary underline-offset-4 hover:underline inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                    {...context.itemContainerWithoutChildrenProps}
                >
                    {arrow}
                    {title}
                </div>
                <Sidebar item={item} items={items} provider={provider} />
                <Button
                    size="icon"
                    variant="link"
                    onClick={() => {
                        const parentIndexes = removeItem(
                            provider,
                            items,
                            String(item.index),
                        );
                        provider.onDidChangeTreeDataEmitter.emit(parentIndexes);
                    }}
                >
                    <Trash className="size-4" />
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
