function telephoneCheck(str) {
  const arr = [/^1{0,1} *\d{3}-\d{3}-\d{4}/,
  /^1{0,1} *\(\d{3}\)\d{3}-\d{4}/,
  /^1{0,1} *\(\d{3}\) \d{3}-\d{4}/,
  /^1{0,1} *\d{3} \d{3} \d{4}/,
  /^1{0,1} *\d{10}$/];
  
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].test(str)) return true;
  }
  return false;
}

telephoneCheck("555-555-5555");
