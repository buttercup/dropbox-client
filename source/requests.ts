import { HotPatcher } from "hot-patcher";
import { convertDropboxPathInfo, urlSafeJSONStringify } from "./convert.js";
import { handleBadResponse, RequestConfig } from "./request.js";
import { DropboxClientConfig, DropboxPathInfo } from "./types.js";

const DELETE_URL = "https://api.dropboxapi.com/2/files/delete_v2";
const DIRECTORY_CONTENTS_URL = "https://api.dropboxapi.com/2/files/list_folder";
const DIRECTORY_CREATE_URL = "https://api.dropboxapi.com/2/files/create_folder_v2";
const DOWNLOAD_URL = "https://content.dropboxapi.com/2/files/download";
const METADATA_URL = "https://api.dropboxapi.com/2/files/get_metadata";
const UPLOAD_URL = "https://content.dropboxapi.com/2/files/upload";

const CONTENT_TYPE_CORS_HACK = "text/plain; charset=dropbox-cors-hack";
const CONTENT_TYPE_OCTET_STREAM = "application/octet-stream";

export async function createDirectory(
    directory: string,
    token: string,
    patcher: HotPatcher,
    clientConfig: DropboxClientConfig
): Promise<void> {
    const {
        compat = false,
        headers = {}
    } = clientConfig;
    const config: RequestConfig = {
        method: "POST",
        url: DIRECTORY_CREATE_URL,
        headers: compat ? {
            ...headers,
            "Content-Type": clientConfig.compatCorsHack === false
                ? "application/json"
                : CONTENT_TYPE_CORS_HACK
        } : {
            ...headers,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        query: compat ? {
            authorization: `Bearer ${token}`,
            reject_cors_preflight: "true"
        } : {},
        body: JSON.stringify({
            path: directory,
            autorename: false
        })
    };
    const response = await patcher.execute<Promise<Response>>("request", config);
    handleBadResponse(response);
}

export async function deleteFile(
    filename: string,
    token: string,
    patcher: HotPatcher,
    clientConfig: DropboxClientConfig
): Promise<void> {
    const {
        compat = false,
        headers = {}
    } = clientConfig;
    const config: RequestConfig = {
        method: "POST",
        url: DELETE_URL,
        headers: compat ? {
            ...headers,
            "Content-Type": clientConfig.compatCorsHack === false
                ? "application/json"
                : CONTENT_TYPE_CORS_HACK
        } : {
            ...headers,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        query: compat ? {
            authorization: `Bearer ${token}`,
            reject_cors_preflight: "true"
        } : {},
        body: JSON.stringify({
            path: filename
        })
    };
    const response = await patcher.execute<Promise<Response>>("request", config);
    handleBadResponse(response);
}

export async function getDirectoryContents(
    dirPath: string,
    token: string,
    patcher: HotPatcher,
    clientConfig: DropboxClientConfig
): Promise<Array<DropboxPathInfo>> {
    const {
        compat = false,
        headers = {}
    } = clientConfig;
    const path = dirPath === "/" ? "" : dirPath;
    const config: RequestConfig = {
        method: "POST",
        url: DIRECTORY_CONTENTS_URL,
        headers: compat ? {
            ...headers,
            "Content-Type": clientConfig.compatCorsHack === false
                ? "application/json"
                : CONTENT_TYPE_CORS_HACK
        } : {
            ...headers,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        query: compat ? {
            authorization: `Bearer ${token}`,
            reject_cors_preflight: "true"
        } : {},
        body: JSON.stringify({
            path,
            recursive: false,
            limit: 2000,
            include_media_info: false,
            include_deleted: false,
            include_has_explicit_shared_members: false,
            include_mounted_folders: true
        })
    };
    const response = await patcher.execute<Promise<Response>>("request", config);
    handleBadResponse(response);
    const { entries } = await response.json();
    return entries.map(convertDropboxPathInfo);
}

export async function getFileContents(
    filename: string,
    token: string,
    patcher: HotPatcher,
    clientConfig: DropboxClientConfig
): Promise<string> {
    const {
        compat = false,
        headers = {}
    } = clientConfig;
    const config: RequestConfig = {
        method: "GET",
        url: DOWNLOAD_URL,
        headers: compat ? {
            ...headers
        } : {
            ...headers,
            Authorization: `Bearer ${token}`,
            "Content-Type": "text/plain",
            "Dropbox-API-Arg": urlSafeJSONStringify({
                path: filename
            })
        },
        query: compat ? {
            arg: urlSafeJSONStringify({
                path: filename
            }),
            authorization: `Bearer ${token}`,
            reject_cors_preflight: "true"
        } : {}
    };
    const response = await patcher.execute<Promise<Response>>("request", config);
    handleBadResponse(response);
    const contents = await response.text();
    return contents;
}

export async function getMetadata(
    path: string,
    token: string,
    patcher: HotPatcher,
    clientConfig: DropboxClientConfig
): Promise<DropboxPathInfo> {
    if (!path || path === "/") {
        throw new Error("Reading metadata of root not supported by Dropbox");
    }
    const {
        compat = false,
        headers = {}
    } = clientConfig;
    const config: RequestConfig = {
        method: "POST",
        url: METADATA_URL,
        headers: compat ? {
            ...headers,
            "Content-Type": clientConfig.compatCorsHack === false
                ? "application/json"
                : CONTENT_TYPE_CORS_HACK
        } : {
            ...headers,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        query: compat ? {
            authorization: `Bearer ${token}`,
            reject_cors_preflight: "true"
        } : {},
        body: JSON.stringify({
            path
        })
    };
    const response = await patcher.execute<Promise<Response>>("request", config);
    handleBadResponse(response);
    const payload = await response.json();
    return convertDropboxPathInfo(payload);
}

export async function putFileContents(
    filename: string,
    data: string | Buffer,
    token: string,
    patcher: HotPatcher,
    clientConfig: DropboxClientConfig
): Promise<void> {
    const {
        compat = false,
        headers = {}
    } = clientConfig;
    const config: RequestConfig = {
        method: "POST",
        url: UPLOAD_URL,
        query: {
            arg: JSON.stringify({
                path: filename,
                mode: "overwrite"
            }),
            ...(compat ? {
                authorization: `Bearer ${token}`,
                reject_cors_preflight: "true"
            } : {})
        },
        headers: compat ? {
            ...headers,
            "Content-Type": (clientConfig.compatCorsHack === false || clientConfig.compatPutCorsHack === false)
                ? CONTENT_TYPE_OCTET_STREAM
                : CONTENT_TYPE_CORS_HACK
        } : {
            ...headers,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/octet-stream"
        },
        body: data
    };
    const response = await patcher.execute<Promise<Response>>("request", config);
    handleBadResponse(response);
}
