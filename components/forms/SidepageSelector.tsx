import type {
    DatabaseSidepage,
    SidepageAggregator,
} from "@/classes/aggregator/content-aggregator";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Icon } from "@iconify-icon/react";
import type { FC } from "react";

export const SidepageSelector: FC<{ sidepages: DatabaseSidepage[] }> = ({
    sidepages,
}) => {
    return (
        <Select>
            <SelectTrigger>
                <SelectValue
                    placeholder="Select a sidepage"
                    defaultValue={sidepages[0]?.id ?? undefined}
                />
            </SelectTrigger>
            <SelectContent>
                {sidepages.map((sidepage) => (
                    <SelectItem key={sidepage.id} value={sidepage.id}>
                        {sidepage.title}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export const SidepageCreator: FC<{ aggregator: SidepageAggregator }> = ({
    aggregator,
}) => {
    const createSidepage = async () => {
        await aggregator.createSidepage({
            title: "New Sidepage",
            description: "A new sidepage",
            creator: "user",
            childrenIds: [],
            contentIds: [],
            sidepoints: [],
        });
    };

    return (
        <Button
            variant="default"
            size="icon"
            className=""
            onClick={createSidepage}
        >
            <Icon icon="tabler:plus" className="size-4" width="none" />
        </Button>
    );
};
