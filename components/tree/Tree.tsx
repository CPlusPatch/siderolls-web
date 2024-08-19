import { ChevronRight } from "lucide-react";
import type { FC } from "react";
import {
    type StaticTreeDataProvider,
    Tree,
    UncontrolledTreeEnvironment,
} from "react-complex-tree";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import TreeItem from "./TreeItem";

export interface Item {
    index: string;
    isFolder?: boolean;
    children: string[];
    data: {
        title: string;
        url?: string;
        image?: {
            src: string;
            alt?: string;
        };
    };
}

export interface Items {
    [key: string]: Item;
}

const TreeComponent: FC<{ items: Items; provider: StaticTreeDataProvider }> = ({
    items,
    provider,
}) => {
    return (
        <UncontrolledTreeEnvironment
            dataProvider={provider}
            getItemTitle={(item) => item.data.title}
            viewState={{}}
            canDragAndDrop={true}
            canReorderItems={true}
            canDropOnFolder={true}
            canDropOnNonFolder={true}
        >
            <Tree<Item["data"]>
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
                renderItemTitle={({ title, context }) => (
                    <span
                        onDoubleClick={(e) => {
                            e.preventDefault();
                            context.startRenamingItem();
                        }}
                        className="w-full h-10 px-4 py-2"
                    >
                        {title}
                    </span>
                )}
                renderRenameInput={({ inputProps, formProps, inputRef }) => (
                    <form
                        {...formProps}
                        className="flex gap-2 items-center w-full"
                    >
                        <Input
                            {...inputProps}
                            ref={inputRef}
                            className="w-full"
                        />
                    </form>
                )}
                renderItemArrow={({ item, context }) =>
                    item.isFolder ? (
                        <Button
                            {...context.interactiveElementProps}
                            size="icon"
                            variant="ghost"
                            className="!size-10"
                            type="button"
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
                renderItem={(props) => (
                    <TreeItem provider={provider} items={items} {...props} />
                )}
            />
        </UncontrolledTreeEnvironment>
    );
};

export default TreeComponent;
