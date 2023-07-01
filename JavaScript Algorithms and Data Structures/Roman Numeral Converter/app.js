function convertToRoman(num) {
  let str = "";
  const roman = {
    1000: "M",
    900: "CM",
    500: "D",
    400: "CD",
    100: "C",
    90: "XC",
    50: "L",
    40: "XL",
    10: "X",
    9: "IX",
    5: "V",
    4: "IV",
    1: "I"
  }
  const keys = Object.keys(roman).sort((a, b) => b - a);
  let i = 0;
  while (num > 0) {
    const val = Math.floor(num / keys[i]);
    if (val >= 1) {
      str += roman[keys[i]].repeat(val);
      num -= val * keys[i];
    }
    i++
  }
  return str;
}

convertToRoman(36);
