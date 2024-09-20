import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { FC } from "react";
import { memo, useState } from "react";
import {
    type TreeItem as ComplexTreeItem,
    Tree,
    type TreeItemIndex,
    type TreeProps,
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

type NonUndefined<T> = T extends undefined ? never : T;

const TreeContainer: FC<
    Parameters<
        NonUndefined<TreeProps<Item["data"]>["renderTreeContainer"]>
    >["0"]
> = memo(({ children, containerProps }) => (
    <div className="max-w-2xl mx-auto w-full" {...containerProps}>
        {children}
    </div>
));

const DragBetweenLine: FC<
    Parameters<
        NonUndefined<TreeProps<Item["data"]>["renderDragBetweenLine"]>
    >["0"]
> = memo(({ lineProps }) => (
    <div {...lineProps} className="h-0.5 rounded-lg bg-blue-500 w-full" />
));

const ItemsContainer: FC<
    Parameters<
        NonUndefined<TreeProps<Item["data"]>["renderItemsContainer"]>
    >["0"] & {
        openingItem?: TreeItemIndex;
        closingItem?: TreeItemIndex;
    }
> = memo(
    ({
        children,
        containerProps,
        parentId,
        openingItem,
        closingItem,
        depth,
    }) => (
        <div className="flex">
            <div className="w-full">
                <ul
                    className="flex flex-col gap-2 w-full overflow-hidden duration-200 relative"
                    style={{
                        maxHeight:
                            parentId === openingItem || parentId === closingItem
                                ? 0
                                : "100%",
                    }}
                    {...containerProps}
                >
                    {depth !== 0 && <ItemSideLine />}
                    {children}
                </ul>
            </div>
        </div>
    ),
);

const ItemTitle: FC<
    Parameters<NonUndefined<TreeProps<Item["data"]>["renderItemTitle"]>>["0"]
> = memo(({ title, context }) => (
    <span
        onDoubleClick={(e) => {
            e.preventDefault();
            context.startRenamingItem();
        }}
        className="w-full h-10 px-4 py-2"
    >
        {title}
    </span>
));

const RenameInput: FC<
    Parameters<NonUndefined<TreeProps<Item["data"]>["renderRenameInput"]>>["0"]
> = memo(({ inputProps, formProps, inputRef }) => (
    <form {...formProps} className="flex gap-2 items-center w-full">
        <Input {...inputProps} ref={inputRef} className="w-full" />
    </form>
));

const ItemArrow: FC<
    Parameters<NonUndefined<TreeProps<Item["data"]>["renderItemArrow"]>>["0"]
> = memo(({ item, context }) =>
    item.isFolder ? (
        <Button
            {...context.interactiveElementProps}
            size="icon"
            variant="ghost"
            className="!size-10 shrink-0"
            type="button"
        >
            <motion.div
                animate={{
                    rotate: context.isExpanded ? 90 : 0,
                }}
                transition={{ duration: 0.1 }}
            >
                <ChevronRight
                    className="size-4"
                    aria-hidden={true}
                    {...context.arrowProps}
                />
            </motion.div>
            <span className="sr-only">
                {context.isExpanded ? "Collapse" : "Expand"}
            </span>
        </Button>
    ) : (
        <></>
    ),
);

const ItemSideLine: FC = memo(() => (
    <div className="absolute left-5 top-0 bottom-0 w-0.5 h-full bg-muted rounded" />
));

const TreeComponent: FC<{ provider: CustomTreeDataProvider<Item["data"]> }> = ({
    provider,
}) => {
    const [openingItem, setOpeningItem] = useState<TreeItemIndex | undefined>();
    const [closingItem, setClosingItem] = useState<TreeItemIndex | undefined>();

    return (
        <UncontrolledTreeEnvironment
            dataProvider={provider}
            getItemTitle={(item) => item.data.title}
            viewState={{}}
            canDragAndDrop={true}
            canReorderItems={true}
            canDropOnFolder={true}
            canDropOnNonFolder={true}
            shouldRenderChildren={(item, context) =>
                context.isExpanded ||
                closingItem === item.index ||
                openingItem === item.index
            }
            onExpandItem={(item) => {
                setOpeningItem(item.index);
                setTimeout(() => {
                    setOpeningItem(undefined);
                }, 500);
            }}
            onCollapseItem={(item) => {
                setClosingItem(item.index);
                setTimeout(() => {
                    setClosingItem(undefined);
                }, 500);
            }}
        >
            <Tree<Item["data"]>
                treeId="tree-1"
                rootItem="root"
                treeLabel="Tree Example"
                renderTreeContainer={(props) => <TreeContainer {...props} />}
                renderDragBetweenLine={(props) => (
                    <DragBetweenLine {...props} />
                )}
                renderItemsContainer={(props) => (
                    <ItemsContainer
                        {...props}
                        openingItem={openingItem}
                        closingItem={closingItem}
                    />
                )}
                renderItemTitle={(props) => <ItemTitle {...props} />}
                renderRenameInput={(props) => <RenameInput {...props} />}
                renderItemArrow={(props) => <ItemArrow {...props} />}
                renderItem={(props) => (
                    <TreeItem provider={provider} {...props} />
                )}
            />
        </UncontrolledTreeEnvironment>
    );
};

export default TreeComponent;
