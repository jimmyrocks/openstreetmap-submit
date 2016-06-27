module.exports = function (jsonChangeset, changesetId) {
  var newJsonChangeset = {};
  Object.keys(jsonChangeset).forEach(function (elementType) {
    var elements = JSON.parse(JSON.stringify(jsonChangeset[elementType]));
    newJsonChangeset[elementType] = elements.map(function (element) {
      element.changeset = changesetId;
      return element;
    });
  });
  return newJsonChangeset;
};
