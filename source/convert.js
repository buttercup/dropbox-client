/**
 * @typedef {Object} DirectoryResult
 * @property {String} name The file name
 * @property {String} path The parent path of the item
 * @property {String} type Either "file" or "directory"
 * @property {String} id The Dropbox item ID
 * @property {Number} size The size of the item
 */

/**
 * @typedef {Object} DropboxItemResult
 * @property {String} name Item name
 * @property {String} path_display Item containing path
 * @property {String} ".tag" The item type
 * @property {String} id The Dropbox item ID
 * @property {Number} size The item size
 */

 /**
  * Convert a Dropbox result item to a common format
  * @param {DropboxItemResult} item
  * @returns {DirectoryResult}
  */
function convertDirectoryResult(item) {
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
        size: item.size || 0
    };
}

function urlSafeJSONStringify(obj) {
    const encodeRange = /[\u007f-\uffff]/g;
    return JSON.stringify(obj).replace(encodeRange, char => {
        const encoded = `000${char.charCodeAt(0).toString(16)}`.slice(-4);
        return `\\u${encoded}`;
    });
}

module.exports = {
    convertDirectoryResult,
    urlSafeJSONStringify
};
