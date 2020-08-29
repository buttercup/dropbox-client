# Dropbox Client changelog

## v0.5.0
_2020-08-29_

 * Upgrade `cowl` - remove `buffer` dependency

## v0.4.0
_2019-09-22_

 * `deleteFile` method
 * `unlink` fs method

## v0.3.3
_2019-09-15_

 * **Bugfix**:
   * ([#3](https://github.com/buttercup/dropbox-client/issues/3)) Unicode files would throw an error when using `getFileContents`

## v0.3.2
_2019-07-23_

 * Set `Content-Type` header to `application/octet-stream` only for PUT requests

## v0.3.1
_2019-07-22_

 * Upgrade `cowl` for better browser compatibility

## v0.3.0
_2019-07-19_

 * `cowl` upgrade for better error handling

## v0.2.1
_2019-07-17_

 * **Bugfix**:
   * Fix `URL` usage for `query` option in browser environments

## v0.2.0
_2019-07-16_

 * Replace `axios` with `cowl` for HTTP requests

## v0.1.1
_2018-11-15_

 * Initial release
