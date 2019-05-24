// ------------ TEST ------------------
const assert = require("assert");
const Graph = require('../src/dft');

// Create a graph given in the above diagram 
var g = new Graph(4);
g.addEdge(0, 1)
g.addEdge(0, 2)
g.addEdge(0, 3)
g.addEdge(2, 0)
g.addEdge(2, 1)
g.addEdge(1, 3)

var hasPath = g.hasPath(2, 3); 
assert.ok(hasPath, "has at least one path from 2 to 3!");

var getPaths = g.getPaths(2, 3);
assert.equal(getPaths.length, 3, "the paths count is not 3!");
assert.ok(getPaths.find(p => p[0] === 2 && p[1] === 0 && p[2] === 1 && p[3] === 3), "the [2, 0, 1, 3] path not found!");
assert.ok(getPaths.find(p => p[0] === 2 && p[1] === 0 && p[2] === 3), "the [2, 0, 3] path not found!");
assert.ok(getPaths.find(p => p[0] === 2 && p[1] === 1 && p[2] === 3), "the [2, 1, 3] path not found!");
console.log("Test 1 passed");
// -------------------------------------------------------------------


g = new Graph(6);
g.addEdge("A", "B");
g.addEdge("A", "C");
g.addEdge("B", "A");
g.addEdge("B", "D");
g.addEdge("B", "E");
g.addEdge("B", "F");
g.addEdge("C", "A");
g.addEdge("C", "E");
g.addEdge("C", "F");
g.addEdge("D", "B");
g.addEdge("E", "C");
g.addEdge("E", "F");
g.addEdge("F", "B");
g.addEdge("F", "C");
g.addEdge("F", "E");

hasPath = g.hasPath('B', 'E'); 
assert.ok(hasPath, "has at least one path from B to E!");

getPaths = g.getPaths("B", "E");
assert.equal(getPaths.length, 5, "the paths count is not 5!");
assert.ok(getPaths.find(p => p[0] === 'B' && p[1] === 'E'), "the [B, E] path not found!");
assert.ok(getPaths.find(p => p[0] === 'B' && p[1] === 'F' && p[2] === 'E'), "the [B, F, E] path not found!");
assert.ok(getPaths.find(p => p[0] === 'B' && p[1] === 'F' && p[2] === 'C' && p[3] === 'E'), "the [B, F, C, E] path not found!");
assert.ok(getPaths.find(p => p[0] === 'B' && p[1] === 'A' && p[2] === 'C' && p[3] === 'E'), "the [B, A, C, E] path not found!");
assert.ok(getPaths.find(p => p[0] === 'B' && p[1] === 'A' && p[2] === 'C' && p[3] === 'F' && p[4] === 'E'), "the [B, A, C, F, E] path not found!");

console.log("Test 2 passed");
// -------------------------------------------------------------------


console.log("All test passed");