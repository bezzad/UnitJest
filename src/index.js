// http://esprima.org/
// npm install esprima --save-dev
const esprima = require('esprima');

// https://github.com/mariusschulz/styx
// npm install styx --save-dev
const styx = require('styx');

const fs = require('fs');

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


//--------------------- read source code -----------------------------------
var src = fs.readFileSync('./src/test.js', 'utf8');
//--------------------------------------------------------------------------

//----------------- parse source code to create ast ------------------------
var ast = esprima.parse(src, { loc: true, range: false });
//--------------------------------------------------------------------------

// create control-flow-graph program
var flowProgram = styx.parse(ast);

// $ styx testfile.js --format dot --graph 1
let [flowGraph, name] = findFlowGraphAndNameForId(flowProgram, 1);
// var cfgJson = styx.exportAsJson(flowProgram); console.log("json", json);
var cfg = styx.exportAsObject(flowProgram); console.log("cfg", cfg.functions[0]);
var grapgviz = styx.exportAsDot(flowGraph, name); console.log("grapgviz", grapgviz);

// https://github.com/mdaines/viz.js/wiki/Usage
// npm i viz.js --save-dev
const Viz = require('viz.js');
const { Module, render } = require('viz.js/full.render.js');
let viz = new Viz({ Module, render });

viz.renderString(grapgviz)
    .then(result => {
        fs.writeFileSync("./output/cfg.svg", result);
        console.log("CFG stored in test-cfg.svg");
    })
    .catch(error => {
        // Create a new Viz instance (@see Caveats page for more info)
        viz = new Viz({ Module, render });

        // Possibly display the error
        console.error(error);
    });
