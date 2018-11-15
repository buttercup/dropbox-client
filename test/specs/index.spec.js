const { createClient, createFsInterface } = require("../../source/index.js");

const FAKE_TOKEN = "abc123";

describe("DropboxClient", function() {
    describe("createClient", function() {
        beforeEach(function() {
            this.client = createClient(FAKE_TOKEN);
            this.context = {
                returnValue: null
            };
            this.request = sinon.stub().callsFake(() => Promise.resolve(this.context.returnValue));
            this.client.patcher.patch("request", this.request);
        });

        describe("getDirectoryContents", function() {
            beforeEach(function() {
                this.context.returnValue = {
                    status: 200,
                    data: {
                        entries: [
                            {
                                ".tag": "folder",
                                name: "Interesting Folder",
                                path_lower: "/sub/interesting folder",
                                path_display: "/Sub/Interesting Folder",
                                id: "id:a4ayc_80_OEAAAAAAAAAXw"
                            },
                            {
                                ".tag": "file",
                                name: "profile.jpg",
                                path_lower: "/sub/profile.jpg",
                                path_display: "/Sub/profile.jpg",
                                id: "id:a4ayc_80_OEAAAAAAAAAXz",
                                size: 143827
                            }
                        ]
                    }
                };
            });

            it("returns correct folder structure", function() {
                return this.client.getDirectoryContents("/Sub").then(contents => {
                    const folder = contents.find(item => item.name === "Interesting Folder");
                    expect(folder).to.have.property("type", "directory");
                    expect(folder).to.have.property("size", 0);
                    expect(folder).to.have.property("path", "/Sub/Interesting Folder");
                    expect(folder).to.have.property("id", "id:a4ayc_80_OEAAAAAAAAAXw");
                });
            });

            it("returns correct file structure", function() {
                return this.client.getDirectoryContents("/Sub").then(contents => {
                    const file = contents.find(item => item.name === "profile.jpg");
                    expect(file).to.have.property("type", "file");
                    expect(file).to.have.property("size", 143827);
                    expect(file).to.have.property("path", "/Sub/profile.jpg");
                    expect(file).to.have.property("id", "id:a4ayc_80_OEAAAAAAAAAXz");
                });
            });

            it("passes the token in the request", function() {
                return this.client.getDirectoryContents("/Sub").then(() => {
                    const arg = this.request.firstCall.args[0];
                    expect(arg.headers).to.have.property("Authorization", `Bearer ${FAKE_TOKEN}`);
                });
            });
        });

        describe("getFileContents", function() {
            beforeEach(function() {
                this.context.returnValue = {
                    status: 200,
                    data: "file-contents"
                };
            });

            it("returns file content", function() {
                return this.client.getFileContents("/file.txt").then(contents => {
                    expect(contents).to.equal("file-contents");
                });
            });

            it("passes the token in the request", function() {
                return this.client.getFileContents("/file.txt").then(() => {
                    const arg = this.request.firstCall.args[0];
                    expect(arg.headers).to.have.property("Authorization", `Bearer ${FAKE_TOKEN}`);
                });
            });
        });

        describe("putFileContents", function() {
            beforeEach(function() {
                this.context.returnValue = {
                    status: 200
                };
            });

            it("sends correct parameters", function() {
                return this.client.putFileContents("/file.txt", "testing").then(() => {
                    const arg = this.request.firstCall.args[0];
                    expect(arg).to.have.nested.property("params.arg").that.is.a("string");
                    expect(arg).to.have.nested.property("params.reject_cors_preflight", "true");
                    const payload = JSON.parse(arg.params.arg);
                    expect(payload).to.deep.equal({
                        path: "/file.txt",
                        mode: "overwrite"
                    });
                });
            });

            it("sends correct authorisation", function() {
                return this.client.putFileContents("/file.txt", "testing").then(() => {
                    const arg = this.request.firstCall.args[0];
                    expect(arg).to.have.nested.property("params.authorization", `Bearer ${FAKE_TOKEN}`);
                    expect(arg.headers).to.not.have.property("Authorization");
                });
            });

            it("sends content", function() {
                return this.client.putFileContents("/file.txt", "testing").then(() => {
                    const arg = this.request.firstCall.args[0];
                    expect(arg).to.have.property("data", "testing");
                });
            });
        });
    });

    describe("createFsInterface", function() {
        beforeEach(function() {
            this.client = createClient(FAKE_TOKEN);
            this.context = {
                returnValue: null
            };
            this.request = sinon.stub().callsFake(() => Promise.resolve(this.context.returnValue));
            this.client.patcher.patch("request", this.request);
            this.fs = createFsInterface(this.client);
        });

        describe("readdir", function() {
            beforeEach(function() {
                this.context.returnValue = {
                    status: 200,
                    data: {
                        entries: [
                            {
                                ".tag": "folder",
                                name: "Interesting Folder",
                                path_lower: "/sub/interesting folder",
                                path_display: "/Sub/Interesting Folder",
                                id: "id:a4ayc_80_OEAAAAAAAAAXw"
                            },
                            {
                                ".tag": "file",
                                name: "profile.jpg",
                                path_lower: "/sub/profile.jpg",
                                path_display: "/Sub/profile.jpg",
                                id: "id:a4ayc_80_OEAAAAAAAAAXz",
                                size: 143827
                            }
                        ]
                    }
                };
            });

            it("returns names only by default", function(done) {
                this.fs.readdir("/Sub", (err, items) => {
                    if (err) {
                        return done(err);
                    }
                    expect(items).to.have.lengthOf(2);
                    expect(items).to.contain("Interesting Folder");
                    expect(items).to.contain("profile.jpg");
                    done();
                });
            });

            it("returns stat object for folders", function(done) {
                this.fs.readdir("/Sub", { mode: "stat" }, (err, items) => {
                    if (err) {
                        return done(err);
                    }
                    const folder = items.find(item => item.name === "Interesting Folder");
                    expect(folder).to.have.property("type", "directory");
                    expect(folder).to.have.property("size", 0);
                    expect(folder).to.have.property("path", "/Sub/Interesting Folder");
                    expect(folder).to.have.property("id", "id:a4ayc_80_OEAAAAAAAAAXw");
                    expect(folder.isDirectory()).to.be.true;
                    expect(folder.isFile()).to.be.false;
                    done();
                });
            });

            it("returns stat object for files", function(done) {
                this.fs.readdir("/Sub", { mode: "stat" }, (err, items) => {
                    if (err) {
                        return done(err);
                    }
                    const file = items.find(item => item.name === "profile.jpg");
                    expect(file).to.have.property("type", "file");
                    expect(file).to.have.property("size", 143827);
                    expect(file).to.have.property("path", "/Sub/profile.jpg");
                    expect(file).to.have.property("id", "id:a4ayc_80_OEAAAAAAAAAXz");
                    expect(file.isDirectory()).to.be.false;
                    expect(file.isFile()).to.be.true;
                    done();
                });
            });
        });
    });
});
