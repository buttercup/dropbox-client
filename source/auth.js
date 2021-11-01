const {
    DROPBOX_DOMAIN
} = require("./constants.js");

/**
 * Generate a Dropbox authorisation URL
 * @param {String} clientID The OAuth2 client ID
 * @param {String} redirectURI The redirect URI
 * @returns {String} The authorisation URL
 */
function generateAuthorisationURL(clientID, redirectURI) {
    const redir = encodeURIComponent(redirectURI);
    return `https://${DROPBOX_DOMAIN}/oauth2/authorize?response_type=token&client_id=${clientID}&redirect_uri=${redir}`;
}

module.exports = {
    generateAuthorisationURL
};
