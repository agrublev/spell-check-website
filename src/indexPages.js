// const main = require("./index");
const Spider = require("node-spider");
const fs = require("fs");
const path = require("path");

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

const handleRequest = function (doc) {
    // new page crawled
    // console.log(Object.keys(doc.res)); // response object
    console.log(doc.url); // page url
    // uses cheerio, check its docs for more info
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
    console.log("tex", text);
    fs.writeFile("./test.txt", text);
    // doc.$('a').each(function(i, elem) {
    //     // do stuff with element
    //     var href = doc.$(elem).attr('href').split('#')[0];
    //     var url = doc.resolve(href);
    //     // crawl more
    //     spider.queue(url, handleRequest);
    // });
};

// start crawling

const main = async () => {
    console.clear();
    let txt = await fs.readFileSync(path.resolve("./src/text.txt"), "utf8");
    console.log("t", txt);
    let lines = txt.split("\n").filter((e) => e.trim().length > 1);
    let pages = {};
    let currentPage = "";
    lines.map((line) => {
        if (line.startsWith("https://freedcamp.com")) {
            currentPage = line;
            pages[currentPage] = [];
        } else {
            pages[currentPage].push(line);
        }
    });
    Object.keys(pages).map((page) => {
        pages[page] = pages[page].join("\n ");
    });
    console.log("pages", pages);
    await fs.writeFileSync(path.resolve("./src/pages.json"), JSON.stringify(pages), "utf8");
    // spider.queue("https://freedcamp.com/?force_front=c", handleRequest);
};

(async () => {
    await main();
})();

// module.exports = main;
