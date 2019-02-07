exports.instrument = function (src, ast, cfgObj) {

    var Instrument = require("./instrument");
    var { ast, expressions, nameOfSpy } = Instrument(src, ast);

    const escodegen = require('escodegen');
    src = escodegen.generate(ast);










    let srcLines = src.split("\r\n");
    const lineCounter = Array.apply(null, new Array(srcLines.length)).map(Number.prototype.valueOf, 0);
    // lineCounter[1]++; // test line coverage

    const esprima = require('esprima');

    //------------------ analyze CFG by code location --------------------------
    const CFG = require("./cfg");
    var cfg = new CFG().parseStyx(cfgObj);
    //--------------------------------------------------------------------------

    // var tokens = esprima.tokenize(src, { loc: true, range: true, comment: true });
    // console.log("tokens", tokens);

    let nodesKeys = cfg.nodesKeys;
    for (let n = nodesKeys.length - 1; n >= 0; n--) {
        let node = cfg.nodes[nodesKeys[n]];
        if (node.loc) {
            if (!node.isStartNode) {

            }
        }
    }
    // for (let t = tokens.length - 2, tnb = tokens[t - 1], tn = tokens[t], tna = tokens[t + 1];
    //     t > 0; t-- , tnb = tokens[t - 1], tn = tokens[t], tna = tokens[t + 1]) {

    //     if (tn.type == "Punctuator" &&
    //         (tn.value == ";" || tn.value == "{" || tn.value == "}")) {
    //         src = src.insert(tn.range[1], "\n\r");
    //     }
    // }

    // ---------------------------- regenerate code ----------------------------
    // https://github.com/estools/escodegen
    // const escodegen = require('escodegen');
    // src = escodegen.generate(ast);
    //-------------------------------------------------------------------------

    return src;
}

String.prototype.insert = function (index, value) {
    return this.slice(0, index) + value + this.slice(index);
}

function injectCode(ast, script) {
    var new_expr = {
        type: "CallExpression",
        callee: {
            type: "MemberExpression",
            computed: false,
            object: null,
            property: {
                type: "Identifier",
                name: "toArray"
            }
        },
        arguments: []
    };

    const ast3 = esprima.parse('db.find()');
    estraverse.traverse(ast, {
        leave: function (node, parent) {
            if (node.type === esprima.Syntax.ExpressionStatement) {
                new_expr.callee.object = node.expression;
                node.expression = new_expr;
                return this.break();
            }
        },
    });
}