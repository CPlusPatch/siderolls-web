/**
 * @fileoverview User link driver for Sidepage content
 */

import type { ContentItem } from "@/classes/sidepage/schema";
import { nanoid } from "nanoid";
import type { ContentDriver } from "../content-aggregator";
export interface UserLinkData {
    url: string;
    title: string;
}

export interface MetadataResult {
    lang: string;
    author: string;
    title: string;
    publisher: string;
    image: MetadataImage;
    url: string;
    description: string;
    audio: null;
    date: Date;
    logo: MetadataImage;
    video: null;
}

export interface MetadataImage {
    url: string;
    type: string;
    size: number;
    height: number;
    width: number;
    size_pretty: string;
    palette: string[];
    background_color: string;
    color: string;
    alternative_color: string;
}

/**
 * Driver for user-provided links
 */
export class UserLinkDriver implements ContentDriver {
    name = "UserLink";

    fetchContent(): Promise<ContentItem[]> {
        // This method won't be used for user-provided content
        return Promise.resolve([]);
    }

    async parseContent(rawData: UserLinkData): Promise<ContentItem> {
        const metadata = await this.fetchMetadata(rawData.url);
        return {
            id: nanoid(),
            type: "link",
            title: rawData.title || metadata.title || rawData.url,
            dateAdded: new Date().toISOString(),
            url: rawData.url,
            description: metadata.description ?? "A user-provided link",
            image: metadata.image?.url ?? metadata.logo?.url,
        };
    }

    private async fetchMetadata(
        href: string,
    ): Promise<Partial<MetadataResult>> {
        const url = new URL(
            `https://api.microlink.io?${new URLSearchParams({
                url: href,
            })}`,
        );

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to fetch metadata");
        }

        return response.json().then((a) => a.data);
    }
}
