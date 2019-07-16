const HotPatcher = require("hot-patcher");
const { request } = require("cowl");
const { getDirectoryContents, getFileContents, putFileContents } = require("./requests.js");
const { createFsInterface } = require("./fs.js");

/**
 * Create a new Dropbox client adapter using a token
 * @param {String} token The dropbox token
 * @returns {DropboxClientAdapter}
 */
function createClient(token) {
    const patcher = new HotPatcher();
    patcher.patch("request", request);
    /**
     * @class DropboxClientAdapter
     */
    return {
        /**
         * @type {Function}
         * @memberof DropboxClientAdapter
         * @see https://github.com/perry-mitchell/cowl
         */
        request,
        /**
         * @type {HotPatcher}
         * @memberof DropboxClientAdapter
         */
        patcher,
        /**
         * Get the directory contents of a remote path
         * @param {String} path The remote path
         * @returns {Promise.<Array.<DirectoryResult>>} A promise that resolves with directory results
         * @memberof DropboxClientAdapter
         */
        getDirectoryContents: path => getDirectoryContents(path, token, patcher),
        /**
         * Get the contents of a remote file
         * @param {String} path The remote path
         * @returns {Promise.<String>} A promise that resolves with the text contents of the remote
         *  file
         * @memberof DropboxClientAdapter
         */
        getFileContents: path => getFileContents(path, token, patcher),
        /**
         * Put contents to a remote file
         * @param {String} path The remote path to write to
         * @param {String|Buffer} data The file data to write
         * @returns {Promise} A promise that resolves when writing has been completed
         * @memberof DropboxClientAdapter
         */
        putFileContents: (path, data) => putFileContents(path, data, token, patcher)
    };
};

module.exports = {
    createClient,
    createFsInterface
};
