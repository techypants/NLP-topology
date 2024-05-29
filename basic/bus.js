class Node {
  constructor(id) {
    this.id = id;
    this.connectedNodes = [];
  }
  connectTo(node) {
    this.connectedNodes.push(node);
  }
  getConnectedNodes() {
    return this.connectedNodes;
  }
}

export default class BusTopology {
  constructor(numNodes) {
    this.nodes = [];

    for (let i = 0; i < numNodes; i++) {
      this.nodes.push(new Node(i));
    }
    const bus = new Node("bus");
    for (let i = 0; i < numNodes; i++) {
      const currentNode = this.nodes[i];
      currentNode.connectTo(bus);
    }
  }
  getNode(id) {
    return this.nodes[id];
  }
}

// const bus = new BusTopology(6);
// const bus0 = bus.getNode(0);
// const connections = bus0.getConnectedNodes();
// console.log(bus0)

// module.exports = BusTopology;
