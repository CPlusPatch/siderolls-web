import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Image, MoreHorizontal } from "lucide-react";
import { type FC, useCallback } from "react";
import type { StaticTreeDataProvider, TreeItem } from "react-complex-tree";
import { useDropzone } from "react-dropzone";
import type { Item, Items } from "./Tree";
import { editItem } from "./dataProvider";

const Sidebar: FC<{
    item: TreeItem<Item["data"]>;
    items: Items;
    provider: StaticTreeDataProvider;
}> = ({ item, items, provider }) => {
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            for (const file of acceptedFiles) {
                const reader = new FileReader();

                reader.onabort = () =>
                    console.error("file reading was aborted");
                reader.onerror = () => console.error("file reading has failed");
                reader.onload = () => {
                    const src = reader.result as string;
                    editItem(provider, items, String(item.index), {
                        image: { src, alt: file.name },
                    });
                };
                reader.readAsDataURL(file);
            }
        },
        [item, items, provider],
    );

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <Sheet>
            <SheetTrigger asChild={true}>
                <Button size="icon" variant="link">
                    <MoreHorizontal className="size-4" />
                </Button>
            </SheetTrigger>
            <SheetContent className="h-screen flex flex-col w-full max-w-md">
                <SheetHeader>
                    <SheetTitle>Edit Item</SheetTitle>
                    <SheetDescription>
                        Modify the link and image for this item.
                    </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-4 py-4 grow">
                    <div className="grid w-full items-center gap-4">
                        <Label htmlFor="url">URL</Label>
                        <Input
                            id="url"
                            defaultValue={item.data.url}
                            onInput={(e) => {
                                item.data.url = e.currentTarget.value;
                            }}
                            placeholder="https://example.com"
                        />
                    </div>
                    <div className="grid w-full items-center gap-4">
                        <h4 className="font-medium leading-none">Image</h4>
                        <div
                            {...getRootProps()}
                            className="flex h-[150px] w-full items-center justify-center rounded-md border border-dashed text-sm flex-col gap-2"
                        >
                            <input {...getInputProps()} />
                            {item.data.image ? (
                                <img
                                    src={item.data.image.src}
                                    alt={item.data.image.alt}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <>
                                    <Image className="size-4" />
                                    Drop image here
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <SheetFooter className="mt-auto">
                    <SheetClose asChild={true}>
                        <Button type="submit" className="w-full">
                            Save changes
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default Sidebar;
