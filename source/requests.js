const { convertDirectoryResult, urlSafeJSONStringify } = require("./convert.js");

const DELETE_URL = "https://api.dropboxapi.com/2/files/delete_v2";
const DIRECTORY_CONTENTS_URL = "https://api.dropboxapi.com/2/files/list_folder";
const DOWNLOAD_URL = "https://content.dropboxapi.com/2/files/download";
const UPLOAD_URL = "https://content.dropboxapi.com/2/files/upload";

function deleteFile(filename, token, patcher) {
    const config = {
        method: "POST",
        url: DELETE_URL,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: {
            path: filename
        }
    };
    return patcher.execute("request", config)
        .then(() => {});
}

function getDirectoryContents(dirPath, token, patcher) {
    const path = dirPath === "/" ? "" : dirPath;
    const config = {
        method: "POST",
        url: DIRECTORY_CONTENTS_URL,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: {
            path,
            recursive: false,
            limit: 2000,
            include_media_info: false,
            include_deleted: false,
            include_has_explicit_shared_members: false,
            include_mounted_folders: true
        }
    };
    return patcher.execute("request", config)
        .then(response => {
            const { entries } = response.data;
            return entries.map(convertDirectoryResult);
        });
}

function getFileContents(filename, token, patcher) {
    const config = {
        method: "POST",
        url: DOWNLOAD_URL,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "text/plain",
            "Dropbox-API-Arg": urlSafeJSONStringify({
                path: filename
            })
        }
    };
    return patcher.execute("request", config)
        .then(response => response.data);
}

function putFileContents(filename, data, token, patcher) {
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
    return patcher.execute("request", config)
        .then(() => {})
}

module.exports = {
    deleteFile,
    getDirectoryContents,
    getFileContents,
    putFileContents
};
