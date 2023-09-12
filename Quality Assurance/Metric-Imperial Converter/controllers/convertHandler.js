const { clearCookie } = require("express/lib/response");
const res = require("express/lib/response");

function ConvertHandler() {

  this.getNum = function(input) {
    const unitStartIndex = input.search(/[a-z]/i);
    if (unitStartIndex === -1) return input;  // No unit provided

    const num = input.slice(0, unitStartIndex);
    if (num.length < 1) return 1;  // If no num is provided, it will use 1

    // Num in invalid if it has more than one fraction
    const fraction = num.match(/\//g);
    if (fraction && fraction.length > 1) return null;
    // Num in invalid if it has more than one decimal point
    const decimal = num.match(/\./g);
    if (decimal && decimal.length > 1) return null;

    return eval(num);
  };
  
  this.getUnit = function(input) {
    const unitStartIndex = input.search(/[a-z]/i);
    if (unitStartIndex === -1) return null;  // If no unit is provided
    const validUnits = ["gal", "l", "lbs", "kg", "mi", "km"];
    let unit = input.slice(unitStartIndex);
    unit = unit.toLowerCase();
    if (!validUnits.includes(unit)) return null;
    if (unit == "l") unit = "L";  // Make sure l is upper-case
    return unit;
  };
  
  this.getReturnUnit = function(initUnit) {
    switch (initUnit) {
      case "gal": return "L";
      case "lbs": return "kg";
      case "mi": return "km";
      case "L": return "gal";
      case "kg": return "lbs";
      case "km": return "mi";
      default: return null;
    };
  };

  this.spellOutUnit = function(unit) {
    switch (unit) {
      case "gal": return "gallons";
      case "lbs": return "pounds";
      case "mi": return "miles";
      case "L": return "liters";
      case "kg": return "kilograms";
      case "km": return "kilometers";
      default: return null;
    };
  };
  
  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;

    let result;
    switch (initUnit) {
      case "gal":
        result = initNum * galToL
        break;
      case "lbs":
        result = initNum * lbsToKg
        break;
      case "mi":
        result = initNum * miToKm
        break;
      case "L":
        result = initNum / galToL
        break;
      case "kg":
        result = initNum / lbsToKg
        break;
      case "km":
        result = initNum / miToKm
        break;
      default: return null;
    };
    // Round to 5 decimal places
    return Math.round(result * 100000) / 100000;
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    return `${initNum} ${this.spellOutUnit(initUnit)} converts to ${returnNum} ${this.spellOutUnit(returnUnit)}`;
  };
}

module.exports = ConvertHandler;
