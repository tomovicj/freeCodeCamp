const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    suite("Check a Puzzle Placement", () => {
        const data = {
            puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
            coordinate: "A2",
            value: "3"
        }
        test("All fields", (done) => {
            chai.request(server)
                .post('/api/check')
                .send(data)
                .end((err, res) => {
                    assert.isObject(res.body);
                    assert.property(res.body, "valid");
                    assert.isTrue(res.body.valid);
                    done();
                });
        });
        test("Single placement conflict", (done) => {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: data.puzzle,
                    coordinate: data.coordinate,
                    value: "8"
                })
                .end((err, res) => {
                    assert.isObject(res.body);
                    assert.property(res.body, "valid");
                    assert.isFalse(res.body.valid);
                    assert.property(res.body, "conflict");
                    assert.isArray(res.body.conflict);
                    assert.equal(res.body.conflict.length, 1);
                    assert.include(res.body.conflict, "row");
                    done();
                });
        });
        test("Multiple placement conflicts", (done) => {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: data.puzzle,
                    coordinate: data.coordinate,
                    value: "6"
                })
                .end((err, res) => {
                    assert.isObject(res.body);
                    assert.property(res.body, "valid");
                    assert.isFalse(res.body.valid);
                    assert.property(res.body, "conflict");
                    assert.isArray(res.body.conflict);
                    assert.equal(res.body.conflict.length, 2);
                    assert.include(res.body.conflict, "column");
                    assert.include(res.body.conflict, "region");
                    done();
                });
        });
        test("All placement conflicts", (done) => {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: data.puzzle,
                    coordinate: data.coordinate,
                    value: "2"
                })
                .end((err, res) => {
                    assert.isObject(res.body);
                    assert.property(res.body, "valid");
                    assert.isFalse(res.body.valid);
                    assert.property(res.body, "conflict");
                    assert.isArray(res.body.conflict);
                    assert.equal(res.body.conflict.length, 3);
                    assert.include(res.body.conflict, "row");
                    assert.include(res.body.conflict, "column");
                    assert.include(res.body.conflict, "region");
                    done();
                });
        });
        test("Missing required fields", (done) => {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: data.puzzle,
                    coordinate: data.coordinate,
                })
                .end((err, res) => {
                    assert.isObject(res.body);
                    assert.property(res.body, "error");
                    assert.strictEqual(res.body.error, "Required field(s) missing");
                    done();
                });
        });
        test("Invalid characters", (done) => {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: "1.5g.2.84..63.12.7.2..5.f...9..1..P.8.2.3674.3.7.2..9.47...8..1..16.Z..926914.37.",
                    coordinate: data.coordinate,
                    value: data.value
                })
                .end((err, res) => {
                    assert.isObject(res.body);
                    assert.property(res.body, "error");
                    assert.strictEqual(res.body.error, "Invalid characters in puzzle");
                    done();
                });
        });
        test("Incorrect length", (done) => {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: data.puzzle + ".",
                    coordinate: data.coordinate,
                    value: data.value
                })
                .end((err, res) => {
                    assert.isObject(res.body);
                    assert.property(res.body, "error");
                    assert.strictEqual(res.body.error, "Expected puzzle to be 81 characters long");
                    done();
                });
        });
        test("Invalid placement coordinate", (done) => {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: data.puzzle,
                    coordinate: "L9",
                    value: data.value
                })
                .end((err, res) => {
                    assert.isObject(res.body);
                    assert.property(res.body, "error");
                    assert.strictEqual(res.body.error, "Invalid coordinate");
                    done();
                });
        });
        test("Invalid placement value", (done) => {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: data.puzzle,
                    coordinate: data.coordinate,
                    value: "0"
                })
                .end((err, res) => {
                    assert.isObject(res.body);
                    assert.property(res.body, "error");
                    assert.strictEqual(res.body.error, "Invalid value");
                    done();
                });
        });
    });
    suite("Solve a Puzzle", () => {
        const data = {
            puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
            solution: "135762984946381257728459613694517832812936745357824196473298561581673429269145378"
        }
        test("Valid puzzle string", (done) => {
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: data.puzzle })
                .end((err, res) => {
                    assert.isObject(res.body);
                    assert.property(res.body, "solution");
                    assert.strictEqual(res.body.solution, data.solution);
                    done();
                });
        });
        test("Missing puzzle string", (done) => {
            chai.request(server)
                .post('/api/solve')
                .send({})
                .end((err, res) => {
                    assert.isObject(res.body);
                    assert.property(res.body, "error");
                    assert.strictEqual(res.body.error, "Required field missing");
                    done();
                });
        });
        test("Invalid characters", (done) => {
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: data.puzzle.slice(0, 80) + "G" })
                .end((err, res) => {
                    assert.isObject(res.body);
                    assert.property(res.body, "error");
                    assert.strictEqual(res.body.error, "Invalid characters in puzzle");
                    done();
                });
        });
        test("Incorrect length", (done) => {
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: data.puzzle + "." })
                .end((err, res) => {
                    assert.isObject(res.body);
                    assert.property(res.body, "error");
                    assert.strictEqual(res.body.error, "Expected puzzle to be 81 characters long");
                    done();
                });
        });
        test("Cannot be solved", (done) => {
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: "1.5..2.84..63.12.7.2..5...159..1....8.2.3674.3.7.2.69.47...82.1..16....926914.37." })
                .end((err, res) => {
                    assert.isObject(res.body);
                    assert.property(res.body, "error");
                    assert.strictEqual(res.body.error, "Puzzle cannot be solved");
                    done();
                });
        });
    });
});
