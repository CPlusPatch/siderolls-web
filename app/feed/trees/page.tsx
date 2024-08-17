"use client";
import { Button } from "@/components/ui/button";
import { ChevronRight, Plus, Trash } from "lucide-react";
import type { FC } from "react";
import {
    StaticTreeDataProvider,
    Tree,
    UncontrolledTreeEnvironment,
} from "react-complex-tree";
import "react-complex-tree/lib/style-modern.css";
import { nanoid } from "nanoid";

const TreeMain: FC = () => {
    const items: {
        [key: string]: {
            index: string;
            isFolder?: boolean;
            children: string[];
            data: string;
        };
    } = {
        root: {
            index: "root",
            isFolder: true,
            children: ["child1", "child2"],
            data: "Root item",
        },
        child1: {
            index: "child1",
            children: [],
            data: "Child item 1",
        },
        child2: {
            index: "child2",
            isFolder: true,
            children: ["child3"],
            data: "Child item 2",
        },
        child3: {
            index: "child3",
            children: [],
            data: "Child item 3",
        },
    };

    const dataProvider = new StaticTreeDataProvider(items, (item, newName) => ({
        ...item,
        data: newName,
    }));

    return (
        <div className="p-4 w-full h-full flex flex-col gap-4 overflow-hidden">
            <Button
                className="w-full"
                onClick={() => {
                    const name = prompt("New item name");
                    if (!name) {
                        return;
                    }

                    const newItem = {
                        index: nanoid(),
                        children: [],
                        data: name,
                    };

                    items[newItem.index] = newItem;
                    items.root.children.push(newItem.index);

                    dataProvider.onDidChangeTreeDataEmitter.emit(["root"]);
                }}
            >
                <Plus className="size-4 mr-2" />
                Add
            </Button>
            <UncontrolledTreeEnvironment
                dataProvider={dataProvider}
                getItemTitle={(item) => item.data}
                viewState={{}}
                canDragAndDrop={true}
                canReorderItems={true}
                canDropOnFolder={true}
                canDropOnNonFolder={true}
            >
                <Tree
                    treeId="tree-1"
                    rootItem="root"
                    treeLabel="Tree Example"
                    renderTreeContainer={({ children, containerProps }) => (
                        <div
                            className="max-w-2xl mx-auto w-full"
                            {...containerProps}
                        >
                            {children}
                        </div>
                    )}
                    renderItemsContainer={({ children, containerProps }) => (
                        <ul
                            className="flex flex-col gap-2 w-full"
                            {...containerProps}
                        >
                            {children}
                        </ul>
                    )}
                    renderItemTitle={({ title }) => (
                        <span className="w-full h-10 px-4 py-2">{title}</span>
                    )}
                    renderItemArrow={({ item, context }) =>
                        item.isFolder ? (
                            <Button
                                size="icon"
                                variant="ghost"
                                className="!size-10"
                            >
                                <ChevronRight
                                    className={`size-4 duration-100 ${
                                        context.isExpanded ? "rotate-90" : ""
                                    }`}
                                    {...context.arrowProps}
                                />
                            </Button>
                        ) : (
                            <div className="size-10" />
                        )
                    }
                    renderItem={({
                        title,
                        arrow,
                        depth,
                        context,
                        children,
                        item,
                    }) => {
                        return (
                            <li
                                {...context.itemContainerWithChildrenProps}
                                style={{
                                    marginLeft: `${depth * 1}rem`,
                                }}
                                className="flex flex-col gap-2"
                            >
                                <div className="flex flex-row items-center">
                                    <div
                                        className="w-full justify-start text-left text-primary underline-offset-4 hover:underline inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                                        {...context.itemContainerWithoutChildrenProps}
                                        {...context.interactiveElementProps}
                                    >
                                        {arrow}
                                        {title}
                                    </div>
                                    <Button
                                        size="icon"
                                        variant="link"
                                        onClick={() => {
                                            // Get all items that have this item as a child
                                            const parentItems = Object.values(
                                                items,
                                            ).filter((i) =>
                                                i.children.includes(
                                                    String(item.index),
                                                ),
                                            );

                                            // Remove the item from the parent's children
                                            for (const parentItem of parentItems) {
                                                parentItem.children =
                                                    parentItem.children.filter(
                                                        (i) =>
                                                            i !==
                                                            String(item.index),
                                                    );
                                            }

                                            dataProvider.onDidChangeTreeDataEmitter.emit(
                                                parentItems.flatMap(
                                                    (i) => i.index,
                                                ),
                                            );
                                        }}
                                    >
                                        <Trash className="size-4" />
                                    </Button>
                                </div>
                                {children}
                            </li>
                        );
                    }}
                />
            </UncontrolledTreeEnvironment>
        </div>
    );
};

export default TreeMain;
