import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Image } from "lucide-react";
import { type FC, useCallback } from "react";
import type { StaticTreeDataProvider, TreeItem } from "react-complex-tree";
import { useDropzone } from "react-dropzone";
import type { Item, Items } from "./Tree";
import { editItem } from "./dataProvider";

const ImagePopover: FC<{
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
        <Popover>
            <PopoverTrigger asChild={true}>
                <Button size="icon" variant="link">
                    <Image className="size-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Image</h4>
                    </div>
                    <div>
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
            </PopoverContent>
        </Popover>
    );
};

export default ImagePopover;
