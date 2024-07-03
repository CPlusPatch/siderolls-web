/**
 * @fileoverview User media driver for Sidepage content
 */

import type { ContentItem, Media } from "@/classes/sidepage/schema";
import { nanoid } from "nanoid";
import type { ContentDriver } from "../content-aggregator";

export interface UserMediaData {
    file: File;
    title: string;
}

/**
 * Driver for user-uploaded media
 */
export class UserMediaDriver implements ContentDriver {
    name = "UserMedia";

    fetchContent(): Promise<ContentItem[]> {
        // This method won't be used for user-provided content
        return Promise.resolve([]);
    }

    parseContent(rawData: UserMediaData): Promise<ContentItem> {
        return Promise.resolve({
            id: nanoid(),
            type: "media",
            title: rawData.title || rawData.file.name,
            created_at: new Date().toISOString(),
            url: URL.createObjectURL(rawData.file),
            format: rawData.file.type.split("/")[1],
            mediaType: (() => {
                switch (rawData.file.type.split("/")[0]) {
                    case "image":
                        return "image";
                    case "video":
                        return "video";
                    case "audio":
                        return "audio";
                    default:
                        throw new Error("Invalid media type");
                }
            })(),
            description: "A user-provided media file",
        } as Media);
    }
}
