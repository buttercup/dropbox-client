const { expect } = require("chai");
const sinon = require("sinon");
const { DropboxClient } = require("../../dist/client.js");

const TOKEN = "abc123";

describe("DropboxClient", function() {
    beforeEach(function() {
        this.client = new DropboxClient(TOKEN);
        this.response = {};
        this.request = sinon.stub().callsFake(async () => ({
            data: this.response
        }));
        this.client.patcher.patch("request", this.request);
    });

    describe("createDirectory", function() {
        it("specifies the correct path", async function() {
            await this.client.createDirectory("/test directory");
            const [config] = this.request.firstCall.args;
            expect(config).to.have.property("url").that.matches(/files\/create_folder_v2$/);
        });

        it("specifies the correct method", async function() {
            await this.client.createDirectory("/test directory");
            const [config] = this.request.firstCall.args;
            expect(config).to.have.property("method", "POST");
        });

        it("provides authorisation", async function() {
            await this.client.createDirectory("/test directory");
            const [config] = this.request.firstCall.args;
            expect(config).to.have.nested.property("query.authorization", `Bearer ${TOKEN}`);
        });
    });
});
