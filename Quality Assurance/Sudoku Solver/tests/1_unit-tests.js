const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const solver = new Solver;

suite('Unit Tests', () => {
    suite("Puzzle String", () => {
        test("Valid puzzle string of 81 characters", () => {
            const valid = solver.validate("1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.");
            assert.isBoolean(valid);
            assert.isTrue(valid);
        });
        test("Puzzle string with invalid characters (not 1-9 or .)", () => {
            const valid = solver.validate("1L5..2.84..63.12.7.2..5..D..9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37G");
            assert.isObject(valid);
            assert.property(valid, "error");
            assert.strictEqual(valid.error, "Invalid characters in puzzle");
        });
        test("Puzzle string that is not 81 characters in length", () => {
            const valid = solver.validate("1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37");
            assert.isObject(valid);
            assert.property(valid, "error");
            assert.strictEqual(valid.error, "Expected puzzle to be 81 characters long");
        });
    });
    suite("Row Placement", () => {
        test("Valid row placement", () => {
            const valid = solver.checkRowPlacement("1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.", 2, 3, "4");
            assert.isBoolean(valid);
            assert.isTrue(valid);
        });
        test("Invalid row placement", () => {
            const valid = solver.checkRowPlacement("1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.", 0, 6, "1");
            assert.isBoolean(valid);
            assert.isFalse(valid);
        });
    });
    suite("Column Placement", () => {
        test("Valid column placement", () => {
            const valid = solver.checkColPlacement("1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.", 5, 5, "4");
            assert.isBoolean(valid);
            assert.isTrue(valid);
        });
        test("Invalid column placement", () => {
            const valid = solver.checkColPlacement("1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.", 5, 5, "8");
            assert.isBoolean(valid);
            assert.isFalse(valid);
        });
    });
    suite("Region (3x3 grid) Placement", () => {
        test("Valid region placement", () => {
            const valid = solver.checkRegionPlacement("1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.", 3, 6, "8");
            assert.isBoolean(valid);
            assert.isTrue(valid);
        });
        test("Invalid region placement", () => {
            const valid = solver.checkRegionPlacement("1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.", 6, 2, "6");
            assert.isBoolean(valid);
            assert.isFalse(valid);
        });
    });
    suite("Solver", () => {
        test("Valid puzzle strings pass the solver", () => {
            const solution = solver.solve("1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.");
            assert.isNotNull(solution);
            assert.isString(solution);
            assert.equal(solution.length, 81);
        });
        test("Invalid puzzle strings fail the solver", () => {
            const solution = solver.solve("1.5..2.84..63.12.7.2..5...159..1....8.2.3674.3.7.2.69.47...82.1..16....926914.37.");
            assert.isNull(solution);
        });
        test("Solver returns the expected solution for an incomplete puzzle", () => {
            const solution = solver.solve("1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.");
            assert.strictEqual(solution, "135762984946381257728459613694517832812936745357824196473298561581673429269145378");
        });
    });
});
