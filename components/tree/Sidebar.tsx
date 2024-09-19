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
import { useDropzone } from "react-dropzone";
import type { CustomTreeDataProvider } from "./DataProvider";
import type { Item } from "./Tree";

const Sidebar: FC<{
    item: Item;
    provider: CustomTreeDataProvider<Item["data"]>;
}> = ({ item, provider }) => {
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            for (const file of acceptedFiles) {
                const reader = new FileReader();

                reader.onabort = () =>
                    console.error("file reading was aborted");
                reader.onerror = () => console.error("file reading has failed");
                reader.onload = () => {
                    const src = reader.result as string;
                    provider.editItem(String(item.index), {
                        image: {
                            src,
                            alt: file.name,
                            name: file.name,
                            size: file.size,
                            type: file.type,
                        },
                    });
                };
                reader.readAsDataURL(file);
            }
        },
        [item, provider],
    );

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <Sheet>
            <SheetTrigger asChild={true}>
                <Button size="icon" variant="ghost" className="shrink-0">
                    <MoreHorizontal className="size-4" aria-hidden={true} />
                    <span className="sr-only">Edit item</span>
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
                            className="flex h-[150px] w-full items-center justify-center overflow-hidden rounded-md border border-dashed text-sm flex-col gap-2"
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
                                    <Image
                                        className="size-4"
                                        aria-hidden={true}
                                    />
                                    Drop image here
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <SheetFooter className="mt-auto">
                    <SheetClose asChild={true}>
                        <div className="flex flex-col gap-2 w-full">
                            <Button type="submit" className="w-full">
                                Save changes
                            </Button>
                        </div>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default Sidebar;
