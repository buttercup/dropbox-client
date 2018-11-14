const axios = require("axios");
const { convertDirectoryResult } = require("./convert.js");

const DIRECTORY_CONTENTS_URL = "https://api.dropboxapi.com/2/files/list_folder";
const DOWNLOAD_URL = "https://content.dropboxapi.com/2/files/download";
const UPLOAD_URL = "https://content.dropboxapi.com/2/files/upload";

function downloadFile(filename, token) {
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

function handleResponse(response) {
    if (response.status < 200 || response.status >= 300) {
        throw new Error(`Invalid response: ${response.status} ${response.statusText}`);
    }
    return response;
}

downloadFile("/Personal/project_codenames.txt", "").then(contents => {
    console.log("C", contents);
}).catch(err => {
    console.error(err);
});

// export function getArchiveContents(filePath, token) {
//     const fetchOptions = {
//         method: "POST",
//         headers: {
//             Authorization: `Bearer ${token}`,
//             "Dropbox-API-Arg": JSON.stringify({
//                 path: filePath
//             })
//         }
//     };
//     return smartFetch(DOWNLOAD_URL, fetchOptions).then(res => res.text());
// }

// export function putArchiveContents(filePath, textContents, token) {
//     const buff = new Buffer(textContents, "utf8");
//     const fetchOptions = {
//         method: "POST",
//         headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/octet-stream",
//             "Dropbox-API-Arg": JSON.stringify({
//                 path: filePath,
//                 mode: "overwrite"
//             })
//         },
//         body: buff
//     };
//     return smartFetch(UPLOAD_URL, fetchOptions);
// }
