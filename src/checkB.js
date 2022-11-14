const spelling = require("spelling"),
    dictionary = require("spelling/dictionaries/en_US.js");
let dict = new spelling(dictionary);
let pages = require("./pages.json");
dict.insert("Freedcamp", 999999);
dict.insert("apps", 999999);
dict.insert("Gmail", 999999);
dict.insert("Quora", 999999);
dict.insert("SaaS", 999999);
dict.insert("LLC", 999999);
dict.insert("Kanban", 999999);
dict.insert("Gantt", 999999);
dict.insert("CRM", 999999);
dict.insert("emails", 999999);
dict.insert("Zapier", 999999);
dict.insert("-", 999999);
dict.insert("SSO", 999999);
dict.insert("SAML", 999999);
dict.insert("AWS", 999999);
dict.insert("PDFs", 999999);
dict.insert("Wikis", 999999);
dict.insert("Figma", 999999);
dict.insert("stakeholders", 999999);
dict.insert("firewalls", 999999);
dict.insert("Citrix", 999999);
dict.insert("Vimeo", 999999);
dict.insert("QA", 999999);
dict.insert("NPO", 999999);

const spell = require("spell-checker-js");

// Load dictionary
spell.load("en");

// Checking text

const main = async () => {
    let pageCorrections = {};
    Object.keys(pages).map((page) => {
        let wrongWord = pages[page];
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
        pageCorrections[page] = wordsFix;
    });
    Object.keys(pageCorrections).map((page) => {
        if (pageCorrections[page].length === 0) {
            delete pageCorrections[page];
        }
    });
    console.log("pageCorrections", pageCorrections);
};
(async () => {
    await main();
})();

// let spellcheck = require("./check/domain-based-spellchecker");
