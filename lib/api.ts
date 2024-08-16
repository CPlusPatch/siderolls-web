import { env } from "next-runtime-env";
import { useMemo } from "react";
import useSWR from "swr";

export interface DataRow {
    id: number;
    tags: string[];
    banner_image: string;
    links: string[];
    content: string;
    title: string;
    created_at: string;
}

interface ApiConfig {
    baseUrl: string;
}

// API client
const createApiClient = (config: ApiConfig) => {
    const fetchJson = async <T>(url: string): Promise<T> => {
        const response = await fetch(`${config.baseUrl}${url}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    };

    const postJson = async <T, R>(url: string, data: T): Promise<R> => {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("No token found in localStorage");
        }

        const response = await fetch(`${config.baseUrl}${url}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    };

    return {
        getAllRows: () => fetchJson<DataRow[]>("/api/v1/rows"),
        getRowById: (id: string) => fetchJson<DataRow>(`/api/v1/rows/${id}`),
        createRow: (data: Omit<DataRow, "id" | "created_at">) =>
            postJson<Omit<DataRow, "id" | "created_at">, DataRow>(
                "/api/v1/rows",
                data,
            ),
    };
};

// Custom hook for API interactions
export const useApi = () => {
    const apiUrl = env("NEXT_PUBLIC_API_URL");

    if (!apiUrl) {
        throw new TypeError(
            "The NEXT_PUBLIC_API_URL environment variable is not set.",
        );
    }

    const apiClient = useMemo(
        () =>
            createApiClient({
                baseUrl: apiUrl,
            }),
        [apiUrl],
    );

    return {
        // biome-ignore lint/correctness/useHookAtTopLevel: Biome is incorrect here
        useGetAllRows: () => useSWR("rows", apiClient.getAllRows),
        useGetRowById: (id: string) =>
            // biome-ignore lint/correctness/useHookAtTopLevel: Biome is incorrect here
            useSWR(["row", id], () => apiClient.getRowById(id)),
        createRow: (data: Omit<DataRow, "id" | "created_at">) =>
            apiClient.createRow(data),
    };
};
