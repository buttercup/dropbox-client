# Dropbox Client
> Dropbox client library for Buttercup

[![Buttercup](https://cdn.rawgit.com/buttercup-pw/buttercup-assets/6582a033/badge/buttercup-slim.svg)](https://buttercup.pw) [![npm version](https://badge.fury.io/js/%40buttercup%2Fdropbox-client.svg)](https://www.npmjs.com/package/@buttercup/dropbox-client) ![Tests status](https://github.com/buttercup/dropbox-client/actions/workflows/test.yml/badge.svg)

## About

Dropbox is an integral part of the Buttercup platform as it's used by a huge amount of users to store all kinds of data - including Buttercup vault files. Having a functional, portable and reliable Dropbox client interface is critical to the platform's stability, and currently the official Dropbox SDK is lacking in terms of quality and stability.

This library is a barebones HTTP client that makes requests directly to Dropbox's HTTP API using a token (handled externally - this library will not be responsible for fetching them). The result is a tiny, portable script that is reliable and simple to understand. It uses [cowl](https://github.com/perry-mitchell/cowl) to perform requests, which is designed to work similarly across multiple platforms.

## Installation

Simply run `npm install @buttercup/dropbox-client --save` to install.

## Usage

### Authorisation

You can generate Dropbox authorisation URLs by using `generateAuthorisationURL`:

```javascript
const { generateAuthorisationURL } = require("@buttercup/dropbox-client");

const url = generateAuthorisationURL("client-id", "https://redir.example.com");
// open `url`
```

### Client

Use the `DropboxClient` class to create a client interface:

```typescript
const { DropboxClient } = require("@buttercup/dropbox-client");

const client = new DropboxClient("my-token");
```

You can then use the `client` adapter to make requests like for directory contents:

```typescript
client
    .getDirectoryContents("/Documents")
    .then(contents => {
        // [ {
        //     name: "My directory",
        //     path: "/Documents/My directory",
        //     type: "directory"
        // }, {
        //     name: "results.pdf",
        //     path: "/Documents/results.pdf",
        //     type: "file"
        // } ]
    });
```

You can also read and write files using `getFileContents` and `putFileContents`, respectively.

### Compatibility Mode

You can enable compatibility mode for browser-based environments where CORS may break requests:

```typescript
const client = new DropboxClient("my-token", { compat: true });
```

### Custom Headers

You can provide custom headers to all the requests the client makes by specifying the `headers` option:

```typescript
const client = new DropboxClient("my-token", {
    headers: {
        // Disable the cache (works/necessary in some environments)
        "Cache-Control": "no-cache, no-store, max-age=0"
    }
});
```

### Fs

An `fs`-like interface is also available:

```typescript
const { DropboxClient } = require("@buttercup/dropbox-client");

const client = new DropboxClient("my-token");

client.fs.readdir("/photos", (err, items) => {
    // array of file names
});
```
