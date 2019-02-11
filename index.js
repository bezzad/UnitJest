/*--------------------------------------------------------------------------
 *--------------------- Automation Unit Test Generator ---------------------
 *---------------------  B.Khosravifar & E.Estedlali   ---------------------
 *--------------------------------------------------------------------------
 */

const fs = require('fs');
const esprima = require('esprima'); // http://esprima.org
const util = require('./src/util');
const Graph = require('./src/dft');
const instrument = require('./src/instrument.js');
const babel = require("@babel/core"); // https://babeljs.io
const styx = require('styx'); // https://github.com/mariusschulz/styx
const js2flowchart = require("js2flowchart"); // https://github.com/Bogdan-Lyashenko/js-code-to-svg-flowchart
const Viz = require('viz.js'); // https://github.com/mdaines/viz.js/wiki/Usage
const { Module, render } = require('viz.js/full.render.js');


const outputPath = "./output/";
const filePath = "./test-samples/fact.js";
const fileName = filePath.substring(filePath.lastIndexOf('/') + 1, filePath.lastIndexOf('.'));
const fileExt = filePath.substring(filePath.lastIndexOf('.') + 1);



//--------------------- read source code -----------------------------------
var src = fs.readFileSync(filePath, 'utf8');
console.info(`The "${fileName}.${fileExt}" source codes loaded`);
//--------------------------------------------------------------------------


//---------------------- Parse JavaScript into AST -------------------------
// convert any newest ES to ES5
var { code } = babel.transformSync(src, {
    ast: false,
    code: true,
    plugins: [
        // EntryTarget
        '@babel/plugin-transform-classes',

        // [EntryTarget, EntryOptions]
        ['@babel/plugin-transform-arrow-functions', { spec: true }],

        // [EntryTarget, EntryOptions, string]
        ['@babel/plugin-transform-for-of', { loose: true }, "some-name"],

        // ConfigItem
        babel.createConfigItem(require("@babel/plugin-transform-spread")),
    ],
});
console.info(`"${fileName}" source converted to ES5 by babel`);
var ast = esprima.parse(code); // generate AST with esprima
//--------------------------------------------------------------------------


// -------------------- preprocess and regenerate code ---------------------
console.info(`preprocessing "${fileName}" source for formatting code style...`)
src = util.generate(ast);
ast = esprima.parse(src, { loc: true, range: true, comment: false });
console.info(`The AST of "${fileName}" source Parsed`);
//-------------------------------------------------------------------------


//---------------- create flow chart bt source code -----------------------
try {
    const svg = js2flowchart.convertCodeToSvg(src);
    fs.writeFile(outputPath + "flowChart.svg", svg, "utf-8", (err) => {
        if (err) throw err;
        console.log('The "flowChart.svg" file has been saved');
    });
}
catch (ex) {
    console.log("Error at js2flowchart:", ex);
}
//--------------------------------------------------------------------------


//---------------- create flow program by styx parser ----------------------
console.info(`creating the source flow program...`);
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
console.info(`Control flow graph (CFG) graphviz data exported`);
//--------------------------------------------------------------------------


//---------------------- visualize CFG as .svg format ----------------------
var viz = new Viz({ Module, render });
viz.renderString(graphviz)
    .then(result => {
        let file = outputPath + "cfg.svg";
        fs.writeFile(file, result, "utf-8", (err) => {
            if (err) throw err;
            console.log(`The ${file} file has been saved`);
        });
    })
    .catch(error => {
        // Create a new Viz instance (@see Caveats page for more info)
        viz = new Viz({ Module, render });

        // Possibly display the error
        console.error(error);
    });
//--------------------------------------------------------------------------


//-------------- modify AST by injecting extra instrumenting code --------------
var source = instrument(src, cfgObj);
let insPath = outputPath + `${fileName}.instrumented.${fileExt}`;
fs.writeFile(insPath, source, "utf-8", (err) => {
    if (err) throw err;
    console.log(`The instrumented file has been saved at ${insPath}`);
});
//--------------------------------------------------------------------------

console.log("----------- END -------------");
// $ jest test.js --collectCoverage