import { ChevronRight } from "lucide-react";
import type { FC } from "react";
import {
    type TreeItem as ComplexTreeItem,
    Tree,
    UncontrolledTreeEnvironment,
} from "react-complex-tree";
import { Button } from "../ui/button.tsx";
import { Input } from "../ui/input.tsx";
import type { CustomTreeDataProvider } from "./DataProvider.tsx";
import TreeItem from "./TreeItem.tsx";

export type Item = ComplexTreeItem<{
    title: string;
    url?: string;
    image?: {
        src: string;
        alt?: string;
        name?: string;
        size?: number;
        type?: string;
    };
}>;

export interface Items {
    [key: string]: Item;
}

const TreeComponent: FC<{
    provider: CustomTreeDataProvider<Item["data"]>;
}> = ({ provider }) => {
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
                renderDragBetweenLine={({ lineProps }) => (
                    <div
                        {...lineProps}
                        className="h-0.5 rounded-lg bg-blue-500 w-full"
                    />
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
                            // -ml-11 and not 10 to account for the gap of 1 between the arrow and button
                            className="!size-10 -ml-11 shrink-0"
                            type="button"
                        >
                            <ChevronRight
                                className={`size-4 duration-100 ${
                                    context.isExpanded ? "rotate-90" : ""
                                }`}
                                aria-hidden={true}
                                {...context.arrowProps}
                            />
                            <span className="sr-only">
                                {context.isExpanded ? "Collapse" : "Expand"}
                            </span>
                        </Button>
                    ) : (
                        <div className="size-10 -ml-11 shrink-0" />
                    )
                }
                renderItem={(props) => (
                    <TreeItem provider={provider} {...props} />
                )}
            />
        </UncontrolledTreeEnvironment>
    );
};

export default TreeComponent;
