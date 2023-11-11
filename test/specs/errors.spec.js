import { expect } from "chai";
import sinon from "sinon";
import { Layerr } from "layerr";
import { DropboxClient } from "../../dist/client.js";

const TOKEN = "abc123";

async function captureError(callback) {
    try {
        await callback();
    } catch (err) {
        return err;
    }
    return null;
}

describe("DropboxClient", function() {
    beforeEach(function() {
        this.request = sinon.stub().callsFake(async () => ({
            ok: false,
            headers: {},
            status: 400,
            statusText: "Bad Request",
            url: "https://api.dropboxapi.com/2/files/list_folder"
        }));
        this.client = new DropboxClient(TOKEN);
        this.client.patcher.patch("request", (...args) => this.request(...args));
    });

    [
        ["createDirectory", (client) => client.createDirectory("/test")],
        ["delete", (client) => client.delete("/test.txt")],
        ["getDirectoryContents", (client) => client.getDirectoryContents("/test")],
        ["getFileContents", (client) => client.getFileContents("/test.txt")],
        ["getInfo", (client) => client.getInfo("/test.txt")],
        ["putFileContents", (client) => client.putFileContents("/test.txt", "test")]
    ].forEach(([method, callback]) => {
        console.log(callback);
        describe(method, function() {
            it("throws Layerr instance", async function() {
                const error = await captureError(() => callback(this.client));
                expect(error).to.be.an.instanceOf(Layerr);
            });

            it("throws error with info", async function() {
                const error = await captureError(() => callback(this.client));
                const info = Layerr.info(error);
                expect(info).to.deep.include({
                    status: 400,
                    statusText: "Bad Request"
                });
                expect(info).to.have.property("url").that.matches(/^https:\/\/api\.dropboxapi\.com/);
            });
        });
    });

    // describe("createDirectory", function() {
    //     it("throws Layerr instance", async function() {
    //         const error = await captureError(async () => {
    //             await this.client.createDirectory("/test");
    //         });
    //         expect(error).to.be.an.instanceOf(Layerr);
    //     });

    //     it("throws error with info", async function() {
    //         const error = await captureError(async () => {
    //             await this.client.createDirectory("/test");
    //         });
    //         const info = Layerr.info(error);
    //         expect(info).to.deep.include({
    //             status: 400,
    //             statusText: "Bad Request"
    //         });
    //         expect(info).to.have.property("url").that.matches(/^https:\/\/api\.dropboxapi\.com/);
    //     });
    // });
});
