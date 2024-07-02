/* import {
    type SidepageAggregator,
    useContent,
} from "@/classes/aggregator/content-aggregator";
import type { ContentItem } from "@/classes/sidepage/schema";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify-icon/react";
import { nanoid } from "nanoid";
import {
    type FC,
    type RefObject,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    type CreateHandler,
    type DeleteHandler,
    type MoveHandler,
    type NodeRendererProps,
    type RenameHandler,
    SimpleTree,
    Tree,
} from "react-arborist";
import useResizeObserver from "use-resize-observer";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface TreeNode {
    id: string;
    name: string;
    content: ContentItem;
    children?: TreeNode[];
}

interface ContentTreeProps {
    aggregator: SidepageAggregator;
}

export const ContentTree: FC<ContentTreeProps> = ({ aggregator }) => {
    const content = useContent(aggregator);
    const [treeData, setTreeData] = useState<TreeNode[]>([]);

    const tree = useMemo(() => new SimpleTree<TreeNode>(treeData), [treeData]);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const { width, height } = useResizeObserver({
        ref: containerRef as RefObject<HTMLDivElement>,
    });

    useEffect(() => {
        const organizedData = organizeContentIntoTree(content);
        setTreeData(organizedData);
    }, [content]);

    const organizeContentIntoTree = (
        content: ContentItem[],
        isRoot = true,
    ): TreeNode[] => {
        return content
            .filter((c) => (isRoot ? c.parentId === null : true))
            .map((item) => ({
                id: item.id,
                name: item.title,
                content: item,
                children:
                    item.type === "folder"
                        ? organizeContentIntoTree(
                              content.filter(
                                  (child) => child.parentId === item.id,
                              ),
                              false,
                          )
                        : undefined,
            }));
    };

    const onMove: MoveHandler<TreeNode> = async (args) => {
        for (const id of args.dragIds) {
            tree.move({ id, parentId: args.parentId, index: args.index });
            await aggregator.moveContent(id, args.parentId ?? null);
        }
    };

    const onRename: RenameHandler<TreeNode> = ({ name, id }) => {
        tree.update({ id, changes: { name } as TreeNode });
        setTreeData(tree.data);
    };

    const onCreate: CreateHandler<TreeNode> = ({ parentId, index, type }) => {
        const data = { id: nanoid(), name: "" } as TreeNode;
        if (type === "internal") {
            data.children = [];
        }
        tree.create({ parentId, index, data });
        setTreeData(tree.data);
        return data;
    };

    const onDelete: DeleteHandler<TreeNode> = ({ ids, nodes }) => {
        for (const id of ids) {
            tree.drop({ id });
            const contentId = nodes.find((node) => node.id === id)?.data.content
                ?.id;
            contentId && aggregator.removeContent(contentId);
        }
        setTreeData(tree.data);
    };

    const createNewFolder = async () => {
        await aggregator.createFolder("New folder", null);
    };

    return (
        <div className="h-full">
            <div className="w-full flex flex-row gap-x-2">
                <Button
                    variant="ghost"
                    className="size-8"
                    onClick={createNewFolder}
                >
                    <Icon
                        icon="tabler:folder-plus"
                        className="size-4"
                        width="none"
                    />
                    <span className="sr-only">New folder</span>
                </Button>
            </div>
            <div ref={containerRef}>
                <Tree
                    data={treeData}
                    onMove={onMove}
                    onRename={onRename}
                    onCreate={onCreate}
                    onDelete={onDelete}
                    openByDefault={false}
                    rowHeight={48}
                    height={height}
                    width={width}
                    padding={8}
                    rowClassName="px-1"
                    className="[&_[role='treeitem']]:[transition:_top_0.2s_ease-in] [&_[role='treeitem']]:animate-fade-in"
                >
                    {Node}
                </Tree>
            </div>
        </div>
    );
};

function Node({ node, style, dragHandle, tree }: NodeRendererProps<TreeNode>) {
    const openIcon = node.isOpen ? "tabler:folder-open" : "tabler:folder";
    const isFolder = node.data.content.type === "folder";
    const isEmptyFolder = isFolder && !node.data.children?.length;

    useEffect(() => {
        if (isEmptyFolder) {
            node.open();
        }
    });

    return (
        <div style={style} ref={dragHandle} className="relative">
            <div
                className={cn(
                    buttonVariants({ variant: "outline" }),
                    "flex flex-row items-center justify-center gap-x-2 px-4 py-1 h-10 duration-200",
                )}
                onClick={(e) => {
                    e.stopPropagation();
                    !isEmptyFolder && node.toggle();
                }}
                onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === "Enter" && !isEmptyFolder) {
                        node.toggle();
                    }
                }}
            >
                {node.isLeaf ? (
                    <Icon
                        icon={node.isLeaf ? "tabler:link" : openIcon}
                        className="size-4"
                        width="none"
                        aria-hidden={true}
                    />
                ) : (
                    <Icon
                        icon="tabler:chevron-right"
                        className={`size-4 ${node.isOpen ? "rotate-90" : ""}`}
                        width="none"
                        aria-hidden={true}
                    />
                )}
                <span
                    className={cn("grow", isFolder && "cursor-text")}
                    onClick={(e) => isFolder && e.stopPropagation()}
                    onKeyDown={(e) => {
                        isFolder && e.stopPropagation();
                        if (isFolder && e.key === "Enter") {
                            e.preventDefault();
                            e.currentTarget.blur();
                        }
                    }}
                >
                    {isFolder ? (
                        node.data.content.title
                    ) : (
                        <NodeContentRenderer
                            {...(node.data.content as ContentItem)}
                        />
                    )}
                </span>
                <button
                    onClick={() => tree.delete(node)}
                    type="button"
                    className="flex items-center justify-center hover:bg-destructive duration-200 hover:scale-[102%] rounded p-1"
                >
                    <Icon icon="tabler:x" className="size-4" width="none" />
                </button>
            </div>
        </div>
    );
}

const NodeContentRenderer: FC<ContentItem> = (content) => {
    switch (content.type) {
        case "link":
            return <LinkNodeRenderer {...content} />;
        default:
            return <span>{content.title}</span>;
    }
};

const LinkNodeRenderer: FC<ContentItem> = ({ title, data }) => {
    return (
        <Drawer>
            <DrawerTrigger className="block w-full text-left">
                {title}
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Edit link</DrawerTitle>
                </DrawerHeader>
                <div className="grid grid-cols-[auto_1fr] gap-4 p-4">
                    <Avatar className="overflow-hidden size-14 rounded ring-ring/5 ring-1 relative">
                        <AvatarImage
                            src="https://mk.cpluspatch.com/files/webpublic-5e8bfd4b-c2f9-40de-8ef0-0adb8e3b6d4c"
                            alt=""
                        />
                        <AvatarFallback className="animate-pulse rounded-none" />
                    </Avatar>
                    <DrawerDescription className="flex flex-col justify-center gap-1">
                        <span className="text-base font-semibold text-foreground">
                            {title}
                        </span>
                        <span className="text-sm text-secondary-foreground">
                            {data.url as string}
                        </span>
                    </DrawerDescription>
                </div>
                <DrawerFooter>
                    <Button>Edit</Button>
                    <DrawerClose asChild={true}>
                        <Button variant="outline" className="w-full">
                            Cancel
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};
 */
