const { getDirectoryContents, getFileContents, putFileContents } = require("./requests.js");

function createClient(token) {
    return {
        getDirectoryContents: path => getDirectoryContents(path, token),
        getFileContents: path => getFileContents(path, token),
        putFileContents: (path, data) => putFileContents(path, data, token)
    };
};

module.exports = {
    createClient
};
