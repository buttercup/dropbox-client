const {
    DROPBOX_DOMAIN
} = require("./constants.js");

function generateAuthorisationURL(clientID, redirectURI) {
    const redir = encodeURIComponent(redirectURI);
    return `https://${DROPBOX_DOMAIN}/oauth2/authorize?response_type=token&client_id=${clientID}&redirect_uri=${redir}`;
}

module.exports = {
    generateAuthorisationURL
};
