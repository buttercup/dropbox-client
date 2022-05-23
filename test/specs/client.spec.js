const { expect } = require("chai");
const sinon = require("sinon");
const { DropboxClient } = require("../../dist/client.js");

const DIRECTORY_CONTENTS_RESPONSE = require("../resources/directory-contents.response.json");

const TOKEN = "abc123";

describe("DropboxClient", function() {
    beforeEach(function() {
        this.request = sinon.stub().callsFake(async () => ({
            data: {}
        }));
    });

    [
        [{}, {
            authPath: "headers.Authorization"
        }],
        [{ compat: true }, {
            authPath: "query.authorization"
        }]
    ].forEach(([config, { authPath }]) => {
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

                it("specifies the correct path", async function() {
                    await this.client.delete("/test.txt");
                    const [config] = this.request.firstCall.args;
                    const body = JSON.parse(config.body);
                    expect(body).to.have.property("path").that.equals("/test.txt");
                });

                it("provides authorisation", async function() {
                    await this.client.delete("/test.txt");
                    const [config] = this.request.firstCall.args;
                    expect(config).to.have.nested.property(authPath, `Bearer ${TOKEN}`);
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

                it("provides authorisation", async function() {
                    await this.client.delete("/test.txt");
                    const [config] = this.request.firstCall.args;
                    expect(config).to.have.nested.property(authPath, `Bearer ${TOKEN}`);
                });
            });
        });
    });
});
