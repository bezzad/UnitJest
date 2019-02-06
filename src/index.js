//--------------------------------------------------------------------------
//--------------------- Automation Unit Test Generator ---------------------
//---------------------  B.Khosravifar & E.Estedlali   ---------------------
//--------------------------------------------------------------------------


//--------------------- read source code -----------------------------------
const fs = require('fs');
var src = fs.readFileSync('./src/test.js', 'utf8');
//--------------------------------------------------------------------------


//----------------- parse source code to create ast ------------------------
// http://esprima.org/
// npm install esprima --save-dev
const esprima = require('esprima');
var ast = esprima.parse(src, { loc: true, range: false });
//--------------------------------------------------------------------------


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
// var cfgJson = styx.exportAsJson(flowProgram); console.log("json", json);
var cfg = styx.exportAsObject(flowProgram);
var grapgviz = styx.exportAsDot(flowGraph, name);
//--------------------------------------------------------------------------


//------------------ analyze CFG by code location --------------------------
if (cfg && cfg.functions) {
    cfg.functions.forEach(func => {
        console.log(`Test function <${func.name}>`, func);
        if (func.flowGraph && func.flowGraph.edges) {
            func.flowGraph.edges.forEach(edge => {
                console.log(`edge (${edge.type}) ${edge.from} --> ${edge.to}`);
                if (edge.data) {
                    if (edge.data.loc) {
                        console.warn(`data.loc: ${JSON.stringify(edge.data.loc)}`);
                    }
                    else if (edge.data.argument && edge.data.argument.loc) {
                        console.warn(`!(not) data.loc: ${JSON.stringify(edge.data.argument.loc)}`);
                    }
                }

            });
        }
    });
}
//--------------------------------------------------------------------------


//---------------------- visualize CFG as .svg format ----------------------
// https://github.com/mdaines/viz.js/wiki/Usage
// npm i viz.js --save-dev
const Viz = require('viz.js');
const { Module, render } = require('viz.js/full.render.js');
var viz = new Viz({ Module, render });

viz.renderString(grapgviz)
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
