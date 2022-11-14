const cli = require("cac")("spell-check-website");
const spellCheck = require("./index");
// const spellCheck = require("../dist/index.js");

(async () => {
    const args = process.argv.slice(2);
    cli.on("command:*", () => {
        console.info("Console --- UNKNOWN COMMAND");
    });

    cli.command("check <link>", "Check link")
        // .option("-r, --recursive", "Remove recursively")
        .action(async (link, options) => {
            // console.log("remove " + dir + (options.recursive ? " recursively" : ""));
            const res = await spellCheck(link);
            let ss = `Link: ${res.link}\n`;
            res.words.map((e) => {
                ss += `wrong: ${e.wrong}\t\t|\tcorrect: ${e.correct}\n`;
            });
            console.clear();
            console.log(ss);
        });

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
    const { version } = require("../package.json");
    cli.version(version);

    cli.parse();
    if (args.length === 0) {
        cli.outputHelp();
    }
})();
