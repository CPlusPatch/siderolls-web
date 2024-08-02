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

    return {
        getAllRows: () => fetchJson<DataRow[]>("/api/v1/rows"),
        getRowById: (id: string) => fetchJson<DataRow>(`/api/rows/${id}`),
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
    };
};
