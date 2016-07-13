var arrayify = require('jm-tools').arrayify;
// Compiles all the results into one object
module.exports = function (results) {
  var returnValue = [];
  arrayify(results).forEach(function (result) {
    arrayify(result).forEach(function (item) {
      if (typeof item === 'object' && item[0] && item[0].oldId !== undefined) {
        item.forEach(function (subItem) {
          returnValue.push(subItem);
        });
      }
    });
  });
  return returnValue;
};
