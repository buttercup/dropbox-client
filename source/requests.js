const axios = require("axios");
const { convertDirectoryResult } = require("./convert.js");

const DIRECTORY_CONTENTS_URL = "https://api.dropboxapi.com/2/files/list_folder";
const DOWNLOAD_URL = "https://content.dropboxapi.com/2/files/download";
const UPLOAD_URL = "https://content.dropboxapi.com/2/files/upload";

function getDirectoryContents(dirPath, token) {
    const path = dirPath === "/" ? "" : dirPath;
    const config = {
        method: "POST",
        url: DIRECTORY_CONTENTS_URL,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        data: {
            path,
            recursive: false,
            limit: 2000,
            include_media_info: false,
            include_deleted: false,
            include_has_explicit_shared_members: false,
            include_mounted_folders: true
        }
    };
    return axios(config)
        .then(handleResponse)
        .then(response => {
            const { entries } = response.data;
            return entries.map(convertDirectoryResult);
        });
}

function getFileContents(filename, token) {
    const config = {
        method: "POST",
        url: DOWNLOAD_URL,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "text/plain",
            "Dropbox-API-Arg": JSON.stringify({
                path: filename
            })
        }
    };
    return axios(config)
        .then(handleResponse)
        .then(response => response.data);
}

function handleResponse(response) {
    if (response.status < 200 || response.status >= 300) {
        throw new Error(`Invalid response: ${response.status} ${response.statusText}`);
    }
    return response;
}

function putFileContents(filename, data, token) {
    const config = {
        method: "POST",
        url: UPLOAD_URL,
        params: {
            arg: JSON.stringify({
                path: filename,
                mode: "overwrite"
            }),
            authorization: `Bearer ${token}`,
            reject_cors_preflight: "true"
        },
        headers: {
            "Content-Type": typeof data === "string"
                ? "text/plain; charset=dropbox-cors-hack"
                : "application/octet-stream"
        },
        data
    };
    return axios(config)
        .then(handleResponse)
        .then(() => {})
}
