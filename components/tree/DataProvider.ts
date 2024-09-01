import { nanoid } from "nanoid";
import type {
    Disposable,
    ExplicitDataSource,
    TreeDataProvider,
    TreeItem,
    TreeItemIndex,
} from "react-complex-tree";
import { EventEmitter } from "./EventEmitter";
import type { Item, Items } from "./Tree";

export const initializeDataProvider = (
    items: Items,
    hooks: CustomTreeDataProvider["hooks"],
) => {
    return new CustomTreeDataProvider(
        items,
        (item, newName) => ({
            ...item,
            data: { ...item.data, title: newName },
        }),
        hooks,
    );
};

export class CustomTreeDataProvider<T = unknown> implements TreeDataProvider {
    public data: ExplicitDataSource;

    /** Emit an event with the changed item ids to notify the tree view about changes. */
    public readonly onDidChangeTreeDataEmitter = new EventEmitter<
        TreeItemIndex[]
    >();

    private setItemName?: (item: TreeItem<T>, newName: string) => TreeItem<T>;

    constructor(
        items: Record<TreeItemIndex, TreeItem<T>>,
        setItemName?: (item: TreeItem<T>, newName: string) => TreeItem<T>,
        public hooks?: {
            onEditItem?: () => void;
        },
    ) {
        this.data = { items };
        this.setItemName = setItemName;
    }

    public getTreeItem(itemId: TreeItemIndex): Promise<TreeItem> {
        return Promise.resolve(this.data.items[itemId]);
    }

    public onChangeItemChildren(
        itemId: TreeItemIndex,
        newChildren: TreeItemIndex[],
    ): Promise<void> {
        const item = this.data.items[itemId];
        item.children = newChildren;

        // Turn the item into a folder if it has children
        if (newChildren.length > 0) {
            item.isFolder = true;
        } else {
            item.isFolder = false;
        }

        this.data.items[itemId] = item;

        this.onDidChangeTreeDataEmitter.emit([itemId]);

        this.hooks?.onEditItem?.();

        return Promise.resolve();
    }

    public onDidChangeTreeData(
        listener: (changedItemIds: TreeItemIndex[]) => void,
    ): Disposable {
        const handlerId = this.onDidChangeTreeDataEmitter.on((payload) =>
            listener(payload),
        );
        return {
            dispose: () => this.onDidChangeTreeDataEmitter.off(handlerId),
        };
    }

    public onRenameItem(item: TreeItem<T>, name: string): Promise<void> {
        if (this.setItemName) {
            this.data.items[item.index] = this.setItemName(item, name);
            this.onDidChangeTreeDataEmitter.emit([item.index]);
        }

        this.hooks?.onEditItem?.();

        return Promise.resolve();
    }

    public addItem(
        parentItemId: TreeItemIndex,
        name: string,
    ): Promise<TreeItemIndex> {
        const newItem: TreeItem = {
            index: nanoid(),
            children: [],
            data: {
                title: name,
            },
        };

        this.data.items[newItem.index] = newItem;
        this.data.items[parentItemId].children?.push(newItem.index);

        this.onDidChangeTreeDataEmitter.emit([parentItemId]);

        this.hooks?.onEditItem?.();

        return Promise.resolve(newItem.index);
    }

    public async removeItem(itemId: TreeItemIndex): Promise<void> {
        const parentItemId = Object.keys(this.data.items).find((key) =>
            this.data.items[key].children?.includes(itemId),
        );

        if (parentItemId) {
            this.data.items[parentItemId].children = this.data.items[
                parentItemId
            ].children?.filter((id) => id !== itemId);
        }

        delete this.data.items[itemId];

        if (parentItemId) {
            this.onDidChangeTreeDataEmitter.emit([parentItemId]);
        }

        this.hooks?.onEditItem?.();
    }

    public async moveItem(
        itemId: TreeItemIndex,
        newParentItemId: TreeItemIndex,
    ): Promise<void> {
        const oldParentItemId = Object.keys(this.data.items).find((key) =>
            this.data.items[key].children?.includes(itemId),
        );

        if (oldParentItemId) {
            this.data.items[oldParentItemId].children = this.data.items[
                oldParentItemId
            ].children?.filter((id) => id !== itemId);
        }

        this.data.items[newParentItemId].children?.push(itemId);

        if (oldParentItemId) {
            this.onDidChangeTreeDataEmitter.emit([
                oldParentItemId,
                newParentItemId,
            ]);
        } else {
            this.onDidChangeTreeDataEmitter.emit([newParentItemId]);
        }

        this.hooks?.onEditItem?.();
    }

    public editItem(
        itemId: TreeItemIndex,
        data: Partial<Item["data"]>,
    ): Promise<void> {
        this.data.items[itemId].data = {
            ...this.data.items[itemId].data,
            ...data,
        };
        this.onDidChangeTreeDataEmitter.emit([itemId]);

        this.hooks?.onEditItem?.();

        return Promise.resolve();
    }
}
