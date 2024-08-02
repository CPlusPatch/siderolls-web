/* "use client";

import { Button } from "@/components/ui/button";
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
import { Image, Link, type SVGAttributes } from "lucide-react";
import { type ComponentType, type FC, type ReactNode, useState } from "react";
import { AddLinkDialog } from "./AddLink";

const contentTypes: {
    label: string;
    icon: ComponentType<SVGAttributes>;
    type: ContentItem["type"];
}[] = [
    {
        label: "Link",
        icon: Link,
        type: "link",
    },
    {
        label: "Media",
        icon: Image,
        type: "media",
    },
];

export const AddContentForm: FC<{
    children?: ReactNode;
}> = ({ children }) => {
    const [openChild, setOpenChild] = useState(false);
    const [open, setOpen] = useState(false);
    const [type, setType] = useState<ContentItem["type"] | null>(null);

    const handleAdd = (type: ContentItem["type"]) => {
        setType(type);
        setOpenChild(true);
    };

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild={true}>{children}</DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle>New Content</DrawerTitle>
                        <DrawerDescription>
                            Add new content to the sidepage
                        </DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                        {contentTypes.map((contentType) => (
                            <Button
                                key={contentType.type}
                                variant="default"
                                onClick={() => handleAdd(contentType.type)}
                            >
                                <contentType.icon className="mr-2 size-4" />
                                {contentType.label}
                            </Button>
                        ))}
                        <DrawerClose asChild={true}>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
            <AddLinkDialog
                open={openChild && type === "link"}
                setOpen={setOpenChild}
                onAdd={() => setOpen(false)}
            />
        </Drawer>
    );
};

export interface ContentAdderProps {
    onAdd?: (type: ContentItem["type"]) => void;
    setOpen: (open: boolean) => void;
    open: boolean;
}
 */
