import BusTopology from "./basic/bus.js";
import RingTopology from "./basic/ring.js";
import MeshTopology from "./basic/mesh.js";
import StarTopology from "./basic/star.js";

// Function to map topology types to classes
function getTopologyClass(type) {
  switch (type) {
    case "bus topology":
      return BusTopology;
    case "ring topology":
      return RingTopology;
    case "mesh topology":
      return MeshTopology;
    case "star topology":
      return StarTopology;
    default:
      throw new Error(`Unknown topology type: ${type}`);
  }
}

// Recursive function to process topologies and nested topologies
function processTopologies(topologyData) {
  let topologies = [];

  topologyData.forEach((topo) => {
    let TopologyClass = getTopologyClass(topo.type);
    let topologyInstance = new TopologyClass(topo.count);

    // If there are nested topologies, process them recursively
    if (topo.nested && Array.isArray(topo.nested)) {
      topologyInstance.nested = processTopologies(topo.nested);
    }

    topologies.push(topologyInstance);
  });

  return topologies;
}

// Example JSON input
let inputJson = {
  topologies: [
    {
      count: 3,
      type: "bus topology",
    },
    {
      count: 4,
      type: "star topology",
    },
    {
      count: 1,
      type: "ring topology",
      nested: [
        {
          count: 2,
          type: "star topology",
        },
        {
          count: 3,
          type: "ring topology",
        },
      ],
    },
    {
      count: 1,
      type: "star topology",
      nested: [
        {
          count: 2,
          type: "mesh topology",
        },
        {
          count: 3,
          type: "star topology",
        },
      ],
    },
    {
      count: 3,
      type: "ring topology",
    },
    {
      count: 3,
      type: "mesh topology",
    },
  ],
};


// Process the input JSON to create topology instances
let topologies = processTopologies(inputJson.topologies);

// Output the created topology instances
console.log(topologies);


