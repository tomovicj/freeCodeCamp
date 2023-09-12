const chai = require("chai");
let assert = chai.assert;
const ConvertHandler = require("../controllers/convertHandler.js");

let convertHandler = new ConvertHandler();

suite("Unit Tests", function () {
  test("'convertHandler' should correctly read a whole number input", () => {
    assert.strictEqual(convertHandler.getNum("2kg"), 2);
  });
  test("'convertHandler' should correctly read a decimal number input", () => {
    assert.strictEqual(convertHandler.getNum("2.5kg"), 2.5);
  });
  test("'convertHandler' should correctly read a fractional input", () => {
    assert.strictEqual(convertHandler.getNum("9/3kg"), 3);
  });
  test("'convertHandler' should correctly read a fractional input with a decimal", () => {
    assert.strictEqual(convertHandler.getNum("2.5/2kg"), 1.25);
  });
  test("'convertHandler' should correctly return an error on a double-fraction (i.e. 3/2/3)", () => {
    assert.isNull(convertHandler.getNum("3/2/3gal"));
  });
  test("'convertHandler' should correctly default to a numerical input of 1 when no numerical input is provided.", () => {
    assert.strictEqual(convertHandler.getNum("km"), 1);
  });
  test("'convertHandler' should correctly read each valid input unit", () => {
    assert.strictEqual(convertHandler.getUnit("5gal"), "gal", "gallons");
    assert.strictEqual(convertHandler.getUnit("5lbs"), "lbs", "pounds");
    assert.strictEqual(convertHandler.getUnit("5mi"), "mi", "miles");
    assert.strictEqual(convertHandler.getUnit("5l"), "L", "liters with lower-case l");
    assert.strictEqual(convertHandler.getUnit("5L"), "L", "liters with upper-case L");
    assert.strictEqual(convertHandler.getUnit("5kg"), "kg", "kilograms");
    assert.strictEqual(convertHandler.getUnit("5km"), "km", "kilometers");
  });
  test("'convertHandler' should correctly return an error for an invalid input unit", () => {
    assert.isNull(convertHandler.getUnit("mm"));
  });
  test("'convertHandler' should return the correct return unit for each valid input unit", () => {
    assert.strictEqual(convertHandler.getReturnUnit("gal"), "L", "gallons to liters");
    assert.strictEqual(convertHandler.getReturnUnit("lbs"), "kg", "pounds to kilograms");
    assert.strictEqual(convertHandler.getReturnUnit("mi"), "km", "miles to kilometers");
    assert.strictEqual(convertHandler.getReturnUnit("L"), "gal", "liters to gallons");
    assert.strictEqual(convertHandler.getReturnUnit("kg"), "lbs", "kilograms to pounds");
    assert.strictEqual(convertHandler.getReturnUnit("km"), "mi", "kilometers to miles");
  });
  test("'convertHandler' should correctly return the spelled-out string unit for each valid input unit", () => {
    assert.strictEqual(convertHandler.spellOutUnit("gal"), "gallons", "gallons");
    assert.strictEqual(convertHandler.spellOutUnit("lbs"), "pounds", "pounds");
    assert.strictEqual(convertHandler.spellOutUnit("mi"), "miles", "miles");
    assert.strictEqual(convertHandler.spellOutUnit("L"), "liters", "liters");
    assert.strictEqual(convertHandler.spellOutUnit("kg"), "kilograms", "kilograms");
    assert.strictEqual(convertHandler.spellOutUnit("km"), "kilometers", "kilometers");
  });
  test("'convertHandler' should correctly convert 'gal' to 'l'", () => {
    assert.approximately(convertHandler.convert(2, "gal"), 7.57082, 0.006);
  });
  test("'convertHandler' should correctly convert 'l' to 'gal'", () => {
    assert.approximately(convertHandler.convert(2, "L"), 0.5283443537159779, 0.006);
  });
  test("'convertHandler' should correctly convert 'mi' to 'km'", () => {
    assert.approximately(convertHandler.convert(2, "mi"), 3.21868, 0.006);
  });
  test("'convertHandler' should correctly convert 'km' to 'mi'", () => {
    assert.approximately(convertHandler.convert(2, "km"), 1.2427454732996135, 0.006);
  });
  test("'convertHandler' should correctly convert 'lbs' to 'kg'", () => {
    assert.approximately(convertHandler.convert(2, "lbs"), 0.907184, 0.006);
  });
  test("'convertHandler' should correctly convert 'kg' to 'lbs'", () => {
    assert.approximately(convertHandler.convert(2, "kg"), 4.409248840367555, 0.006);
  });
});
