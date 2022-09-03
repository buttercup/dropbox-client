export type { Stats } from "fs";

export interface DropboxClientConfig {
    compat?: boolean;
    compatPutCorsHack?: boolean;
    headers?: Record<string, string>;
}

export interface DropboxItemResult {
    ".tag": "file" | "folder";
    client_modified?: string;
    content_hash?: string;
    id: string;
    name: string;
    path_display: string;
    size: number;
}

export interface DropboxPathInfo {
    name: string;
    path: string;
    hash?: string;
    modified?: Date;
    type: "file" | "directory";
    id: string;
    size: number;
}
