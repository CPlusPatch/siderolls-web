"use client";

import { env } from "next-runtime-env";
import { useEffect, useState } from "react";
import { BaseClient, type Output } from "./client";

export interface DataRow {
    id: number;
    tags: string[];
    image: string;
    links: string[];
    content: string;
    title: string;
    data: unknown;
    created_at: string;
}

export class Client extends BaseClient {
    constructor() {
        super(
            new URL(env("NEXT_PUBLIC_API_URL") || ""),
            localStorage?.getItem("token") ?? "",
        );
    }

    public getRows(extra?: RequestInit): Promise<Output<DataRow[]>> {
        return this.get<DataRow[]>("/api/v1/rows", extra);
    }

    public getRow(id: string, extra?: RequestInit): Promise<Output<DataRow>> {
        return this.get<DataRow>(`/api/v1/rows/${id}`, extra);
    }

    public createRow(data: Partial<DataRow>, extra?: RequestInit) {
        return this.post<DataRow>("/api/v1/rows", data, extra);
    }

    public editRow(id: string, data: Partial<DataRow>, extra?: RequestInit) {
        return this.put<DataRow>(`/api/v1/rows/${id}`, data, extra);
    }

    public deleteRow(id: string, extra?: RequestInit) {
        return this.delete<DataRow>(`/api/v1/rows/${id}`, extra);
    }
}

// Only load client on the client side
export const useClient = () => {
    const [client, setClient] = useState<Client | null>(null);

    useEffect(() => {
        setClient(new Client());
    }, []);

    return client;
};
