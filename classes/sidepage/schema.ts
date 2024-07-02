export interface Sidepage {
    id: string;
    title: string;
    description?: string;
    creator: string;
    dateCreated: string;
    dateModified: string;
    sidepoints: string[]; // URIs where this sidepage is pinned
    content: ContentItem[];
    parentId?: string; // ID of the parent sidepage, if any
}

export type ContentItem =
    | Link
    | Media
    | Article
    | Website
    | Citation
    | CustomContent
    | NestedSidepage;

export interface BaseContent {
    id: string;
    type: string;
    title: string;
    description?: string;
    dateAdded: string;
    tags?: string[];
}

export interface Link extends BaseContent {
    type: "link";
    url: string;
    pageTitle?: string;
    image?: string;
}

export interface Media extends BaseContent {
    type: "media";
    url: string;
    mediaType: "image" | "video" | "audio";
    format: string; // e.g., 'jpg', 'mp4', 'mp3'
}

export interface Video extends Media {
    mediaType: "video";
    thumbnail?: string;
}

export interface Article extends BaseContent {
    type: "article";
    url: string;
    author: string;
    publishDate: string;
    publisher?: string;
}

export interface Website extends BaseContent {
    type: "website";
    url: string;
    favicon?: string;
}

export interface Citation extends BaseContent {
    type: "citation";
    source: string;
    author: string;
    publishDate: string;
    doi?: string; // Digital Object Identifier
}

export interface CustomContent extends BaseContent {
    type: "custom";
    // biome-ignore lint/suspicious/noExplicitAny: This is the proper standardized way to allow for custom properties
    [key: string]: any; // Allow for additional custom properties
}

export interface NestedSidepage extends BaseContent {
    type: "sidepage";
    sidepageId: string; // Reference to the full sidepage
}
