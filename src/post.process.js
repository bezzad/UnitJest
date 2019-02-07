exports.postprocess = function (src, ast, cfgObj) {
    const esprima = require('esprima');

    //------------------ analyze CFG by code location --------------------------
    const c = require("./cfg");
    var cfg = new c.Cfg().parseStyx(cfgObj);
    //--------------------------------------------------------------------------

    var tokens = esprima.tokenize(src, { loc: true, range: true, comment: true });
    console.log("tokens", tokens);

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
    const escodegen = require('escodegen');
    src = escodegen.generate(ast);
    //-------------------------------------------------------------------------

    return src;
}

String.prototype.insert = function (index, value) {
    return this.slice(0, index) + value + this.slice(index);
}