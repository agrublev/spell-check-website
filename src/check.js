const spelling = require("spelling"),
    dictionary = require("spelling/dictionaries/en_US.js");
let dict = new spelling(dictionary);
dict.insert("Freedcamp", 999999);
dict.insert("apps", 999999);

const spell = require("spell-checker-js");
spell.load("en");

const check = (text) => {
    let pageCorrections = {};
    let wrongWord = text;
    const check = spell.check(wrongWord);
    let wordsFix = [];
    check
        .filter((e) => {
            let skip = false;
            e.split("").map((ss) => {
                if (/^\d+$/.test(ss)) skip = true;
            });
            if (e === "Freedcamp") skip = true;
            return !skip;
        })
        .map((word) => {
            let look = dict.lookup(word);
            let ob = { wrong: word };
            if (!look.found && look.suggestions.length > 0) {
                ob.correct = look.suggestions[0].word;
                wordsFix.push(ob);
            }
            // let correctSpell = spellcheck(word);
            // console.log("Wrong word : " + word);
            // console.log("Corrected word : " + correctSpell.query);
        });
    pageCorrections = wordsFix;

    console.log("pageCorrections", pageCorrections);
    return pageCorrections;
};
// (async () => {
//     await main();
// })();
module.export = check;
// let spellcheck = require("./check/domain-based-spellchecker");
