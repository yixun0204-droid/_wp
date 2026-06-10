const contents = ["Very long content here", "Another Very long content here", "3rd Very long content here"];
const processed = contents.map(str => str.substring(0, 10) + "...");
console.log(processed);