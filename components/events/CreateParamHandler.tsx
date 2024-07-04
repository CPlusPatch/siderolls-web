import { FullPageLoader } from "@/components/loaders/full-page";
import { useCreateParam } from "@/hooks/useCreateParam";
import type { FC } from "react";

export const CreateParamHandler: FC<{ sidepageId: string }> = ({
    sidepageId,
}) => {
    const { loading } = useCreateParam(sidepageId);

    return loading ? <FullPageLoader text="Adding link" /> : null;
};
