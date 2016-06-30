var arrayify = require('jm-tools').arrayify;
// Compiles all the results into one object
module.exports = function (results) {
  var returnValue = [];
  arrayify(results).forEach(function (result) {
    arrayify(result[result.length - 1]).forEach(function (record) {
      returnValue.push(record);
    });
  });
  return returnValue;
};
