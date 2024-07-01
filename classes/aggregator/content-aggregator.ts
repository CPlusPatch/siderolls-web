import { nanoid } from "nanoid";
import { useCallback, useEffect, useState } from "react";
/**
 * @fileoverview Core classes and interfaces for the content aggregator framework
 */
import type { WxtStorage } from "wxt/storage";
import { RSSDriver } from "./drivers/rss";
import { TwitterDriver } from "./drivers/twitter";
import { UserLinkDriver } from "./drivers/user-link";
import { UserMediaDriver } from "./drivers/user-media";

/**
 * Represents a piece of content from any source
 */
export interface Content<DataType = Record<string, unknown>> {
    id: string;
    type: "link" | "media" | "text" | "social" | "folder";
    parentId: string | null;
    source: string;
    timestamp: number;
    title: string;
    data: DataType;
}

/**
 * Interface for content provider drivers
 */
export interface ContentDriver<DataType = Record<string, unknown>> {
    name: string;
    fetchContent(): Promise<Content<DataType>[]>;
    parseContent(rawData: unknown): Content<DataType>;
}

/**
 * Main class for managing content aggregation
 */
export class ContentAggregator {
    private drivers: ContentDriver[];
    private storage: WxtStorage;
    private listeners: Set<() => void>;

    constructor(storage: WxtStorage) {
        this.drivers = [];
        this.storage = storage;
        this.listeners = new Set();
    }

    /**
     * Add a content driver to the aggregator
     * @param driver - The content driver to add
     */
    addDriver(driver: ContentDriver): void {
        this.drivers.push(driver);
    }

    /**
     * Fetch all content from storage and drivers
     * @returns A promise that resolves to an array of Content
     */
    async fetchAllContent(): Promise<Content[]> {
        const driverContent = await Promise.all(
            this.drivers.map((driver) => driver.fetchContent()),
        );
        const storedContent = await this.getAllStoredContent();
        return [...driverContent.flat(), ...storedContent];
    }

    private async getAllStoredContent(): Promise<Content[]> {
        const allStorage = await this.storage.snapshot("local");
        return Object.values(allStorage) as Content[];
    }

    /**
     * Store content in the WebExtension storage
     * @param content - The content to store
     */
    async storeContent(content: Content): Promise<void> {
        await this.storage.setItem(`local:${content.id}`, content);
        this.notifyListeners();
    }

    /**
     * Create a new folder in the WebExtension storage
     * @param name - The name of the new folder
     * @param parentId - The ID of the parent folder, or null for root
     */
    async createFolder(
        name: string,
        parentId: string | null,
    ): Promise<Content> {
        const folder: Content = {
            id: nanoid(),
            type: "folder",
            source: "local",
            parentId,
            timestamp: Date.now(),
            title: name,
            data: {},
        };
        await this.storeContent(folder);
        return folder;
    }

    /**
     * Move content to a new parent folder
     * @param contentId - The ID of the content to move
     * @param newParentId - The ID of the new parent folder, or null for root
     */
    async moveContent(
        contentId: string,
        newParentId: string | null,
    ): Promise<void> {
        const content = await this.getContent(contentId);
        if (!content) {
            throw new Error(`Content not found: ${contentId}`);
        }
        content.parentId = newParentId;
        await this.storeContent(content);
    }

    /**
     * Retrieve content from the WebExtension storage
     * @param id - The ID of the content to retrieve
     * @returns A promise that resolves to the Content or null if not found
     */
    async getContent(id: string): Promise<Content | null> {
        return await this.storage.getItem<Content>(`local:${id}`);
    }

    /**
     * Remove content from the WebExtension storage
     * @param id - The ID of the content to remove
     */
    async removeContent(id: string): Promise<void> {
        await this.storage.removeItem(`local:${id}`);
        this.notifyListeners();
    }

    /**
     * Add a listener to be notified when content changes
     * @param listener - The function to call when content changes
     */
    addListener(listener: () => void): void {
        this.listeners.add(listener);
    }

    /**
     * Remove a listener
     * @param listener - The function to remove from listeners
     */
    removeListener(listener: () => void): void {
        this.listeners.delete(listener);
    }

    private notifyListeners(): void {
        for (const listener of this.listeners) {
            listener();
        }
    }
}

/**
 * Custom hook for fetching and updating content
 */
export function useContent(aggregator: ContentAggregator) {
    const [content, setContent] = useState<Content[]>([]);

    const fetchContent = useCallback(async () => {
        const newContent = await aggregator.fetchAllContent();
        setContent(newContent);
    }, [aggregator]);

    useEffect(() => {
        fetchContent();
        aggregator.addListener(fetchContent);
        return () => aggregator.removeListener(fetchContent);
    }, [aggregator, fetchContent]);

    return content;
}

/**
 * Factory for creating content drivers
 */
// biome-ignore lint/complexity/noStaticOnlyClass: Factory pattern
export class DriverFactory {
    // biome-ignore lint/suspicious/noExplicitAny: // TODO: Add config type
    static createDriver(type: string, config: any): ContentDriver {
        switch (type) {
            case "rss":
                return new RSSDriver(config);
            case "twitter":
                return new TwitterDriver(config);
            case "user-link":
                return new UserLinkDriver();
            case "user-media":
                return new UserMediaDriver();
            default:
                throw new Error(`Unsupported driver type: ${type}`);
        }
    }
}
