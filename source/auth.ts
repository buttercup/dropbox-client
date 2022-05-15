import { DROPBOX_DOMAIN } from "./constants.js";

/**
 * Generate a Dropbox authorisation URL
 * @param clientID The OAuth2 client ID
 * @param redirectURI The redirect URI
 * @returns The authorisation URL
 */
export function generateAuthorisationURL(clientID: string, redirectURI: string): string {
    const redir = encodeURIComponent(redirectURI);
    return `https://${DROPBOX_DOMAIN}/oauth2/authorize?response_type=token&client_id=${clientID}&redirect_uri=${redir}`;
}
