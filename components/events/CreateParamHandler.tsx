import { aggregator } from "@/classes/aggregator/content-aggregator";
import { UserLinkDriver } from "@/classes/aggregator/drivers/user-link";
import { useSearchParams } from "next/navigation";
import { type FC, useEffect, useState } from "react";
import { FullPageLoader } from "../loaders/full-page";

export const CreateParamHandler: FC<{
    sidepageId: string;
}> = ({ sidepageId }) => {
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (searchParams.get("create")) {
            // Check if it's a link
            if (URL.canParse(searchParams.get("create") ?? "")) {
                setLoading(true);
                const linkDriver = new UserLinkDriver();
                linkDriver
                    .parseContent({
                        title: "",
                        url: searchParams.get("create") ?? "",
                    })
                    .then((content) =>
                        aggregator.addContentToSidepage(sidepageId, content),
                    )
                    .then(() => {
                        setLoading(false);
                    });
            }
        }
    }, [searchParams, sidepageId]);

    return <>{loading && <FullPageLoader text="Adding link" />}</>;
};
