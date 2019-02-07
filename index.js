/*--------------------------------------------------------------------------
 *--------------------- Automation Unit Test Generator ---------------------
 *---------------------  B.Khosravifar & E.Estedlali   ---------------------
 *--------------------------------------------------------------------------
 */


const filePath = "./test-samples/fact.js";
const fileName = filePath.substring(filePath.lastIndexOf('/') + 1, filePath.lastIndexOf('.'));
const fileExt = filePath.substring(filePath.lastIndexOf('.') + 1);


//--------------------- read source code -----------------------------------
const fs = require('fs');
var src = fs.readFileSync(filePath, 'utf8');
//--------------------------------------------------------------------------


//----------------- parse source code to create ast ------------------------
// http://esprima.org/
// npm install esprima --save-dev
const esprima = require('esprima');
var ast = esprima.parse(src); // generate AST with esprima
//--------------------------------------------------------------------------


// -------------------- preprocess and regenerate code ---------------------
// https://github.com/estools/escodegen
const escodegen = require('escodegen');
src = escodegen.generate(ast);
ast = esprima.parse(src, { loc: true, range: true, comment: true });
//-------------------------------------------------------------------------


//---------------- create flow program by styx parser ----------------------
// https://github.com/mariusschulz/styx
// npm install styx --save-dev
const styx = require('styx');
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
// https://github.com/mdaines/viz.js/wiki/Usage
// npm i viz.js --save-dev
const Viz = require('viz.js');
const { Module, render } = require('viz.js/full.render.js');
var viz = new Viz({ Module, render });

viz.renderString(graphviz)
    .then(result => {
        let file = "./output/cfg.svg";
        fs.writeFileSync(file, result);
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
var outPath = `./output/${fileName}.instrumented.${fileExt}`;
fs.writeFileSync(outPath, source);
//--------------------------------------------------------------------------




console.log("END");
// $ jest test.js --collectCoverage