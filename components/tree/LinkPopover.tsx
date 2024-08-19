import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Link } from "lucide-react";
import type { FC } from "react";
import type { TreeItem } from "react-complex-tree";

const LinkPopover: FC<{ item: TreeItem }> = ({ item }) => (
    <Popover>
        <PopoverTrigger asChild={true}>
            <Button size="icon" variant="link">
                <Link className="size-4" />
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
            <div className="grid gap-4">
                <div className="space-y-2">
                    <h4 className="font-medium leading-none">Link</h4>
                    <p className="text-sm text-muted-foreground">
                        Set the link for this node.
                    </p>
                </div>
                <div className="grid gap-2">
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="url">URL</Label>
                        <Input
                            id="url"
                            defaultValue={item.data.url}
                            onInput={(e) => {
                                item.data.url = e.currentTarget.value;
                            }}
                            placeholder="https://example.com"
                            className="col-span-2 h-8"
                        />
                    </div>
                </div>
            </div>
        </PopoverContent>
    </Popover>
);

export default LinkPopover;
