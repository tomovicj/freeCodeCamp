const chaiHttp = require("chai-http");
const chai = require("chai");
let assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  test("Convert a valid input", (done) => {
    chai
      .request(server)
      .keepOpen()
      .get("/api/convert")
      .query({ input: "10L" })
      .end((err, res) => {
        assert.strictEqual(res.status, 200, "status code");
        assert.strictEqual(res.body.initNum, 10, "initNum");
        assert.strictEqual(res.body.initUnit, "L", "initUnit");
        assert.approximately(res.body.returnNum, 2.6417217685798895, 0.006, "returnNum");
        assert.strictEqual(res.body.returnUnit, "gal", "returnUnit");
        assert.strictEqual(res.body.string, `10 liters converts to ${res.body.returnNum} gallons`, "string");
        done();
      });
  });
  test("Convert an invalid input", (done) => {
    chai
      .request(server)
      .keepOpen()
      .get("/api/convert")
      .query({ input: "32g" })
      .end((err, res) => {
        assert.strictEqual(res.status, 200, "status code");
        assert.strictEqual(res.body, "invalid unit", "initUnit");
        done();
      });
  });
  test("Convert an invalid number (i.e. 3/7.2/4kg)", (done) => {
    chai
      .request(server)
      .keepOpen()
      .get("/api/convert")
      .query({ input: "3/7.2/4kg" })
      .end((err, res) => {
        assert.strictEqual(res.status, 200, "status code");
        assert.strictEqual(res.body, "invalid number", "initNum");
        done();
      });
  });
  test("Convert an invalid number AND unit (i.e. 3/7.2/4kilomegagram)", (done) => {
    chai
      .request(server)
      .keepOpen()
      .get("/api/convert")
      .query({ input: "3/7.2/4kilomegagram" })
      .end((err, res) => {
        assert.strictEqual(res.status, 200, "status code");
        assert.strictEqual(res.body, "invalid number and unit", "initNum");
        done();
      });
  });
  test("Convert with no number (i.e. kg)", (done) => {
    chai
      .request(server)
      .keepOpen()
      .get("/api/convert")
      .query({ input: "kg" })
      .end((err, res) => {
        assert.strictEqual(res.status, 200, "status code");
        assert.strictEqual(res.body.initNum, 1, "initNum");
        assert.strictEqual(res.body.initUnit, "kg", "initUnit");
        assert.approximately(res.body.returnNum, 2.2046244201837775, 0.006, "returnNum");
        assert.strictEqual(res.body.returnUnit, "lbs", "returnUnit");
        assert.strictEqual(res.body.string, `${res.body.initNum} kilograms converts to ${res.body.returnNum} pounds`, "string");
        done();
      });
  });
});
