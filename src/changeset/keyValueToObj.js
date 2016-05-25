// Creates an object from Key/Val pairs
var tools = require('jm-tools');

module.exports = function (keyValues) {
  keyValues = keyValues ? tools.arrayify(keyValues) : [];
  var returnObj = {};
  keyValues.forEach(function (keyValue) {
    returnObj[keyValue.k] = keyValue.v;
  });
  return returnObj;
};
