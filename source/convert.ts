import {
    DropboxPathInfo,
    DropboxItemResult,
    Stats
} from "./types.js";

export function convertDropboxPathInfo(item: DropboxItemResult): DropboxPathInfo {
    const dropboxType = item[".tag"];
    if (/^(file|folder)$/.test(dropboxType) !== true) {
        throw new Error(`Unrecognised item type: ${dropboxType}`);
    }
    const type = dropboxType === "folder" ? "directory" : "file";
    return {
        name: item.name,
        path: item.path_display,
        type,
        id: item.id,
        size: item.size || 0,
        modified: item.client_modified ? new Date(item.client_modified) : undefined,
        hash: item.content_hash ? item.content_hash : undefined
    };
}

export function convertFsStat(item: DropboxItemResult | DropboxPathInfo): Stats {
    const target: DropboxPathInfo = typeof item[".tag"] === "string"
        ? convertDropboxPathInfo(item as DropboxItemResult)
        : item as DropboxPathInfo;
    const notPresent = -1;
    return {
        isBlockDevice: () => false,
        isCharacterDevice: () => false,
        isDirectory: () => item[".tag"] === "folder",
        isFIFO: () => false,
        isFile: () => item[".tag"] === "file",
        isSocket: () => false,
        isSymbolicLink: () => false,
        dev: notPresent,
        ino: notPresent,
        mode: notPresent,
        nlink: 0,
        uid: notPresent,
        gid: notPresent,
        rdev: notPresent,
        size: item.size || 0,
        blksize: notPresent,
        blocks: notPresent,
        atimeMs: notPresent,
        mtimeMs: target.modified ? target.modified.getTime() : null,
        ctimeMs: notPresent,
        birthtimeMs: notPresent,
        atime: null,
        mtime: target.modified ? target.modified : null,
        ctime: null,
        birthtime: null
    };
}

export function urlSafeJSONStringify(obj: { [key: string]: any; }): string {
    const encodeRange = /[\u007f-\uffff]/g;
    return JSON.stringify(obj).replace(encodeRange, char => {
        const encoded = `000${char.charCodeAt(0).toString(16)}`.slice(-4);
        return `\\u${encoded}`;
    });
}
