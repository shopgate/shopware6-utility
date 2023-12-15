const fs = require('fs');
const template = require('../../src/locale/en-US.json');
const language = require('./sw6-language-file.json');
const output = './it-IT.json';


function createRegexFromObjectKeys(obj) {
  const keys = Object.keys(obj);
  const regexString = keys.map(key => key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  return new RegExp(regexString, 'g');
}

const replacements = {
  '%name%': '{name}',
  '%code%': '{promotionCode}',
  '%quantity%': '{quantity}',
};

const regex = createRegexFromObjectKeys(replacements);

const translateValue = (value) => {
  return value.replace(regex, match => replacements[match]);
};

function flattenJSON (json) {
  var result = {};

  function recurse (cur, prop) {
    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      for (var i = 0, l = cur.length; i < l; i++) {
        recurse(cur[i], prop + '[' + i + ']');
      }
      if (l == 0) {
        result[prop] = [];
      }
    } else {
      var isEmpty = true;
      for (var p in cur) {
        isEmpty = false;
        recurse(cur[p], p);
      }
      if (isEmpty && prop) {
        result[prop] = {};
      }
    }
  }

  recurse(json, '');
  return result;
}

function copyValues (json1, json2, result = {}) {

  for (var key in json1) {
    if (typeof json1[key] === 'object') {
      result[key] = copyValues(json1[key], json2);
    } else {
      if (json2.hasOwnProperty(key)) {
        result[key] = translateValue(json2[key]);
      } else {
        result[key] = translateValue(json1[key]);
      }
    }
  }
  return result;
}

function writeToFile (filename, data) {
  fs.writeFile(filename, data, (err) => {
    if (err) throw err;
    console.log('Data written to file');
  });
}

const flattened = flattenJSON(language);
const mergedJSON = copyValues(template, flattened);
writeToFile(output, JSON.stringify(mergedJSON));
