import { nanoid } from "nanoid";
import type { Content, ContentDriver } from "../content-aggregator";

export type RSSData = {
    title: string;
    link: string;
};

/**
 * Example RSS content driver
 */
export class RSSDriver implements ContentDriver<RSSData> {
    name = "RSS";
    // @ts-expect-error Will be used later
    private feedUrl: string;

    constructor(config: { feedUrl: string }) {
        this.feedUrl = config.feedUrl;
    }

    async fetchContent(): Promise<Content<RSSData>[]> {
        // TODO: Fetch and parse RSS feed
        const parsedItems: RSSData[] = [];
        return parsedItems.map((item) => this.parseContent(item));
    }

    parseContent(rawData: RSSData): Content<RSSData> {
        return {
            id: nanoid(),
            type: "link",
            source: this.name,
            parentId: null,
            timestamp: Date.now(),
            title: rawData.title,
            data: {
                title: rawData.title,
                link: rawData.link,
            },
        };
    }
}
