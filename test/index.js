const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const sinon = require("sinon");

chai.use(chaiAsPromised);

Object.assign(global, {
    expect: chai.expect,
    sinon
});
