module.exports = function (osmJson) {
  var elementTypes = ['node', 'way', 'relation'];
  var changeArray = [];
  elementTypes.forEach(function (elementType) {
    if (osmJson[elementType] && Array.isArray(osmJson[elementType])) {
      osmJson[elementType].forEach(function (change) {
        changeArray.push({
          'type': elementType,
          'data': change
        });
      });
    }
  });
  return changeArray;
};
