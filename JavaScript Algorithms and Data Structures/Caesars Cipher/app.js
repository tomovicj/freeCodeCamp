function rot13(str) {
  // Array containing the alphabet
  const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  const letters = str.split("");
  const arr = letters.map(letter => {
    if (!/[A-Z]/.test(letter)) return letter;
    const index = alphabet.indexOf(letter);
    const newIndex = index - 13;
    if (newIndex >= 0) return alphabet[newIndex];
    return alphabet[alphabet.length + newIndex];
  });
  return arr.join("");
}

rot13("SERR PBQR PNZC");
