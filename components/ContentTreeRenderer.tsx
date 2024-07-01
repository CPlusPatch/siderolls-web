/**
 * React component for displaying the content tree
 */
import {
    type Content,
    type ContentAggregator,
    useContent,
} from "@/classes/aggregator/content-aggregator";
import type { UserLinkData } from "@/classes/aggregator/drivers/user-link";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
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

interface TreeNode {
    id: string;
    name: string;
    content: Content;
    // If it's a folder, it will have children
    children?: TreeNode[];
}

interface ContentTreeProps {
    aggregator: ContentAggregator;
}

export const ContentTree: FC<ContentTreeProps> = ({ aggregator }) => {
    const content = useContent(aggregator);
    const [treeData, setTreeData] = useState<TreeNode[]>([]);

    const tree = useMemo(() => new SimpleTree<TreeNode>(treeData), [treeData]);
    const containerRef = useRef<HTMLDivElement | null>(null);

    // Get reactive height of the container
    const { width, height } = useResizeObserver({
        ref: containerRef as RefObject<HTMLDivElement>,
    });

    useEffect(() => {
        const organizedData = organizeContentIntoTree(content);
        setTreeData(organizedData);
    }, [content]);

    const organizeContentIntoTree = (
        content: Content[],
        isFirst = true,
    ): TreeNode[] => {
        const mapped = content
            .filter((c) =>
                isFirst
                    ? c.parentId === tree.root.id || c.parentId === null
                    : Boolean,
            )
            .map((item) => {
                const children =
                    item.type === "folder"
                        ? organizeContentIntoTree(
                              content.filter(
                                  (child) => child.parentId === item.id,
                              ),
                              false,
                          )
                        : undefined;

                return {
                    id: item.id,
                    name: item.data.title || item.data.text || "Untitled",
                    content: item,
                    children,
                };
            });

        return mapped;
    };

    const onMove: MoveHandler<TreeNode> = async (args: {
        dragIds: string[];
        parentId: null | string;
        index: number;
    }) => {
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
            // Get content ID of node
            const contentId = nodes.find((node) => node.id === id)?.data.content
                ?.id;
            contentId && aggregator.removeContent(contentId);
        }
        setTreeData(tree.data);
    };

    const createNewFolder = async () => {
        await aggregator.createFolder("New folder", tree.root.id);
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

    const isFolder = !!node.data.children;
    const isEmptyFolder = isFolder && !node.data.children?.length;

    // If empty, always keep the folder open
    if (isEmptyFolder) {
        // node.open();
    }

    return (
        <div style={style} ref={dragHandle} className="relative">
            <div
                className={cn(
                    "flex hover:scale-[102%] flex-row items-center justify-center gap-x-2 px-4 text-sm font-semibold py-1 h-10 rounded text-gray-200 bg-dark-300 hover:bg-dark-200 duration-200 ring-1 ring-white/10",
                )}
                onClick={(e) => {
                    e.stopPropagation();
                    node.toggle();
                }}
                onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === "Enter" && !isEmptyFolder) {
                        node.toggle();
                    }
                }}
            >
                {node.isLeaf ? null : (
                    <Icon
                        icon={"tabler:chevron-right"}
                        className={`size-4 ${node.isOpen ? "rotate-90" : ""}`}
                        width="none"
                        aria-hidden={true}
                    />
                )}
                <Icon
                    icon={node.isLeaf ? "tabler:link" : openIcon}
                    className="size-4"
                    width={"none"}
                    aria-hidden={true}
                />
                <span
                    contentEditable={false}
                    className={cn("grow", isFolder && "cursor-text")}
                    onClick={(e) => {
                        // If clicking while editing text, don't toggle
                        isFolder && e.stopPropagation();
                    }}
                    onKeyDown={(e) => {
                        // If clicking while editing text, don't toggle
                        isFolder && e.stopPropagation();

                        if (isFolder && e.key === "Enter") {
                            e.preventDefault();
                            e.currentTarget.blur();
                        }
                    }}
                >
                    {isFolder ? (
                        node.data.content.data.name
                    ) : (
                        <NodeContentRenderer
                            {...(node.data.content as Content)}
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

const NodeContentRenderer: FC<Content> = (content) => {
    switch (content.type) {
        case "link":
            return <LinkNodeRenderer {...(content as Content<UserLinkData>)} />;
        default:
            return <span>Data</span>;
    }
};

const LinkNodeRenderer: FC<Content<UserLinkData>> = ({ data }) => {
    // Show link title and then link data on hover
    return (
        <Popover>
            <PopoverTrigger className="block w-full text-left">
                {data.title}
            </PopoverTrigger>
            <PopoverContent className="!p-0 overflow-hidden w-[calc(100vw-2rem)] translate-x-4">
                <div className="grid grid-cols-[auto_1fr] gap-2">
                    <div className="overflow-hidden size-14">
                        <img
                            src="https://mk.cpluspatch.com/files/webpublic-5e8bfd4b-c2f9-40de-8ef0-0adb8e3b6d4c"
                            alt=""
                            className="object-cover w-full h-full"
                        />
                    </div>
                    <div className="flex flex-col justify-center gap-1">
                        <span className="text-sm font-semibold">
                            {data.title}
                        </span>
                        <span className="text-xs text-gray-400">
                            {data.url}
                        </span>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};
