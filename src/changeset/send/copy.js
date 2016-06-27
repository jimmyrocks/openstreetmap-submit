module.exports = function (obj) {
  // Quick and dirty clone using JSON.parse / JSON.stringify
  var returnValue = null;
  try {
    returnValue = JSON.parse(JSON.stringify(obj));
  } catch (e) {
    // Catch might try a different method in the future?
    // TODO see above
    returnValue = null;
  }
  return returnValue;
};
