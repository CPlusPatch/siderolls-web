"use client";

import { nanoid } from "nanoid";
import { useCallback, useEffect, useState } from "react";
import type { ContentItem, Sidepage } from "../sidepage/schema";
import { UserLinkDriver } from "./drivers/user-link";
import { UserMediaDriver } from "./drivers/user-media";

/**
 * @fileoverview Core class for the Sidepage aggregator using localStorage
 */

/**
 * Interface for content provider drivers
 */
export interface ContentDriver {
    name: string;
    fetchContent(): Promise<ContentItem[]>;
    parseContent(rawData: unknown): Promise<ContentItem>;
}

/**
 * Main class for managing Sidepage aggregation using localStorage
 */
export class SidepageAggregator {
    private drivers: ContentDriver[];
    private listeners: Set<() => void>;
    private readonly storageKey = "siderolls:data";

    constructor() {
        this.drivers = [];
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
     * Get all data from localStorage
     */
    private getAllData(): Record<string, Sidepage> {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : {};
    }

    /**
     * Save all data to localStorage
     */
    private saveAllData(data: Record<string, Sidepage>): void {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
        this.notifyListeners();
    }

    /**
     * Fetch all Sidepages from storage
     * @returns A promise that resolves to an array of Sidepages
     */
    fetchAllSidepages(): Promise<Sidepage[]> {
        const allData = this.getAllData();
        return Promise.resolve(Object.values(allData));
    }

    /**
     * Fetch all ContentItems from storage
     * @returns A promise that resolves to an array of ContentItems
     */
    async fetchAllContentItems(): Promise<ContentItem[]> {
        const allData = this.getAllData();
        return Object.values(allData).flatMap((sidepage) => sidepage.content);
    }

    /**
     * Create a new Sidepage
     * @param sidepage - The Sidepage to create
     */
    createSidepage(
        sidepage: Omit<
            Sidepage,
            "id" | "dateCreated" | "dateModified" | "content"
        >,
    ): Promise<Sidepage> {
        const newSidepage: Sidepage = {
            ...sidepage,
            id: nanoid(),
            dateCreated: new Date().toISOString(),
            dateModified: new Date().toISOString(),
            content: [],
        };

        const allData = this.getAllData();
        allData[newSidepage.id] = newSidepage;
        this.saveAllData(allData);

        return Promise.resolve(newSidepage);
    }

    /**
     * Add a ContentItem to a Sidepage
     * @param sidepageId - The ID of the Sidepage
     * @param contentItem - The ContentItem to add
     */
    addContentToSidepage(
        sidepageId: string,
        contentItem: Omit<ContentItem, "id" | "dateAdded">,
    ): Promise<void> {
        const allData = this.getAllData();
        const sidepage = allData[sidepageId];
        if (!sidepage) {
            throw new Error(`Sidepage not found: ${sidepageId}`);
        }

        const newContentItem: ContentItem = {
            ...(contentItem as ContentItem),
            id: nanoid(),
            dateAdded: new Date().toISOString(),
        };

        sidepage.content.push(newContentItem);
        sidepage.dateModified = new Date().toISOString();
        this.saveAllData(allData);
        return Promise.resolve();
    }

    /**
     * Retrieve a Sidepage from storage
     * @param id - The ID of the Sidepage to retrieve
     */
    getSidepage(id: string): Promise<Sidepage | null> {
        const allData = this.getAllData();
        return Promise.resolve(allData[id] || null);
    }

    /**
     * Retrieve a ContentItem from storage
     * @param sidepageId - The ID of the Sidepage containing the ContentItem
     * @param contentItemId - The ID of the ContentItem to retrieve
     */
    async getContentItem(
        sidepageId: string,
        contentItemId: string,
    ): Promise<ContentItem | null> {
        const sidepage = await this.getSidepage(sidepageId);
        return (
            sidepage?.content.find((item) => item.id === contentItemId) || null
        );
    }

    /**
     * Remove a Sidepage and all its content from storage
     * @param id - The ID of the Sidepage to remove
     */
    removeSidepage(id: string): Promise<void> {
        const allData = this.getAllData();
        delete allData[id];
        this.saveAllData(allData);
        return Promise.resolve();
    }

    /**
     * Remove a ContentItem from a Sidepage
     * @param sidepageId - The ID of the Sidepage containing the ContentItem
     * @param contentItemId - The ID of the ContentItem to remove
     */
    removeContentItem(
        sidepageId: string,
        contentItemId: string,
    ): Promise<void> {
        const allData = this.getAllData();
        const sidepage = allData[sidepageId];
        if (sidepage) {
            sidepage.content = sidepage.content.filter(
                (item) => item.id !== contentItemId,
            );
            sidepage.dateModified = new Date().toISOString();
            this.saveAllData(allData);
        }

        return Promise.resolve();
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
    const [sidepages, setSidepages] = useState<Sidepage[]>([]);

    const fetchSidepages = useCallback(async () => {
        const newSidepages = await aggregator.fetchAllSidepages();
        if (newSidepages.length === 0) {
            const newSidepage = await aggregator.createSidepage({
                title: "New Sidepage",
                creator: "Anonymous",
                sidepoints: [],
            });
            newSidepages.push(newSidepage);
        }
        setSidepages(newSidepages);
    }, [aggregator]);

    useEffect(() => {
        fetchSidepages();
        aggregator.addListener(fetchSidepages);
        return () => aggregator.removeListener(fetchSidepages);
    }, [aggregator, fetchSidepages]);

    return sidepages;
}

/**
 * Custom hook for fetching and updating ContentItems
 */
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

export const aggregator = new SidepageAggregator();
