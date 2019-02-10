/*--------------------------------------------------------------------------
 *--------------------- Automation Unit Test Generator ---------------------
 *---------------------  B.Khosravifar & E.Estedlali   ---------------------
 *--------------------------------------------------------------------------
 */

const fs = require('fs');
const esprima = require('esprima'); // http://esprima.org
const escodegen = require('escodegen'); // https://github.com/estools/escodegen
const js2flowchart = require("js2flowchart"); // https://github.com/Bogdan-Lyashenko/js-code-to-svg-flowchart
const styx = require('styx'); // https://github.com/mariusschulz/styx
const Viz = require('viz.js'); // https://github.com/mdaines/viz.js/wiki/Usage
const { Module, render } = require('viz.js/full.render.js');


const outputPath = "./output/";
const filePath = "./test-samples/fact.js";
const fileName = filePath.substring(filePath.lastIndexOf('/') + 1, filePath.lastIndexOf('.'));
const fileExt = filePath.substring(filePath.lastIndexOf('.') + 1);

const regenerateOpt = {
    format: {
        indent: {
            style: "    ", // Indent string. Default is 4 spaces ('    ').
            base: 0, // Base indent level.
            adjustMultilineComment: true // Adjust the indentation of multiline comments to keep asterisks vertically aligned.
        }, // The indent options
        newline: "\n", // New line string. Default is '\n'.
        space: " ", // White space string. Default is standard ' ' (\x20).
        json: true, // Enforce JSON format of numeric and string literals. This option takes precedence over option.format.hexadecimal and option.format.quotes.
        renumber: true, // Try to generate shorter numeric literals than toString() (9.8.1)
        hexadecimal: true, // Generate hexadecimal a numeric literal if it is shorter than its equivalents. Requires option.format.renumber.
        quotes: "double", // Delimiter to use for string literals. Accepted values are: 'single', 'double', and 'auto'. When 'auto' is specified, escodegen selects a delimiter that results in a shorter literal.
        escapeless: true, // Escape as few characters in string literals as necessary.
        compact: false, //  Do not include superfluous whitespace characters and line terminators.
        semicolons: true, // Preserve semicolons at the end of blocks and programs.
        parentheses: true, // Preserve parentheses in new expressions that have no arguments.
        safeConcatenation: true,
        preserveBlankLines: true
    }
};

//--------------------- read source code -----------------------------------
var src = fs.readFileSync(filePath, 'utf8');
//--------------------------------------------------------------------------


//---------------------- Parse JavaScript into AST -------------------------
var ast = esprima.parse(src); // generate AST with esprima
//--------------------------------------------------------------------------


// -------------------- preprocess and regenerate code ---------------------
src = escodegen.generate(ast, regenerateOpt);
ast = esprima.parse(src, { loc: true, range: true, comment: false });
//-------------------------------------------------------------------------


//---------------- create flow chart bt source code -----------------------
const svg = js2flowchart.convertCodeToSvg(src);
fs.writeFile(outputPath + "flowChart.svg", svg, "utf-8", (err) => {
    if (err) throw err;
    console.log('The "flowChart.svg" file has been saved!');
});
//--------------------------------------------------------------------------


//---------------- create flow program by styx parser ----------------------
var flowProgram = styx.parse(ast);
//--------------------------------------------------------------------------


//------------- create control-flow-graph program by styx ------------------
// https://github.com/mariusschulz/styx-cli/blob/master/src/index.js
// exported from styx-cli
function findFlowGraphAndNameForId(flowProgram, functionId) {
    if (!functionId) {
        return [flowProgram.flowGraph, "Main Program"];
    }

    for (let i = 0, length = flowProgram.functions.length; i < length; i++) {
        let fun = flowProgram.functions[i];

        if (fun.id === functionId) {
            return [fun.flowGraph, fun.name];
        }
    }

    throw Error(`Couldn't find function with id ${functionId}`);
}

// $ styx testfile.js --format dot --graph 1
var [flowGraph, name] = findFlowGraphAndNameForId(flowProgram, 1);
//--------------------------------------------------------------------------


//----------------- export as grapgviz DOT format --------------------------
var cfgObj = styx.exportAsObject(flowProgram);
var graphviz = styx.exportAsDot(flowGraph, name);
//--------------------------------------------------------------------------


//---------------------- visualize CFG as .svg format ----------------------
var viz = new Viz({ Module, render });
viz.renderString(graphviz)
    .then(result => {
        let file = outputPath + "cfg.svg";
        fs.writeFile(file, result, "utf-8", (err) => {
            if (err) throw err;
            console.log('The "cfg.svg" file has been saved!');
        });
        console.log(`CFG stored at ${file}`);
    })
    .catch(error => {
        // Create a new Viz instance (@see Caveats page for more info)
        viz = new Viz({ Module, render });

        // Possibly display the error
        console.error(error);
    });
//--------------------------------------------------------------------------


//-------------- modify AST by injecting extra instrumenting code --------------
const ins = require('./src/instrumentor.js');
var source = ins.instrument(src, ast, cfgObj);
fs.writeFile(outputPath + `${fileName}.instrumented.${fileExt}`, source, "utf-8", (err) => {
    if (err) throw err;
    console.log('The instrumented file has been saved!');
});
//--------------------------------------------------------------------------

console.log("END");
// $ jest test.js --collectCoverage