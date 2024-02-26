/**
 * This script turns output from the figma plugin "style to JSON" into a usuable theme.
 * It expects a format of "themes/{NAME}/anythinghere"
 */

import fs from "fs";

const fileLocation = "./figmaTokens.json";
const theme = "blue";

const fileContents = fs.readFileSync(fileLocation, {
  encoding: "utf-8"
});
const tokens = JSON.parse(fileContents);

const themeTokens = tokens.themes[theme];
const output = {};

function setKey(obj, key, defaultVal) {
  const realKey = key.match(/^\d+$/g) ? "c" + key : key;
  if (obj[key]) return obj[key];
  obj[realKey] = defaultVal;
  return obj[realKey];
}

function handleToken(token, path) {
  if (typeof token.name === "string" && typeof token.description === "string") {
    let ref = output;
    const lastKey = path.pop();
    path.forEach((v) => {
      ref = setKey(ref, v, {});
    });
    setKey(ref, lastKey, token.hex);
    return;
  }

  for (let key in token) {
    handleToken(token[key], [...path, key]);
  }
}

handleToken(themeTokens, []);
console.log(JSON.stringify(output, null, 2));
