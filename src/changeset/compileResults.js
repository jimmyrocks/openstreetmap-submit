// This doesn't appear to do much
//
module.exports = function (results) {
  var returnValue = [];
  results.forEach(function (result) {
    returnValue.push(result);
  });
  return returnValue;
};
