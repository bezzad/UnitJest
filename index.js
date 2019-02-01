// https://github.com/mariusschulz/styx
// npm install styx --save-dev
const Styx = require('styx');

// npm install esprima --save-dev
const Esprima = require('esprima');

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

// read source code
var src = fs.readFileSync('test.js', 'utf8');

// parse source code tokens
var ast = Esprima.parse(src);

// create control-flow-graph program
var flowProgram = Styx.parse(ast);
var json = Styx.exportAsJson(flowProgram);

// $ styx testfile.js --format dot --graph 1
let [flowGraph, name] = findFlowGraphAndNameForId(flowProgram, 1);
var grapgviz = Styx.exportAsDot(flowGraph, name);

// npm i viz.js --save-dev
const Viz = require('viz.js');
const { Module, render } = require('viz.js/full.render.js');
let viz = new Viz({ Module, render });

viz.renderString(grapgviz)
  .then(result => {
    fs.writeFileSync("test-cfg.svg", result);
    console.log("CFG stored in test-cfg.svg");
  })
  .catch(error => {
    // Create a new Viz instance (@see Caveats page for more info)
    viz = new Viz({ Module, render });

    // Possibly display the error
    console.error(error);
  });
