const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

class Translator {
    translate(text, lang) {
        if (lang != "american-to-british" && lang != "british-to-american") {
            return null;
        }

        const words = text.split(" ");

        if (lang == "american-to-british") {
            for (let i = 0; i < words.length; i++) {
                const word = words[i].toLowerCase();
                if (americanOnly[word]) {
                    words[i] = highlight(americanOnly[word]);
                    continue;
                }
                if (americanToBritishSpelling[word]) {
                    words[i] = highlight(americanToBritishSpelling[word]);
                    continue;
                }
                if (americanToBritishTitles[word]) {
                    words[i] = highlight(capitalizeFirstLetter(americanToBritishTitles[word]));
                    continue;
                }
                if (/\d{1,2}:\d{1,2}/.test(word)) {
                    words[i] = highlight(word.replace(":", "."));
                    continue;
                }
            }
        } else if (lang == "british-to-american") {
            for (let i = 0; i < words.length; i++) {
                const word = words[i].toLowerCase();
                if (britishOnly[word]) {
                    words[i] = highlight(britishOnly[word]);
                    continue;
                }
                const spelling = getKeyByValue(americanToBritishSpelling, word);
                if (spelling) {
                    words[i] = highlight(spelling);
                    continue;
                }
                const titles = getKeyByValue(americanToBritishTitles, word);
                if (titles) {
                    words[i] = highlight(capitalizeFirstLetter(titles));
                    continue;
                }
                if (/\d{1,2}.\d{1,2}/.test(word)) {
                    words[i] = highlight(word.replace(".", ":"));
                    continue;
                }
            }
        }

        return words.join(" ");


        function highlight(word) {
            return `<span class="highlight">${word}</span>`
        }

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        function getKeyByValue(object, value) {
            return Object.keys(object).find(key => object[key] === value);
        }
    }
}

module.exports = Translator;