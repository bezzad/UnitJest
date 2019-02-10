/**
 * The Depth First Search (DFS) will find all non-cyclical paths
 * between two nodes. This algorithm should be very fast 
 * and scale to large graphs (The graph data structure is 
 * sparse so it only uses as much memory as it needs to).
 * @param graph the graph edges array.
 */
function dfs(graph) {

}

module.exports = dfs;



// test

// this graph is directional
// var graph = new Graph();
// graph.addEdge("A", "B");
// graph.addEdge("A", "C");
// graph.addEdge("B", "A");
// graph.addEdge("B", "D");
// graph.addEdge("B", "E"); 
// graph.addEdge("B", "F");
// graph.addEdge("C", "A");
// graph.addEdge("C", "E");
// graph.addEdge("C", "F");
// graph.addEdge("D", "B");
// graph.addEdge("E", "C");
// graph.addEdge("E", "F");
// graph.addEdge("F", "B");
// graph.addEdge("F", "C");
// graph.addEdge("F", "E");

//All paths connecting B to E:
    //   B->E
    //   B->F->E
    //   B->F->C->E
    //   B->A->C->E
    //   B->A->C->F->E