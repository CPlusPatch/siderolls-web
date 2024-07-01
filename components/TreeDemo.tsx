import { Icon } from "@iconify-icon/react";
import { type RefObject, useState } from "react";
import { type NodeRendererProps, Tree } from "react-arborist";
import useResizeObserver from "use-resize-observer";

type DataType = {
    id: string;
    name: string;
    children?: DataType[];
};

const data = [
    { id: "1", name: "Unread" },
    { id: "2", name: "Threads" },
    {
        id: "3",
        name: "Chat Rooms",
        children: [
            { id: "c1", name: "General" },
            { id: "c2", name: "Random" },
            { id: "c3", name: "Open Source Projects" },
        ],
    },
    {
        id: "4",
        name: "Direct Messages",
        children: [
            { id: "d1", name: "Alice" },
            { id: "d2", name: "Bob" },
            { id: "d3", name: "Charlie" },
        ],
    },
];

function Node({ node, style, dragHandle }: NodeRendererProps<DataType>) {
    const openIcon = node.isOpen ? "tabler:folder-open" : "tabler:folder";

    return (
        <div style={style} ref={dragHandle} className="relative">
            <div
                className="flex flex-row items-center gap-x-2 px-2 text-sm font-semibold py-1 h-8 rounded text-gray-200 bg-dark-300 hover:bg-dark-200 duration-200 ring-1 ring-white/10"
                onClick={(e) => {
                    e.stopPropagation();
                    node.toggle();
                }}
                onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === "Enter") {
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
                    icon={node.isLeaf ? "tabler:typography" : openIcon}
                    className="size-4"
                    width={"none"}
                    aria-hidden={true}
                />
                <span>{node.data.name}</span>
            </div>
        </div>
    );
}

export function TreeDemo({
    containerRef,
}: { containerRef: RefObject<HTMLDivElement | null> }) {
    const [treeData] = useState(data);

    // Get reactive height of the container
    const { width, height } = useResizeObserver({
        ref: containerRef as RefObject<HTMLDivElement>,
    });

    return (
        <Tree<DataType>
            initialData={treeData}
            openByDefault={true}
            rowHeight={40}
            height={height}
            width={width}
            padding={8}
            rowClassName="px-1"
            className="[&_[role='treeitem']]:[transition:_top_0.2s_ease-in] [&_[role='treeitem']]:animate-fade-in"
        >
            {Node}
        </Tree>
    );
}
