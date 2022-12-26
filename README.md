# Dropbox Client
> Dropbox client library for Buttercup

[![Buttercup](https://cdn.rawgit.com/buttercup-pw/buttercup-assets/6582a033/badge/buttercup-slim.svg)](https://buttercup.pw) [![npm version](https://badge.fury.io/js/%40buttercup%2Fdropbox-client.svg)](https://www.npmjs.com/package/@buttercup/dropbox-client) ![Tests status](https://github.com/buttercup/dropbox-client/actions/workflows/test.yml/badge.svg)

## About

Dropbox is an integral part of the Buttercup platform as it's used by a huge amount of users to store all kinds of data - including Buttercup vault files. Having a functional, portable and reliable Dropbox client interface is critical to the platform's stability, and currently the official Dropbox SDK is lacking in terms of quality and stability.

This library is a barebones HTTP client that makes requests directly to Dropbox's HTTP API using a token (handled externally - this library will not be responsible for fetching them). The result is a tiny, portable script that is reliable and simple to understand. It uses `fetch` ([cross-fetch](https://github.com/lquixada/cross-fetch)) to perform requests, which will obviously work in a reproducible fassion across environments.

## Installation

Simply run `npm install @buttercup/dropbox-client --save` to install.

The latest version (v2) requires an [ESM](https://nodejs.org/api/esm.html) environment to run. It is not available to standard CommonJS projects.

## Usage

### Authorisation

You can generate Dropbox authorisation URLs by using `generateAuthorisationURL`:

```typescript
import { generateAuthorisationURL } from "@buttercup/dropbox-client";

const url = generateAuthorisationURL("client-id", "https://redir.example.com");
// open `url`
```

### Client

Use the `DropboxClient` class to create a client interface:

```typescript
import { generateAuthorisationURL } from "@buttercup/dropbox-client";

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

In some browser environments the "CORS hack" Content-Type header can fail, so this can be disabled by specifying `false` for the `compatCorsHack` property:

```typescript
const client = new DropboxClient("my-token", {
    compat: true,
    compatCorsHack: false
});
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
import { generateAuthorisationURL } from "@buttercup/dropbox-client";

const client = new DropboxClient("my-token");

client.fs.readdir("/photos", (err, items) => {
    // array of file names
});
```

### Error Handling

Errors while performing requests against the Dropbox API will be thrown wrapped in a [`Layerr`](https://github.com/perry-mitchell/layerr) error instance. It provides some extra properties with each error:

```typescript
import { Layerr } from "layerr";

// ...

client.getDirectoryContents("/").catch((err) => {
    const {
        status,
        statusText,
        url
    } = Layerr.info(err);

    if (status === 403) {
        // ...
    }
});
```
