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
                    callback(null, items.map(item => mode === "node"
                        ? item => item.name
                        : item => Object.assign(item, {
                            isFile: () => item.type === "file",
                            isDirectory: () => item.type === "directory"
                        })
                    ));
                })
                .catch(cb);
        },
        readFile: (remotePath, options = { encoding: null }, callback) => {
            let cb = callback;
            if (typeof options === "function") {
                cb = options;
            }

        }
    };
}

module.exports = {
    createFsInterface
};
