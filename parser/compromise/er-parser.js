const nlp = require("compromise");
const nlpDates = require("compromise-dates");

nlp.plugin(nlpDates);

function parseInput(text) {
  let doc = nlp(text);

  let people = doc.people().out("array");
  let dates = doc.dates().out("array"); // This should now work with the plugin
  let places = doc.places().out("array");
  let organizations = doc.organizations().out("array");

  let relationships = [];

  // Example heuristic to find relationships in the text
  // This can be expanded with more sophisticated logic
  if (people.length > 0 && dates.length > 0) {
    people.forEach((person) => {
      dates.forEach((date) => {
        relationships.push({
          type: "meeting",
          participants: [person],
          date: date,
        });
      });
    });
  }

  if (people.length > 0 && places.length > 0) {
    people.forEach((person) => {
      places.forEach((place) => {
        relationships.push({
          type: "location",
          participant: person,
          place: place,
        });
      });
    });
  }

  if (people.length > 0 && organizations.length > 0) {
    people.forEach((person) => {
      organizations.forEach((organization) => {
        relationships.push({
          type: "affiliation",
          person: person,
          organization: organization,
        });
      });
    });
  }

  let parsedData = {
    entities: {
      people,
      dates,
      places,
      organizations,
    },
    relationships: relationships,
  };

  return parsedData;
}

// Example usage
const inputText =
  "John Doe will meet with Jane Smith at the New York office on June 5th, 2024.";
const parsedData = parseInput(inputText);
console.log(JSON.stringify(parsedData, null, 2));
