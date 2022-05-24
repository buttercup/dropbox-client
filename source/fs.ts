import { DropboxClient } from "./client.js";
import { convertFsStat } from "./convert.js";
import { Stats } from "./types.js";

export class DropboxFSInterface {
    protected _adapter: DropboxClient;

    constructor(adapter: DropboxClient) {
        this._adapter = adapter;
    }

    mkdir(
        remotePath: string,
        optionsOrCallback?: (err: Error | null) => void | {},
        callback?: (err: Error | null) => void
    ): void {
        let cb = optionsOrCallback;
        if (typeof optionsOrCallback !== "function") {
            cb = callback;
            console.warn("Options not supported for Dropbox mkdir");
        }
        this._adapter
            .createDirectory(remotePath)
            .then(() => cb(null))
            .catch(cb);
    }

    readdir(
        remotePath: string,
        optionsOrCallback?: (err: Error | null, items?: Array<string>) => void | {},
        callback?: (err: Error | null, items?: Array<string>) => void
    ): void {
        let cb = optionsOrCallback;
        if (typeof optionsOrCallback !== "function") {
            cb = callback;
            console.warn("Options not supported for Dropbox readdir");
        }
        this._adapter
            .getDirectoryContents(remotePath)
            .then(items => {
                cb(null, items.map(item => item.name));
            })
            .catch(cb);
    }

    readFile(
        remotePath: string,
        optionsOrCallback?: (err: Error | null, data?: string) => void | {},
        callback?: (err: Error | null, data?: string) => void
    ): void {
        let cb = optionsOrCallback;
        if (typeof optionsOrCallback !== "function") {
            cb = callback;
            console.warn("Options not supported for Dropbox readFile");
        }
        this._adapter
            .getFileContents(remotePath)
            .then(content => cb(null, content))
            .catch(cb);
    }

    stat(
        remotePath: string,
        optionsOrCallback?: (err: Error | null, stat?: Stats) => void | {},
        callback?: (err: Error | null, stat?: Stats) => void
    ): void {
        let cb = optionsOrCallback;
        if (typeof optionsOrCallback !== "function") {
            cb = callback;
            console.warn("Options not supported for Dropbox stat");
        }
        this._adapter
            .getInfo(remotePath)
            .then(info => cb(null, convertFsStat(info)))
            .catch(cb);
    }

    unlink(remotePath: string, callback: (err: Error | null) => void): void {
        this._adapter
            .deleteFile(remotePath)
            .then(() => callback(null), callback);
    }
}
