"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var cli = require("cac")("spell-check-website");
var spellCheck = require("./index");
// const spellCheck = require("../dist/index.js");

(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
  var args, _require, version;
  return _regenerator["default"].wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          args = process.argv.slice(2);
          cli.on("command:*", function () {
            console.info("Console --- UNKNOWN COMMAND");
          });
          cli.command("check <link>", "Check link")
          // .option("-r, --recursive", "Remove recursively")
          .action( /*#__PURE__*/function () {
            var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(link, options) {
              var res, ss;
              return _regenerator["default"].wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.next = 2;
                      return spellCheck(link);
                    case 2:
                      res = _context.sent;
                      ss = "Link: ".concat(res.link, "\n");
                      res.words.map(function (e) {
                        ss += "wrong: ".concat(e.wrong, "\t\t|\tcorrect: ").concat(e.correct, "\n");
                      });
                      console.clear();
                      console.log(ss);
                    case 7:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _callee);
            }));
            return function (_x, _x2) {
              return _ref2.apply(this, arguments);
            };
          }());

          // cli.option("--type [type]", "Choose a project type", {
          //     default: "node",
          // });
          // cli.option("--name <name>", "Provide your name");
          //
          // cli.command("lint [...files]", "Lint files").action((files, options) => {
          //     console.log(files, options);
          // });

          // Display help message when `-h` or `--help` appears
          cli.help();
          // Display version number when `-h` or `--help` appears
          _require = require("../package.json"), version = _require.version;
          cli.version(version);
          cli.parse();
          if (args.length === 0) {
            cli.outputHelp();
          }
        case 8:
        case "end":
          return _context2.stop();
      }
    }
  }, _callee2);
}))();