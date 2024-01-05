const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

let Translator = require('../components/translator.js');

suite('Functional Tests', () => {
    suite("Translation with text and locale fields", () => {
        test("Translation with text and locale fields", (done) => {
            const testData = {
                text: "Mangoes are my favorite fruit.",
                locale: "american-to-british"
            }
            chai
                .request(server)
                .keepOpen()
                .post("/api/translate")
                .send(testData)
                .end((err, res) => {
                    assert.strictEqual(res.status, 200, "Status code");
                    assert.isObject(res.body, "The response is an object");
                    assert.strictEqual(res.body.text, testData.text, "Provided text");
                    assert.strictEqual(res.body.translation, 'Mangoes are my <span class="highlight">favourite</span> fruit.', "Translation");
                    done();
                });
        });
    });
    suite("Translation with text and invalid locale field", () => {
        test("Translation with text and invalid locale field", (done) => {
            const testData = {
                text: "Mangoes are my favorite fruit.",
                locale: "invalid"
            }
            chai
                .request(server)
                .keepOpen()
                .post("/api/translate")
                .send(testData)
                .end((err, res) => {
                    assert.strictEqual(res.status, 200, "Status code");
                    assert.isObject(res.body, "The response is an object");
                    assert.strictEqual(res.body.error, "Invalid value for locale field", "Invalid value for locale field");
                    done();
                });
        });
    });
    suite("Translation with missing text field", () => {
        test("Translation with missing text field", (done) => {
            const testData = {
                locale: "american-to-british"
            }
            chai
                .request(server)
                .keepOpen()
                .post("/api/translate")
                .send(testData)
                .end((err, res) => {
                    assert.strictEqual(res.status, 200, "Status code");
                    assert.isObject(res.body, "The response is an object");
                    assert.strictEqual(res.body.error, "Required field(s) missing", "Required field(s) missing");
                    done();
                });
        });
    });
    suite("Translation with missing locale field", () => {
        test("Translation with missing locale field", (done) => {
            const testData = {
                text: "Mangoes are my favorite fruit."
            }
            chai
                .request(server)
                .keepOpen()
                .post("/api/translate")
                .send(testData)
                .end((err, res) => {
                    assert.strictEqual(res.status, 200, "Status code");
                    assert.isObject(res.body, "The response is an object");
                    assert.strictEqual(res.body.error, "Required field(s) missing", "Required field(s) missing");
                    done();
                });
        });
    });
    suite("Translation with empty text", () => {
        test("Translation with empty text", (done) => {
            const testData = {
                text: "",
                locale: "american-to-british"
            }
            chai
                .request(server)
                .keepOpen()
                .post("/api/translate")
                .send(testData)
                .end((err, res) => {
                    assert.strictEqual(res.status, 200, "Status code");
                    assert.isObject(res.body, "The response is an object");
                    assert.strictEqual(res.body.error, "No text to translate", "No text to translate");
                    done();
                });
        });
    });
    suite("Translation with text that needs no translation", () => {
        test("Translation with text that needs no translation", (done) => {
            const testData = {
                text: "No translation needed",
                locale: "american-to-british"
            }
            chai
                .request(server)
                .keepOpen()
                .post("/api/translate")
                .send(testData)
                .end((err, res) => {
                    assert.strictEqual(res.status, 200, "Status code");
                    assert.isObject(res.body, "The response is an object");
                    assert.strictEqual(res.body.text, testData.text, "Provided text");
                    assert.strictEqual(res.body.translation, 'Everything looks good to me!', "Everything looks good to me!");
                    done();
                });
        });
    });
});