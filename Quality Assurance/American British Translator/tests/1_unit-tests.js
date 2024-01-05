const chai = require('chai');
const assert = chai.assert;

const Translator = require('../components/translator.js');
const translator = new Translator();

suite('Unit Tests', () => {
    suite("Translate to British English", () => {
        test("Mangoes are my favorite fruit.", () => {
            const res = translator.translate("Mangoes are my favorite fruit.", "american-to-british");
            assert.strictEqual(res, 'Mangoes are my <span class="highlight">favourite</span> fruit.');
        });
        test("I ate yogurt for breakfast.", () => {
            const res = translator.translate("I ate yogurt for breakfast.", "american-to-british");
            assert.strictEqual(res, 'I ate <span class="highlight">yoghurt</span> for breakfast.');
        });
        test("We had a party at my friend's condo.", () => {
            const res = translator.translate("We had a party at my friend's condo.", "american-to-british");
            assert.strictEqual(res, 'We had a party at my friend\'s condo.');
        });
        test("Can you toss this in the trashcan for me?", () => {
            const res = translator.translate("Can you toss this in the trashcan for me?", "american-to-british");
            assert.strictEqual(res, 'Can you toss this in the <span class="highlight">bin</span> for me?');
        });
        test("The parking lot was full.", () => {
            const res = translator.translate("The parking lot was full.", "american-to-british");
            assert.strictEqual(res, 'The parking lot was full.');
        });
        test("Like a high tech Rube Goldberg machine.", () => {
            const res = translator.translate("Like a high tech Rube Goldberg machine.", "american-to-british");
            assert.strictEqual(res, 'Like a high tech Rube Goldberg machine.');
        });
        test("To play hooky means to skip class or work.", () => {
            const res = translator.translate("To play hooky means to skip class or work.", "american-to-british");
            assert.strictEqual(res, 'To play hooky means to skip class or work.');
        });
        test("No Mr. Bond, I expect you to die.", () => {
            const res = translator.translate("No Mr. Bond, I expect you to die.", "american-to-british");
            assert.strictEqual(res, 'No <span class="highlight">Mr</span> Bond, I expect you to die.');
        });
        test("Dr. Grosh will see you now.", () => {
            const res = translator.translate("Dr. Grosh will see you now.", "american-to-british");
            assert.strictEqual(res, '<span class="highlight">Dr</span> Grosh will see you now.');
        });
        test("Lunch is at 12:15 today.", () => {
            const res = translator.translate("Lunch is at 12:15 today.", "american-to-british");
            assert.strictEqual(res, 'Lunch is at <span class="highlight">12.15</span> today.');
        });
    });
    suite("Translate to American English", () => {
        test("We watched the footie match for a while.", () => {
            const res = translator.translate("We watched the footie match for a while.", "british-to-american");
            assert.strictEqual(res, 'We watched the <span class="highlight">soccer</span> match for a while.');
        });
        test("Paracetamol takes up to an hour to work.", () => {
            const res = translator.translate("Paracetamol takes up to an hour to work.", "british-to-american");
            assert.strictEqual(res, '<span class="highlight">Tylenol</span> takes up to an hour to work.');
        });
        test("First, caramelise the onions.", () => {
            const res = translator.translate("First, caramelise the onions.", "british-to-american");
            assert.strictEqual(res, 'First, <span class="highlight">caramelize</span> the onions.');
        });
        test("I spent the bank holiday at the funfair.", () => {
            const res = translator.translate("I spent the bank holiday at the funfair.", "british-to-american");
            assert.strictEqual(res, 'I spent the bank holiday at the funfair.');
        });
        test("I had a bicky then went to the chippy.", () => {
            const res = translator.translate("I had a bicky then went to the chippy.", "british-to-american");
            assert.strictEqual(res, 'I had a <span class="highlight">cookie</span> then went to the chippy.');
        });
        test("I've just got bits and bobs in my bum bag.", () => {
            const res = translator.translate("I've just got bits and bobs in my bum bag.", "british-to-american");
            assert.strictEqual(res, 'I\'ve just got bits and bobs in my bum bag.');
        });
        test("The car boot sale at Boxted Airfield was called off.", () => {
            const res = translator.translate("The car boot sale at Boxted Airfield was called off.", "british-to-american");
            assert.strictEqual(res, 'The car boot sale at Boxted Airfield was called off.');
        });
        test("Have you met Mrs Kalyani?", () => {
            const res = translator.translate("Have you met Mrs Kalyani?", "british-to-american");
            assert.strictEqual(res, 'Have you met <span class="highlight">Mrs.</span> Kalyani?');
        });
        test("Prof Joyner of King's College, London.", () => {
            const res = translator.translate("Prof Joyner of King's College, London.", "british-to-american");
            assert.strictEqual(res, '<span class="highlight">Prof.</span> Joyner of King\'s College, London.');
        });
        test("Tea time is usually around 4 or 4.30.", () => {
            const res = translator.translate("Tea time is usually around 4 or 4.30.", "british-to-american");
            assert.strictEqual(res, 'Tea time is usually around 4 or <span class="highlight">4:30.</span>');
        });
    });
    suite("Highlight translation in", () => {
        test("Mangoes are my favorite fruit.", () => {
            const res = translator.translate("Mangoes are my favorite fruit.", "american-to-british");
            assert.include(res, '<span class="highlight">favourite</span>');
        });
        test("I ate yogurt for breakfast.", () => {
            const res = translator.translate("I ate yogurt for breakfast.", "american-to-british");
            assert.include(res, '<span class="highlight">yoghurt</span>');
        });
        test("We watched the footie match for a while.", () => {
            const res = translator.translate("We watched the footie match for a while.", "british-to-american");
            assert.include(res, '<span class="highlight">soccer</span>');
        });
        test("Paracetamol takes up to an hour to work.", () => {
            const res = translator.translate("Paracetamol takes up to an hour to work.", "british-to-american");
            assert.include(res, '<span class="highlight">Tylenol</span>');
        });
    });
});
