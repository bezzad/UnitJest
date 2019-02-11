'use strict';

/**
 * Javascript program to get all paths from a source to destination.
 * This class represents a directed graph. Using adjacency list representation.
 * 
 * Depth-First graph searching (DFS) algorithm.
 * Returns whether there's a path between two nodes in a graph.<br><br>
 * Time complexity: O(|V|^2).
 *
 * @module src/dft
 * @public
 * @param {Array} graph Adjacency matrix, which represents the graph.
 * @param {Number} start Start node.
 * @param {Number} goal Target node.
 * @return {Boolean} Returns true if path between two nodes exists.
 *
 * @example
 * const Graph = require('./src/dft');
 * var g = new Graph(4);
 * g.addEdge(0, 1);
 * g.addEdge(0, 2);
 * g.addEdge(0, 3); 
 * g.addEdge(2, 0); 
 * g.addEdge(2, 1); 
 * g.addEdge(1, 3);
 * 
 * var hasPath = g.hasPath(2, 3);   // true
 * var getPaths = g.getPaths(2, 3); // [ [2, ..., 3], [2, ..., 3], [2, ..., 3] ]
 */
class Graph {

    constructor(vertices) {
        //No. of vertices 
        this.V = vertices;

        // default dictionary to store graph 
        this.graph = {};

        // keep all found paths
        this.paths = [];
    }

    /** 
     * A function to add an edge to graph from 'u' to 'v' nodes. 
     * @private
     * @param {Number} s Start node.
     * @param {Number} v End node.
     */ 
    addEdge(u, v) {
        this.graph[u] = (this.graph[u] || []);
        this.graph[u].push(v);
    }

	/** 
     * A recursive function to print all paths from 'u' to 'd'. 
     * @private
     * @param {Number} s Start node.
     * @param {Number} d Target node.
     * @param {Array} visited keeps track of vertices in current path.
     * @param {Array} path stores actual vertices and path_index is current index in path[].
     */
    getInnerPaths(u, d, visited, path) {

        // Mark the current node as visited and store in path 
        visited[u] = true;
        path.push(u);

        // If current vertex is same as destination, then print 
        // current path[] 
        if (u === d)
            this.paths.push(path.slice()); // path copied and keeped in paths
        else {
            // If current vertex is not destination 
            //Recur for all the vertices adjacent to this vertex 
            for (let i = 0; i < this.graph[u].length; i++) {
                let n = this.graph[u][i];
                if (visited[n] != true) {
                    this.getInnerPaths(n, d, visited, path);
                }
            }
        }

        // Remove current vertex from path[] and mark it as unvisited 
        path.pop();
        visited[u] = false;
    }

    /**
     * Get all paths from 's' to 'd' 
     * @public
     * @param {Number} s Start node.
     * @param {Number} d Target node.
     * @return {Array} Return array of paths between s and d
     * like: [ [s, ..., d], [s, ..., d], [s, ..., d] ]
     */
    getPaths(s, d) {

        // Mark all the vertices as not visited 
        var visited = {};

        // Create an array to store paths 
        var path = [];

        // Call the recursive helper function to print all paths 
        this.getInnerPaths(s, d, visited, path);

        return this.paths;
    }

    /**
     * Depth-First graph searching algorithm.
     * Returns whether there's a path between two nodes in a graph.<br><br>
     * Time complexity: O(|V|^2).
     * 
     * @public
     * @param {Number} s Start node.
     * @param {Number} d Target node.
     * @return {Boolean} Returns true if path between two nodes exists.
     */
    hasPath(s, d) {
        var stack = [];
        var visited = [];
        var node;
        stack.push(s);
        visited[s] = true;
        while (stack.length) {
            node = stack.pop();
            if (node === d) {
                return true;
            }
            for (var i = 0; i < this.graph[node].length; i += 1) {
                let n = this.graph[node][i];
                if (n && !visited[n]) {
                    stack.push(n);
                    visited[n] = true;
                }
            }
        }
        return false;
    }
}

module.exports = Graph;