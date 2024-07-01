import { nanoid } from "nanoid";
import type { Content, ContentDriver } from "../content-aggregator";

export type UserMediaData = { file: File; title: string };

/**
 * Driver for user-uploaded media
 */
export class UserMediaDriver implements ContentDriver<UserMediaData> {
    name = "UserMedia";

    fetchContent(): Promise<Content[]> {
        // This method won't be used for user-provided content
        return Promise.resolve([]);
    }

    parseContent(rawData: UserMediaData): Content<UserMediaData> {
        return {
            id: nanoid(),
            type: "media",
            source: this.name,
            parentId: null,
            timestamp: Date.now(),
            data: {
                file: rawData.file,
                title: rawData.title || rawData.file.name,
            },
        };
    }
}
