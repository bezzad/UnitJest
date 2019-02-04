// http://esprima.org/
// npm install esprima --save-dev
const esprima = require('esprima');

const estraverse = require("estraverse");

const fs = require('fs');

// read source code
var src = fs.readFileSync('test.js', 'utf8');

var ast = esprima.parse(src, { range: true, loc: true });

estraverse.traverse(ast, {
    enter: function (node, parent) {
        if (node.type == 'FunctionExpression' || node.type == 'FunctionDeclaration')
            return estraverse.VisitorOption.Skip;
    },
    leave: function (node, parent) {
        if (node.type == 'VariableDeclarator')
          console.log(node.id.name);
    },
    // Skip the `argument` property of each node
    fallback: function(node) {
        return Object.keys(node).filter(function(key) {
            return key !== 'argument';
        });
    }
});