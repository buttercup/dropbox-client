/**
 * Create an fs-like adapter from a base adapter instance
 * @param {DropboxClientAdapter} adapter The base adapter instance
 * @returns {DropboxClientFsAdapter} An fs-like adapter instance
 */
function createFsInterface(adapter) {
    /**
     * @class DropboxClientFsAdapter
     */
    return {
        /**
         * Read the contents of a directory
         * @param {String} remotePath The remote directory
         * @param {Object=} options (Not in use)
         * @param {Function} callback The callback to execute with the results or error
         * @memberof DropboxClientFsAdapter
         */
        readdir: (remotePath, options = {}, callback) => {
            let cb = callback,
                ops = options;
            if (typeof options === "function") {
                cb = options;
                ops = {};
            }
            const mode = ops.mode || "node";
            adapter
                .getDirectoryContents(remotePath)
                .then(items => {
                    if (/^(node|stat)$/.test(mode) === false) {
                        throw new Error(`Invalid mode: ${mode}`);
                    }
                    cb(null, items.map(item => mode === "node"
                        ? item.name
                        : Object.assign(item, {
                            isFile: () => item.type === "file",
                            isDirectory: () => item.type === "directory"
                        })
                    ));
                })
                .catch(cb);
        },
        /**
         * Read the contents of a file
         * @param {String} remotePath The remote file path
         * @param {Object=} options (Not in use)
         * @param {Function} callback The callback to execute with the results or error
         * @memberof DropboxClientFsAdapter
         */
        readFile: (remotePath, options = {}, callback) => {
            let cb = callback;
            if (typeof options === "function") {
                cb = options;
            }
            adapter
                .getFileContents(remotePath)
                .then(content => cb(null, content))
                .catch(cb);
        },
        /**
         * Write to a remote file
         * @param {String} remotePath The remote file path
         * @param {String|Buffer} data The data to write
         * @param {Object=} options (Not in use)
         * @param {Function} callback The callback to execute, possibly with an error
         * @memberof DropboxClientFsAdapter
         */
        writeFile: (remotePath, data, options = {}, callback) => {
            let cb = callback;
            if (typeof options === "function") {
                cb = options;
            }
            adapter
                .putFileContents(remotePath, data)
                .then(() => cb())
                .catch(cb);
        },

        /**
         * Delete a remote file
         * @param {String} remotePath The remote file path
         * @param {Function} callback The callback to execute, possibly with an error
         * @memberof DropboxClientFsAdapter
         */
        unlink: (remotePath, callback) => {
            adapter.deleteFile(remotePath)
                .then(callback, callback);
        }
    };
}

module.exports = {
    createFsInterface
};
