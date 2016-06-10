// Breaks a large geojson file into smaller changesets
module.exports = function (geojson, limit) {
  geojson = typeof geojson === 'string' ? JSON.parse(geojson) : geojson;
  var container = copy(geojson) || {};
  container.features = [];
  var featureGroups = [];

  var runningTotal = 0;
  var subGroup = [];
  geojson.features.forEach(function (feature) {
    var count = countFeature(feature);
    if (count + runningTotal >= limit) {
      featureGroups.push(copy(subGroup));
      subGroup = [];
      runningTotal = 0;
    }
    subGroup.push(feature);
    runningTotal += count;
  });
  featureGroups.push(copy(subGroup));

  return featureGroups.map(function (features) {
    var groupContainer = copy(container);
    groupContainer.features = features;
    return groupContainer;
  });
};

var copy = function (obj) {
  return JSON.parse(JSON.stringify(obj));
};

var countFeature = function (feature) {
  return (countValues(feature.coordinates) / 2);
};

var countValues = function (a) {
  var total = 0;
  if (Array.isArray(a)) {
    a.forEach(function (subA) {
      total += countValues(subA);
    });
    return total;
  } else {
    total += 1;
    return total;
  }
};
