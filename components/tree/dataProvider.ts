import { nanoid } from "nanoid";
import { StaticTreeDataProvider } from "react-complex-tree";
import type { Items } from "./Tree";

export const initializeDataProvider = (items: Items) => {
    return new StaticTreeDataProvider(items, (item, newName) => ({
        ...item,
        data: { ...item.data, title: newName },
    }));
};

export const addItem = (
    provider: StaticTreeDataProvider,
    items: Items,
    name: string,
) => {
    const newItem = {
        index: nanoid(),
        children: [],
        data: {
            title: name,
        },
    };

    items[newItem.index] = newItem;
    items.root.children.push(newItem.index);

    provider.onDidChangeTreeDataEmitter.emit(["root"]);

    return newItem.index;
};

export const removeItem = (
    provider: StaticTreeDataProvider,
    items: Items,
    itemIndex: string,
) => {
    const parentItems = Object.values(items).filter((i) =>
        i.children.includes(itemIndex),
    );

    for (const parentItem of parentItems) {
        parentItem.children = parentItem.children.filter(
            (i) => i !== itemIndex,
        );
    }

    provider.onDidChangeTreeDataEmitter.emit(parentItems.map((i) => i.index));

    return parentItems.map((i) => i.index);
};

export const editItem = (
    provider: StaticTreeDataProvider,
    items: Items,
    itemIndex: string,
    newData: object,
) => {
    items[itemIndex] = {
        ...items[itemIndex],
        data: { ...items[itemIndex].data, ...newData },
    };

    provider.onDidChangeTreeDataEmitter.emit([itemIndex]);
};
