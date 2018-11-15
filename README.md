# Dropbox Client
> Dropbox client library for Buttercup

[![Build Status](https://travis-ci.org/buttercup/dropbox-client.svg?branch=master)](https://travis-ci.org/buttercup/dropbox-client)

## About

Dropbox is an integral part of the Buttercup platform as it's used by a huge amount of users to store all kinds of data - including Buttercup vault files. Having a functional, portable and reliable Dropbox client interface is critical to the platform's stability, and currently the official Dropbox SDK is lacking in terms of quality and stability.

This library is a barebones HTTP client that makes requests directly to Dropbox's HTTP API using a token (handled externally - this library will not be responsible for fetching them). The result is a tiny, portable script that is reliable and simple to understand. It uses [axios](https://github.com/axios/axios) to perform requests, which has been proven to be a stable cross-platform library perfect for this purpose.

## Installation

Simply run `npm install @buttercup/dropbox-client --save` to install.

## Usage

Use the `createClient` method to create a client interface:

```javascript
const { createClient } = require("@buttercup/dropbox-client");

const client = createClient("my-token");
```

You can then use the `client` adapter to make requests like for directory contents:

```javascript
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

You can also read and write files using `getFileContents` and `putFileContents`, respectively. Check out the [API documentation](API.md) for more information.
