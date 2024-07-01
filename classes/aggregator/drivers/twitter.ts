import { nanoid } from "nanoid";
import type { Content, ContentDriver } from "../content-aggregator";

export type TwitterData = {
    tweetId: string;
    text: string;
    created_at: string;
};

/**
 * Example Twitter content driver
 */
export class TwitterDriver implements ContentDriver<TwitterData> {
    name = "Twitter";
    // @ts-expect-error Will be used later
    private username: string;

    constructor(config: { username: string }) {
        this.username = config.username;
    }

    async fetchContent(): Promise<Content[]> {
        // TODO: Implement Twitter API call here
        const mockTweets: TwitterData[] = [];
        return mockTweets.map((tweet) => this.parseContent(tweet));
    }

    parseContent(rawData: TwitterData): Content<TwitterData> {
        return {
            id: nanoid(),
            type: "social",
            source: this.name,
            parentId: null,
            timestamp: new Date(rawData.created_at).getTime(),
            data: {
                tweetId: rawData.tweetId,
                text: rawData.text,
                created_at: rawData.created_at,
            },
        };
    }
}
