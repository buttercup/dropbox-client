/**
 * @typedef {Object} DirectoryResult
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
        id: item.id
    };
}

module.exports = {
    convertDirectoryResult
};
