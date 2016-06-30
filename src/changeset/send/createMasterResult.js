var arrayify = require('jm-tools').arrayify;

module.exports = function (thisResult, previousMasterResult, msg) {
  var newResult = [];
  var inputs = [previousMasterResult, thisResult];
  inputs.forEach(function (group) {
    group = group ? arrayify(group) : [];
    group.forEach(function (result) {
      newResult.push(result);
    });
  });
  console.log(msg);
  return newResult;
};
