import TreeComponent, { type Items } from "@/components/tree/Tree";
import {
    addItem,
    initializeDataProvider,
} from "@/components/tree/dataProvider";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { FC } from "react";

const TreeMain: FC = () => {
    const items: Items = {
        root: {
            index: "root",
            isFolder: true,
            children: ["child1", "child2"],
            data: { title: "Root item" },
        },
        child1: {
            index: "child1",
            children: [],
            data: { title: "Child item 1", url: "https://example.com" },
        },
        child2: {
            index: "child2",
            isFolder: true,
            children: ["child3"],
            data: { title: "Child item 2" },
        },
        child3: {
            index: "child3",
            children: [],
            data: { title: "Child item 3" },
        },
    };

    const dataProvider = initializeDataProvider(items);

    const handleAddItem = () => {
        const name = prompt("New item name");
        if (!name) {
            return;
        }

        addItem(dataProvider, items, name);
    };

    return (
        <div className="px-4 w-full h-full flex flex-col gap-4 overflow-hidden">
            <div className="flex flex-row gap-2">
                <Button onClick={handleAddItem} size={"icon"}>
                    <Plus className="size-4" />
                </Button>
            </div>
            <TreeComponent items={items} provider={dataProvider} />
        </div>
    );
};

export default TreeMain;
