const { expect } = require("chai");
const sinon = require("sinon");
const nested = require("nested-property");
const { DropboxClient } = require("../../dist/client.js");

const DIRECTORY_CONTENTS_RESPONSE = require("../resources/directory-contents.response.json");
const DIRECTORY_INFO_RESPONSE = require("../resources/metadata-directory.response.json");
const FILE_INFO_RESPONSE = require("../resources/metadata-file.response.json");

const TOKEN = "abc123";

describe("DropboxClient", function() {
    beforeEach(function() {
        this.request = sinon.stub().callsFake(async () => ({
            data: {}
        }));
    });

    [
        [{}, {
            authPath: "headers.Authorization",
            contentType: "application/json",
            fileContentsPath: "headers.Dropbox-API-Arg"
        }],
        [{ compat: true }, {
            authPath: "query.authorization",
            contentType: "text/plain; charset=dropbox-cors-hack",
            fileContentsPath: "query.arg"
        }]
    ].forEach(([config, { authPath, contentType, fileContentsPath }]) => {
        describe(`using config: ${JSON.stringify(config)}`, function() {
            beforeEach(function() {
                this.client = new DropboxClient(TOKEN, config);
                this.client.patcher.patch("request", (...args) => this.request(...args));
            });

            describe("createDirectory", function() {
                it("specifies the correct URL", async function() {
                    await this.client.createDirectory("/test directory");
                    const [config] = this.request.firstCall.args;
                    expect(config).to.have.property("url").that.matches(/files\/create_folder_v2$/);
                });

                it("specifies the correct method", async function() {
                    await this.client.createDirectory("/test directory");
                    const [config] = this.request.firstCall.args;
                    expect(config).to.have.property("method", "POST");
                });

                it("specifies the content-type", async function() {
                    await this.client.createDirectory("/test directory");
                    const [config] = this.request.firstCall.args;
                    expect(config).to.have.nested.property("headers.Content-Type", contentType);
                });

                it("specifies the correct path", async function() {
                    await this.client.createDirectory("/test directory");
                    const [config] = this.request.firstCall.args;
                    const body = JSON.parse(config.body);
                    expect(body).to.have.property("path").that.equals("/test directory");
                });

                it("provides authorisation", async function() {
                    await this.client.createDirectory("/test directory");
                    const [config] = this.request.firstCall.args;
                    expect(config).to.have.nested.property(authPath, `Bearer ${TOKEN}`);
                });
            });

            describe("delete", function() {
                it("specifies the correct URL", async function() {
                    await this.client.delete("/test.txt");
                    const [config] = this.request.firstCall.args;
                    expect(config).to.have.property("url").that.matches(/files\/delete_v2$/);
                });

                it("specifies the correct method", async function() {
                    await this.client.delete("/test.txt");
                    const [config] = this.request.firstCall.args;
                    expect(config).to.have.property("method", "POST");
                });

                it("specifies the content-type", async function() {
                    await this.client.createDirectory("/test directory");
                    const [config] = this.request.firstCall.args;
                    expect(config).to.have.nested.property("headers.Content-Type", contentType);
                });

                it("provides authorisation", async function() {
                    await this.client.delete("/test.txt");
                    const [config] = this.request.firstCall.args;
                    expect(config).to.have.nested.property(authPath, `Bearer ${TOKEN}`);
                });

                it("specifies the correct path", async function() {
                    await this.client.delete("/test.txt");
                    const [config] = this.request.firstCall.args;
                    const body = JSON.parse(config.body);
                    expect(body).to.have.property("path").that.equals("/test.txt");
                });
            });

            describe("getDirectoryContents", function() {
                beforeEach(function() {
                    this.request.callsFake(async () => ({
                        data: DIRECTORY_CONTENTS_RESPONSE
                    }));
                });

                it("specifies the correct URL", async function() {
                    await this.client.getDirectoryContents("/testing");
                    const [config] = this.request.firstCall.args;
                    expect(config).to.have.property("url").that.matches(/files\/list_folder$/);
                });

                it("specifies the correct method", async function() {
                    await this.client.getDirectoryContents("/testing");
                    const [config] = this.request.firstCall.args;
                    expect(config).to.have.property("method", "POST");
                });

                it("specifies the content-type", async function() {
                    await this.client.getDirectoryContents("/testing");
                    const [config] = this.request.firstCall.args;
                    expect(config).to.have.nested.property("headers.Content-Type", contentType);
                });

                it("provides authorisation", async function() {
                    await this.client.getDirectoryContents("/testing");
                    const [config] = this.request.firstCall.args;
                    expect(config).to.have.nested.property(authPath, `Bearer ${TOKEN}`);
                });

                it("specifies the correct path", async function() {
                    await this.client.getDirectoryContents("/testing");
                    const [config] = this.request.firstCall.args;
                    const body = JSON.parse(config.body);
                    expect(body).to.have.property("path").that.equals("/testing");
                });

                it("specifies the expected range paramters", async function() {
                    await this.client.getDirectoryContents("/testing");
                    const [config] = this.request.firstCall.args;
                    const body = JSON.parse(config.body);
                    expect(body).to.have.property("recursive").that.equals(false);
                    expect(body).to.have.property("limit").that.equals(2000);
                });
            });

            describe("getFileContents", function() {
                it("specifies the correct URL", async function() {
                    await this.client.getFileContents("/testing.txt");
                    const [config] = this.request.firstCall.args;
                    expect(config).to.have.property("url").that.matches(/files\/download$/);
                });

                it("specifies the correct method", async function() {
                    await this.client.getFileContents("/testing.txt");
                    const [config] = this.request.firstCall.args;
                    expect(config).to.have.property("method", "GET");
                });

                it("provides authorisation", async function() {
                    await this.client.getFileContents("/testing.txt");
                    const [config] = this.request.firstCall.args;
                    expect(config).to.have.nested.property(authPath, `Bearer ${TOKEN}`);
                });

                it("specifies the correct path", async function() {
                    await this.client.getFileContents("/testing.txt");
                    const [config] = this.request.firstCall.args;
                    const arg = JSON.parse(nested.get(config, fileContentsPath));
                    expect(arg).to.have.property("path").that.equals("/testing.txt");
                });
            });

            describe("getInfo", function() {
                beforeEach(function() {
                    this.request.callsFake(async () => ({
                        data: DIRECTORY_INFO_RESPONSE
                    }));
                });

                it("specifies the correct URL", async function() {
                    await this.client.getInfo("/testing.txt");
                    const [config] = this.request.firstCall.args;
                    expect(config).to.have.property("url").that.matches(/files\/get_metadata$/);
                });

                it("specifies the correct method", async function() {
                    await this.client.getInfo("/testing.txt");
                    const [config] = this.request.firstCall.args;
                    expect(config).to.have.property("method", "POST");
                });

                it("provides authorisation", async function() {
                    await this.client.getInfo("/testing.txt");
                    const [config] = this.request.firstCall.args;
                    expect(config).to.have.nested.property(authPath, `Bearer ${TOKEN}`);
                });

                describe("with a directory target", function() {
                    it("returns correct item type", async function() {
                        const item = await this.client.getInfo("/testing.txt");
                        expect(item).to.have.property("type", "directory");
                    });
                });

                describe("with a file target", function() {
                    beforeEach(function() {
                        this.request.callsFake(async () => ({
                            data: FILE_INFO_RESPONSE
                        }));
                    });

                    it("returns correct item type", async function() {
                        const item = await this.client.getInfo("/testing.txt");
                        expect(item).to.have.property("type", "file");
                    });
                });
            });
        });
    });
});
