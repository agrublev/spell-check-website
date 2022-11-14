"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var Spider = require("node-spider");
var fs = require("fs");
var path = require("path");
var spell = require("spell-checker-js");
var spelling = require("spelling"),
  dictionary = require("spelling/dictionaries/en_US.js");
var dict = new spelling(dictionary);
spell.load("en");
var spider = new Spider({
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
  error: function error(err, url) {},
  // Called when there are no more requests
  done: function done() {},
  //- All options are passed to `request` module, for example:
  headers: {
    "user-agent": "node-spider"
  },
  encoding: "utf8"
});
var handleRequest = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(doc) {
    var text, fixed;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
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
            text = doc.$("body").text();
            text = text.split("\n").map(function (e) {
              return e.trim();
            }).filter(function (e) {
              return e.trim().length > 3;
            }).join("\n").trim();
            fixed = check(text);
            return _context.abrupt("return", {
              link: doc.url,
              words: fixed
            });
          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return function handleRequest(_x) {
    return _ref.apply(this, arguments);
  };
}();

// start crawling

var check = function check(text) {
  dict.insert("Freedcamp", 999999);
  dict.insert("apps", 999999);
  var pageCorrections = {};
  var wrongWord = text;
  var checked = spell.check(wrongWord);
  var wordsFix = [];
  checked.filter(function (e) {
    var skip = false;
    e.split("").map(function (ss) {
      if (/^\d+$/.test(ss)) skip = true;
    });
    if (e === "Freedcamp") skip = true;
    return !skip;
  }).map(function (word) {
    var look = dict.lookup(word);
    var ob = {
      wrong: word
    };
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
var main = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(link) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
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
            return _context2.abrupt("return", new Promise(function (r) {
              spider.queue(link, function (doc) {
                var response = handleRequest(doc);
                r(response);
              });
            }));
          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return function main(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

// (async () => {
//     await main();
// })();

module.exports = main;