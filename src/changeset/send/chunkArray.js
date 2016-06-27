module.exports = function (changesetArray, chunkSize) {
  var chunkedArray = [];
  var tempObj;
  var element;
  for (var i = 0; i < changesetArray.length; i += chunkSize) {
    tempObj = {};
    for (var j = 0; j < chunkSize && (j < (changesetArray.length - i)); j++) {
      element = changesetArray[i + j];
      tempObj[element.type] = tempObj[element.type] || [];
      tempObj[element.type].push(element.data);
    }
    chunkedArray.push(JSON.parse(JSON.stringify(tempObj)));
  }
  return chunkedArray;
};
