import HotPatcher from "hot-patcher";
import { request } from "cowl";
import { createDirectory, deleteFile, getDirectoryContents, getFileContents, getMetadata, putFileContents } from "./requests.js";
import { DropboxFSInterface } from "./fs.js";
import { DropboxPathInfo } from "./types.js";

export interface DropboxClientConfig {
    compat?: boolean;
}

export class DropboxClient {
    fs: DropboxFSInterface;
    patcher: HotPatcher = new HotPatcher();
    protected _config: DropboxClientConfig;
    private __token: string;

    constructor(token: string, config: DropboxClientConfig = {}) {
        this.patcher.patch("request", request);
        this.__token = token;
        this._config = config;
        this.fs = new DropboxFSInterface(this);
    }

    async createDirectory(path: string): Promise<void> {
        await createDirectory(path, this.__token, this.patcher, this._config.compat);
    }

    async delete(path: string): Promise<void> {
        await deleteFile(path, this.__token, this.patcher, this._config.compat);
    }

    /**
     * Delete a remote file
     * @deprecated Use `delete` instead
     * @param path The file path to delete
     */
    async deleteFile(path: string): Promise<void> {
        await this.delete(path);
    }

    async getDirectoryContents(path: string): Promise<Array<DropboxPathInfo>> {
        return getDirectoryContents(path, this.__token, this.patcher, this._config.compat);
    }

    async getFileContents(filename: string): Promise<string> {
        return getFileContents(filename, this.__token, this.patcher, this._config.compat);
    }

    async getInfo(path: string): Promise<DropboxPathInfo> {
        return getMetadata(path, this.__token, this.patcher, this._config.compat);
    }

    async putFileContents(filename: string, data: string | Buffer): Promise<void> {
        await putFileContents(filename, data, this.__token, this.patcher, this._config.compat);
    }
}

