import { aggregator } from "@/classes/aggregator/content-aggregator";
import { UserLinkDriver } from "@/classes/aggregator/drivers/user-link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export const useCreateParam = (sidepageId: string) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    // Prevent processing the create param multiple times
    const processed = useRef(false);

    useEffect(() => {
        const createParam = searchParams.get("create");
        if (createParam && !processed.current) {
            processed.current = true;
            router.replace(window.location.pathname);

            if (URL.canParse(createParam)) {
                setLoading(true);
                const linkDriver = new UserLinkDriver();
                linkDriver
                    .parseContent({
                        title: "",
                        url: createParam,
                    })
                    .then((content) =>
                        aggregator.addContentToSidepage(sidepageId, content),
                    )
                    .finally(() => setLoading(false));
            }
        }
    }, [searchParams, sidepageId, router]);

    return { loading };
};
