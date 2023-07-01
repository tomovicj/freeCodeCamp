function palindrome(str) {
  const arr = str.split("").reduce((arr, letter) => {
    if (/[a-z0-9]/i.test(letter)) {
      arr.push(letter.toLowerCase());
    }
    return arr;
  }, []);

  for (let i = 0; i < arr.length / 2; i++) {
    if (arr[i] != arr[arr.length - 1 - i]) return false;  
  }
  return true;
}

palindrome("eye");
