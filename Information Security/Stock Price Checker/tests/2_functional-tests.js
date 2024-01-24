const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  let likes;
  test("Viewing one stock", (done) => {
    chai
      .request(server)
      .get("/api/stock-prices?stock=GOOG")
      .end((err, res) => {
        assert.isObject(res);
        assert.isObject(res.body.stockData);
        assert.isString(res.body.stockData.stock);
        assert.strictEqual(res.body.stockData.stock, "GOOG");
        assert.isNumber(res.body.stockData.price);
        assert.isNumber(res.body.stockData.likes);
        likes = res.body.stockData.likes;
        done();
      });
  });
  test("Viewing one stock and liking it", (done) => {
    chai
      .request(server)
      .get("/api/stock-prices?stock=GOOG&like=true")
      .end((err, res) => {
        assert.isObject(res);
        assert.isObject(res.body.stockData);
        assert.isString(res.body.stockData.stock);
        assert.strictEqual(res.body.stockData.stock, "GOOG");
        assert.isNumber(res.body.stockData.price);
        assert.isNumber(res.body.stockData.likes);
        assert.strictEqual(res.body.stockData.likes, likes + 1);
        done();
      });
  });
  test("Viewing the same stock and liking it again", (done) => {
    chai
      .request(server)
      .get("/api/stock-prices?stock=GOOG&like=true")
      .end((err, res) => {
        assert.isObject(res);
        assert.isObject(res.body.stockData);
        assert.isString(res.body.stockData.stock);
        assert.strictEqual(res.body.stockData.stock, "GOOG");
        assert.isNumber(res.body.stockData.price);
        assert.isNumber(res.body.stockData.likes);
        assert.strictEqual(res.body.stockData.likes, likes + 1);
        done();
      });
  });
  test("Viewing two stocks", (done) => {
    chai
      .request(server)
      .get("/api/stock-prices?stock=AAPL&stock=MSFT")
      .end((err, res) => {
        assert.isObject(res);
        assert.isArray(res.body.stockData);
        assert.isString(res.body.stockData[0].stock);
        assert.strictEqual(res.body.stockData[0].stock, "AAPL");
        assert.isNumber(res.body.stockData[0].price);
        assert.isNumber(res.body.stockData[0].rel_likes);
        assert.isString(res.body.stockData[1].stock);
        assert.strictEqual(res.body.stockData[1].stock, "MSFT");
        assert.isNumber(res.body.stockData[1].price);
        assert.isNumber(res.body.stockData[1].rel_likes);
        likes = [
          res.body.stockData[0].rel_likes,
          res.body.stockData[1].rel_likes,
        ];
        done();
      });
  });
  test("Viewing two stocks and liking them", (done) => {
    chai
      .request(server)
      .get("/api/stock-prices?stock=AAPL&stock=MSFT&like=true")
      .end((err, res) => {
        assert.isObject(res);
        assert.isArray(res.body.stockData);
        assert.isString(res.body.stockData[0].stock);
        assert.strictEqual(res.body.stockData[0].stock, "AAPL");
        assert.isNumber(res.body.stockData[0].price);
        assert.isNumber(res.body.stockData[0].rel_likes);
        assert.strictEqual(
          res.body.stockData[0].rel_likes,
          likes[0],
          "Likes on first stock"
        );

        assert.isString(res.body.stockData[1].stock);
        assert.strictEqual(res.body.stockData[1].stock, "MSFT");
        assert.isNumber(res.body.stockData[1].price);
        assert.isNumber(res.body.stockData[1].rel_likes);
        assert.strictEqual(
          res.body.stockData[1].rel_likes,
          likes[1],
          "Likes on second stock"
        );
        done();
      });
  });
});
