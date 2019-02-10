// https://github.com/mariusschulz/styx/blob/master/src/flow.ts

class Edge {
    constructor() {
        this.name = null;
        this.label = null;
        this.innerType = null;
        this.from = null;
        this.to = null;
        this.notCondition = false;
        this.type = null;
        // EdgeType:
        //     Normal = 0,
        //     Epsilon = 1,
        //     Conditional = 2,
        //     AbruptCompletion = 3
    }
}

class Node {
    constructor() {
        this.id = null;
        this.loc = null;
        this.range = null;
        this.type = null;
        // NodeType:
        //     Normal = 0,
        //     Entry = 1,
        //     SuccessExit = 2,
        //     ErrorExit = 3
    }

    get isStartNode() { return this.type == "Entry" }
    get isEndNode() { return this.type == "SuccessExit" }
}

class Cfg {
    constructor() {
        this.id = -1;
        this.func = "";
        this.edges = {};
        this.nodes = {};
        this.nodesArray = [];
        this.nodesByLine = {}; // todo
    }

    parseStyx(cfgObj) {
        if (cfgObj && cfgObj.functions && cfgObj.functions.length > 0) {
            let func = cfgObj.functions[0];
            this.func = func.name;
            this.id = func.id;
            if (func.flowGraph) {
                // read nodes
                if (func.flowGraph.nodes) {
                    for (let i = 0; i < func.flowGraph.nodes.length; i++) {
                        let n = func.flowGraph.nodes[i];
                        let node = new Node();
                        node.id = n.id;
                        node.type = n.type;
                        this.nodes[n.id] = node;
                        this.nodesArray.push(node);
                    }

                    // read edges
                    if (func.flowGraph.edges) {
                        for (let i = 0; i < func.flowGraph.edges.length; i++) {
                            let e = func.flowGraph.edges[i];
                            let edge = new Edge();
                            let beginNode = this.nodes[e.from];
                            edge.type = e.type;
                            edge.from = e.from;
                            edge.to = e.to;
                            edge.name = `${edge.from}-${edge.to}`;
                            edge.label = e.label;
                            if (e.data) {
                                edge.innerType = e.data.type;
                                if (e.data.loc) {
                                    beginNode.loc = e.data.loc;
                                    beginNode.range = e.data.range;
                                }
                                else {
                                    if (!beginNode.isStartNode && !beginNode.isEndNode)
                                        edge.notCondition = true;
                                    if (e.data.argument && e.data.argument.loc) {
                                        beginNode.loc = e.data.argument.loc;
                                        beginNode.range = e.data.argument.range;
                                    }
                                    else if (e.data.left && e.data.left.loc) {
                                        beginNode.loc = e.data.left.loc;
                                        beginNode.range = e.data.left.range;

                                        if (e.data.right && e.data.right.loc) {
                                            beginNode.loc.end = e.data.right.loc.end
                                            beginNode.range[1] = e.data.right.range[1];
                                        }
                                    }
                                }
                            }

                            this.edges[edge.name] = edge;
                        }
                    }
                }
            }
            this.setNodesByLine();
            return this;
        }
    }

    get edgesKeys() {
        return Object.keys(this.edges);
    }

    get nodesKeys() {
        return Object.keys(this.nodes);
    }

    setNodesByLine() {
        for (let i = 0; i < this.nodesArray.length; i++) {
            let node = this.nodesArray[i];
            if (node.loc)
                this.nodesByLine[node.loc.start.line] = node;
        }
    }
}
module.exports = Cfg;