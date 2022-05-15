import HotPatcher from "hot-patcher";
import { convertDropboxPathInfo, urlSafeJSONStringify } from "./convert.js";
import { DropboxPathInfo } from "./types.js";

const DELETE_URL = "https://api.dropboxapi.com/2/files/delete_v2";
const DIRECTORY_CONTENTS_URL = "https://api.dropboxapi.com/2/files/list_folder";
const DIRECTORY_CREATE_URL = "https://api.dropboxapi.com/2/files/create_folder_v2";
const DOWNLOAD_URL = "https://content.dropboxapi.com/2/files/download";
const METADATA_URL = "https://api.dropboxapi.com/2/files/get_metadata";
const UPLOAD_URL = "https://content.dropboxapi.com/2/files/upload";

export async function createDirectory(
    directory: string,
    token: string,
    patcher: HotPatcher,
    compat: boolean = false
): Promise<void> {
    const config = {
        method: "POST",
        url: DIRECTORY_CREATE_URL,
        headers: compat ? {
            "Content-Type": "text/plain; charset=dropbox-cors-hack"
        } : {
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
    await patcher.execute("request", config);
}

export async function deleteFile(
    filename: string,
    token: string,
    patcher: HotPatcher,
    compat: boolean = false
): Promise<void> {
    const config = {
        method: "POST",
        url: DELETE_URL,
        headers: compat ? {
            "Content-Type": "text/plain; charset=dropbox-cors-hack"
        } : {
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
    await patcher.execute("request", config);
}

export async function getDirectoryContents(
    dirPath: string,
    token: string,
    patcher: HotPatcher,
    compat: boolean = false
): Promise<Array<DropboxPathInfo>> {
    const path = dirPath === "/" ? "" : dirPath;
    const config = {
        method: "POST",
        url: DIRECTORY_CONTENTS_URL,
        headers: compat ? {
            "Content-Type": "text/plain; charset=dropbox-cors-hack"
        } : {
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
    const response = await patcher.execute("request", config);
    const { entries } = response.data;
    return entries.map(convertDropboxPathInfo);
}

export async function getFileContents(
    filename: string,
    token: string,
    patcher: HotPatcher,
    compat: boolean = false
): Promise<string> {
    const config = {
        method: "GET",
        url: DOWNLOAD_URL,
        headers: compat ? {} : {
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
    const response = await patcher.execute("request", config);
    return response.data;
}

export async function getMetadata(
    path: string,
    token: string,
    patcher: HotPatcher,
    compat: boolean = false
): Promise<DropboxPathInfo> {
    if (!path || path === "/") {
        throw new Error("Reading metadata of root not supported by Dropbox");
    }
    const config = {
        method: "POST",
        url: METADATA_URL,
        headers: compat ? {
            "Content-Type": "text/plain; charset=dropbox-cors-hack"
        } : {
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
    const response = await patcher.execute("request", config);
    return convertDropboxPathInfo(response.data);
}

export async function putFileContents(filename: string, data: string | Buffer, token: string, patcher: HotPatcher): Promise<void> {
    const config = {
        method: "POST",
        url: UPLOAD_URL,
        query: {
            arg: JSON.stringify({
                path: filename,
                mode: "overwrite"
            }),
            authorization: `Bearer ${token}`,
            reject_cors_preflight: "true"
        },
        headers: {
            "Content-Type": "application/octet-stream"
        },
        body: data
    };
    await patcher.execute("request", config);
}
