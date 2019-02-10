const esprima = require("esprima");
const util = require('./util');
const falafel = require('falafel'); // https://github.com/substack/node-falafel
const Cfg = require("./cfg");


module.exports = function instrument(src, cfgObj, funcName) {

    let covFuncName = "___covC";

    // analyze CFG by locational AST
    let cfg = new Cfg().parseStyx(cfgObj);


    //----------- add call coverage method to every cfg nodes -----------------
    var params = []
    var paramsCoverage = [];
    // http://tobyho.com/2013/12/20/falafel-source-rewriting-magicial-assert/
    src = falafel(src, node => {
        if (node.id && node.id.name && !funcName) {
            funcName = node.id.name;
        }
        if (node.type === "FunctionDeclaration") { // function f(){...}
            // console.log("FunctionDeclaration", node);
        }
        else if (node.type === "FunctionExpression") { // var f = function(){...};
            // console.log("FunctionExpression", node);
        }
        else {
            var nodes = cfg.nodesArray.filter(n => n.range && n.range[0] == node.start && n.range[1] == node.end);
            if (nodes.length > 0) {
                let cfgN = nodes[0];
                // console.log("id, node.type, start, source, node", cfgN.id, node.type, node.start, node.source().toString(), node)


                if (node.type === 'Identifier') {
                    params.push(node.source());
                    paramsCoverage.push(covFuncName + '(' + cfgN.id + ')');
                }
                else if (node.type === 'BinaryExpression') {
                    update(node, covFuncName + '(' + cfgN.id + ') && ' + node.source());
                }
                else if (node.type === 'VariableDeclarator') {
                    update(node.parent, covFuncName + '(' + cfgN.id + '); ' + node.parent.source());
                }
                else
                    update(node, covFuncName + '(' + cfgN.id + '); ' + node.source());

            }
        }
    }).toString();
    //-------------------------------------------------------------------------


    //----------------- create coverage method and add to source --------------
    let paramsSeq = params.join(', ');
    let cov =
        `
        /* This code automatically generated to runned on the sandbox and 
         * evaluated by system to genrate best unit tests. Please don't change 
         * it, because in next generation replaced by another codes. 
         */

        function run(${paramsSeq}) {
            let path = []; 
            function ${covFuncName}(id) { path.push(id); }

            ${paramsCoverage.join("; ")}
            ${src}

            return { value: ${funcName}(${paramsSeq}) , path }
        }
        `;
    //-------------------------------------------------------------------------

    var ast = esprima.parse(cov, { comment: true });

    return util.generate(ast);
}

function update(node, code) {
    if (node.parent && node.parent.consequent && 
        node.type !== 'BinaryExpression') {
        node.update("{ " + code + " }");
    }
    else {
        node.update(code);
    }
}