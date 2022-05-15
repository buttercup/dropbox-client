import HotPatcher from "hot-patcher";
import { request } from "cowl";
import { createDirectory, deleteFile, getDirectoryContents, getFileContents, getMetadata, putFileContents } from "./requests.js";
import { DropboxFSInterface } from "./fs.js";
import { DropboxPathInfo } from "./types.js";

export class DropboxClient {
    fs: DropboxFSInterface;
    patcher: HotPatcher = new HotPatcher();
    private __token: string;

    constructor(token: string) {
        this.patcher.patch("request", request);
        this.__token = token;
        this.fs = new DropboxFSInterface(this);
    }

    async createDirectory(path: string): Promise<void> {
        await createDirectory(path, this.__token, this.patcher);
    }

    async delete(path: string): Promise<void> {
        await deleteFile(path, this.__token, this.patcher);
    }

    /**
     * Delete a remote file
     * @deprecated Use `delete` instead
     * @param path The file path to delete
     */
    async deleteFile(path: string): Promise<void> {
        await deleteFile(path, this.__token, this.patcher);
    }

    async getDirectoryContents(path: string): Promise<Array<DropboxPathInfo>> {
        return getDirectoryContents(path, this.__token, this.patcher);
    }

    async getFileContents(filename: string): Promise<string> {
        return getFileContents(filename, this.__token, this.patcher);
    }

    async getInfo(path: string): Promise<DropboxPathInfo> {
        return getMetadata(path, this.__token, this.patcher);
    }

    async putFileContents(filename: string, data: string | Buffer): Promise<void> {
        await putFileContents(filename, data, this.__token, this.patcher);
    }
}

