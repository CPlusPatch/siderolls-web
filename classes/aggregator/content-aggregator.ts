import { nanoid } from "nanoid";
import { useCallback, useEffect, useState } from "react";
/**
 * @fileoverview Core classes and interfaces for the content aggregator framework
 */
import type { WxtStorage } from "wxt/storage";
import type { ContentItem } from "../sidepage/schema";
import { UserLinkDriver } from "./drivers/user-link";
import { UserMediaDriver } from "./drivers/user-media";

/**
 * Represents a Sidepage
 */
export interface DatabaseSidepage {
    id: string;
    title: string;
    description?: string;
    creator: string;
    dateCreated: string;
    dateModified: string;
    sidepoints: string[];
    contentIds: string[];
    parentId?: string;
    childrenIds: string[];
}

/**
 * Interface for content provider drivers
 */
export interface ContentDriver {
    name: string;
    fetchContent(): Promise<ContentItem[]>;
    parseContent(rawData: unknown): Promise<ContentItem>;
}

/**
 * Main class for managing Sidepage aggregation
 */
export class SidepageAggregator {
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
     * Fetch all Sidepages from storage
     * @returns A promise that resolves to an array of Sidepages
     */
    async fetchAllSidepages(): Promise<DatabaseSidepage[]> {
        const allStorage = await this.storage.snapshot("local");
        return Object.values(allStorage).filter(
            (item): item is DatabaseSidepage =>
                typeof item === "object" &&
                item !== null &&
                "contentIds" in item,
        );
    }

    /**
     * Fetch all ContentItems from storage
     * @returns A promise that resolves to an array of ContentItems
     */
    async fetchAllContentItems(): Promise<ContentItem[]> {
        const allStorage = await this.storage.snapshot("local");
        return Object.values(allStorage).filter(
            (item): item is ContentItem =>
                typeof item === "object" && item !== null && "type" in item,
        );
    }

    /**
     * Create a new Sidepage
     * @param sidepage - The Sidepage to create
     */
    async createSidepage(
        sidepage: Omit<DatabaseSidepage, "id" | "dateCreated" | "dateModified">,
    ): Promise<DatabaseSidepage> {
        const newSidepage: DatabaseSidepage = {
            ...sidepage,
            id: nanoid(),
            dateCreated: new Date().toISOString(),
            dateModified: new Date().toISOString(),
        };
        await this.storage.setItem(
            `local:sidepage:${newSidepage.id}`,
            newSidepage,
        );
        this.notifyListeners();
        return newSidepage;
    }

    /**
     * Add a ContentItem to a Sidepage
     * @param sidepageId - The ID of the Sidepage
     * @param contentItem - The ContentItem to add
     */
    async addContentToSidepage(
        sidepageId: string,
        contentItem: Omit<ContentItem, "id" | "dateAdded">,
    ): Promise<void> {
        const sidepage = await this.getSidepage(sidepageId);
        if (!sidepage) {
            throw new Error(`Sidepage not found: ${sidepageId}`);
        }

        const newContentItem: ContentItem = {
            ...(contentItem as ContentItem),
            id: nanoid(),
            dateAdded: new Date().toISOString(),
        };

        await this.storage.setItem(
            `local:content:${newContentItem.id}`,
            newContentItem,
        );
        sidepage.contentIds.push(newContentItem.id);
        sidepage.dateModified = new Date().toISOString();
        await this.storage.setItem(`local:sidepage:${sidepage.id}`, sidepage);
        this.notifyListeners();
    }

    /**
     * Retrieve a Sidepage from storage
     * @param id - The ID of the Sidepage to retrieve
     */
    async getSidepage(id: string): Promise<DatabaseSidepage | null> {
        return await this.storage.getItem<DatabaseSidepage>(
            `local:sidepage:${id}`,
        );
    }

    /**
     * Retrieve a ContentItem from storage
     * @param id - The ID of the ContentItem to retrieve
     */
    async getContentItem(id: string): Promise<DatabaseSidepage | null> {
        return await this.storage.getItem<DatabaseSidepage>(
            `local:content:${id}`,
        );
    }

    /**
     * Remove a Sidepage and all its content from storage
     * @param id - The ID of the Sidepage to remove
     */
    async removeSidepage(id: string): Promise<void> {
        const sidepage = await this.getSidepage(id);
        if (sidepage) {
            await Promise.all(
                sidepage.contentIds.map((contentId) =>
                    this.storage.removeItem(`local:content:${contentId}`),
                ),
            );
            await this.storage.removeItem(`local:sidepage:${id}`);
            this.notifyListeners();
        }
    }

    /**
     * Remove a ContentItem from storage
     * @param id - The ID of the ContentItem to remove
     */
    async removeContentItem(id: string): Promise<void> {
        await this.storage.removeItem(`local:content:${id}`);
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
 * Custom hook for fetching and updating Sidepages
 */
export function useSidepages(aggregator: SidepageAggregator) {
    const [sidepages, setSidepages] = useState<DatabaseSidepage[]>([]);

    const fetchSidepages = useCallback(async () => {
        const newSidepages = await aggregator.fetchAllSidepages();
        setSidepages(newSidepages);
    }, [aggregator]);

    useEffect(() => {
        fetchSidepages();
        aggregator.addListener(fetchSidepages);
        return () => aggregator.removeListener(fetchSidepages);
    }, [aggregator, fetchSidepages]);

    return sidepages;
}

export function useContent(aggregator: SidepageAggregator) {
    const [content, setContent] = useState<ContentItem[]>([]);

    const fetchContent = useCallback(async () => {
        const newContent = await aggregator.fetchAllContentItems();
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
    static createDriver(type: string): ContentDriver {
        switch (type) {
            case "user-link":
                return new UserLinkDriver();
            case "user-media":
                return new UserMediaDriver();
            default:
                throw new Error(`Unsupported driver type: ${type}`);
        }
    }
}
