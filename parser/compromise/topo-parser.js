const nlp = require("compromise");

// Sample input text with structured grammar
let inputText =
   "I want a topology for 3 system bus topology, 4 system star topology, [within a ring topology: 2 system star topology, 3 system ring topology],[within a star topology: 2 system mesh topology, 3 system star topology], 3 system ring topology,3 system mesh topology";

// Define stop words to be removed
const stopWords = ["and", "there is"];

// Function to clean the text by removing stop words
function cleanText(text) {
  let doc = nlp(text);
  stopWords.forEach((word) => {
    doc = doc.not(word);
  });
  return doc.text();
}

// Function to extract systems and topologies
function extractTopologies(text) {
  let topologies = [];
	let matches = text.match(/(\d+) system (\w+ topology)/g);
	// console.log(matches)
  if (matches) {
    matches.forEach((match) => {
      let parts = match.match(/(\d+) system (\w+ topology)/);
      if (parts) {
        topologies.push({
          count: parseInt(parts[0]),
          type: parts[2],
        });
      }
    });
	}
	// console.log(topologies)
  return topologies;
}

// Function to process nested topologies
function processNestedTopologies(text) {
  let result = [];
	let outerMatches = text.split(/\[(.*?)\]/g);
	// console.log(outerMatches)

  outerMatches.forEach((part, index) => {
    if (index % 2 === 0) {
			result = result.concat(extractTopologies(part.trim()));
			// console.log("in if")
		} else {
			// console.log("in else")
      let nestedPart = part.trim();
      let withinMatch = nestedPart.match(/within a (\w+ topology): (.*)/);
      if (withinMatch) {
        let nestedType = withinMatch[1];
        let nestedTopologiesText = withinMatch[2];
        let nestedTopologies = extractTopologies(nestedTopologiesText);
        result.push({
          count: 1,
          type: nestedType,
          nested: nestedTopologies,
        });
      }
    }
  });

  return result;
}

// Clean the input text
let cleanedText = cleanText(inputText);

// Parse the cleaned text and convert the information into a JSON body
let parsedTopologies = processNestedTopologies(cleanedText);

// Function to list all entities
function listEntities(parsedTopologies) {
  let entities = [];
  function recurse(topologies) {
    topologies.forEach((topology) => {
      entities.push(`${topology.count} system ${topology.type}`);
      if (topology.nested) {
        recurse(topology.nested);
      }
    });
  }
  recurse(parsedTopologies);
  return entities;
}

let entitiesList = listEntities(parsedTopologies);
let jsonBody = JSON.stringify(
  {
    topologies: parsedTopologies,
    //entities: entitiesList,
  },
  null,
  2
);

console.log(jsonBody);
