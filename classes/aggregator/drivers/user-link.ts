/**
 * @fileoverview User content drivers and UI components
 */

import { nanoid } from "nanoid";
import type { Content, ContentDriver } from "../content-aggregator";

export type UserLinkData = { url: string; title: string };

/**
 * Driver for user-provided links
 */
export class UserLinkDriver implements ContentDriver<UserLinkData> {
    name = "UserLink";

    fetchContent(): Promise<Content<UserLinkData>[]> {
        // This method won't be used for user-provided content
        return Promise.resolve([]);
    }

    parseContent(rawData: UserLinkData): Content<UserLinkData> {
        return {
            id: nanoid(),
            type: "link",
            source: this.name,
            parentId: null,
            timestamp: Date.now(),
            title: rawData.title || rawData.url,
            data: {
                url: rawData.url,
                title: rawData.title || rawData.url,
            },
        };
    }
}
