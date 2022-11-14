const Spider = require("node-spider");
const fs = require("fs");
const path = require("path");
const spell = require("spell-checker-js");
const spelling = require("spelling"),
    dictionary = require("spelling/dictionaries/en_US.js");
let dict = new spelling(dictionary);

spell.load("en");
const spider = new Spider({
    // How many requests can be run in parallel
    concurrent: 5,
    // How long to wait after each request
    delay: 0,
    // A stream to where internal logs are sent, optional
    logs: process.stderr,
    // Re-visit visited URLs, false by default
    allowDuplicates: false,
    // If `true` all queued handlers will be try-catch'd, errors go to `error` callback
    catchErrors: true,
    // If `true` the spider will set the Referer header automatically on subsequent requests
    addReferrer: false,
    // If `true` adds the X-Requested-With:XMLHttpRequest header
    xhr: false,
    // If `true` adds the Connection:keep-alive header and forever option on request module
    keepAlive: false,
    // Called when there's an error, throw will be used if none is provided
    error: function (err, url) {},
    // Called when there are no more requests
    done: function () {},

    //- All options are passed to `request` module, for example:
    headers: { "user-agent": "node-spider" },
    encoding: "utf8",
});

const handleRequest = async function (doc) {
    // new page crawled
    // console.log(Object.keys(doc.res)); // response object
    // console.log(doc.url); // page url
    // // uses cheerio, check its docs for more info
    doc.$("header.header").remove();
    doc.$("img").remove();
    doc.$("section.experience").remove();
    doc.$("footer.footer").remove();
    doc.$(".words").remove();
    doc.$(".testimonials-center").remove();
    doc.$("a").remove();
    doc.$("svg").remove();
    doc.$("script").remove();
    let text = doc.$("body").text();
    text = text
        .split("\n")
        .map((e) => e.trim())
        .filter((e) => e.trim().length > 3)
        .join("\n")
        .trim();
    const fixed = check(text);

    return { link: doc.url, words: fixed };
    // fs.writeFile("./test.txt", text);
    // doc.$('a').each(function(i, elem) {
    //     // do stuff with element
    //     var href = doc.$(elem).attr('href').split('#')[0];
    //     var url = doc.resolve(href);
    //     // crawl more
    //     spider.queue(url, handleRequest);
    // });
};

// start crawling

const check = (text) => {
    dict.insert("Freedcamp", 999999);
    dict.insert("apps", 999999);
    let pageCorrections = {};
    let wrongWord = text;
    const checked = spell.check(wrongWord);
    let wordsFix = [];
    checked
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

    // console.log("pageCorrections", pageCorrections);
    return pageCorrections;
};
const main = async (link) => {
    console.clear();
    // let txt = await fs.readFileSync(path.resolve("./src/text.txt"), "utf8");
    // console.log("t", txt);
    // let lines = txt.split("\n").filter((e) => e.trim().length > 1);
    // let pages = {};
    // let currentPage = "";
    // lines.map((line) => {
    //     if (line.startsWith("https://freedcamp.com")) {
    //         currentPage = line;
    //         pages[currentPage] = [];
    //     } else {
    //         pages[currentPage].push(line);
    //     }
    // });
    // Object.keys(pages).map((page) => {
    //     pages[page] = pages[page].join("\n ");
    // });
    // console.log("pages", pages);
    // await fs.writeFileSync(path.resolve("./src/pages.json"), JSON.stringify(pages), "utf8");
    return new Promise((r) => {
        spider.queue(link, (doc) => {
            let response = handleRequest(doc);
            r(response);
        });
    });
};

// (async () => {
//     await main();
// })();

module.exports = main;
