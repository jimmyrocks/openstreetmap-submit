var Promise = require('bluebird');
var tools = require('jm-tools');
var xmlJs = require('xmljs_trans_js');
var keyValueToObj = require('../keyValueToObj');

/* GeoJSON supports the following geometry types: Point, LineString, Polygon, MultiPoint, MultiLineString, MultiPolygon, and GeometryCollection. */
var geojsonTypeToOsmType = {
  'Point': 'node',
  'LineString': 'way',
  'Polygon': 'way',
  'MultiPoint': 'relation',
  'MultiLineString': 'relation',
  'MultiPolygon': 'relation'
};

var wrapFeatures = function (features) {
  var featureArray = [];
  features.forEach(function (featureGroup) {
    featureGroup.forEach(function (feature) {
      featureArray.push(feature);
    });
  });
  return {
    'type': 'FeatureCollection',
    'features': featureArray
  };
};

var getUrlXmlAsJson = function (osmConnection, osmType, osmId) {
  return new Promise(function (resolve, reject) {
    osmConnection.oauth.get(osmConnection.connection.address + '0.6/' + osmType + '/' + osmId + (osmType === 'node' ? '' : '/full'),
      osmConnection.connection.access_key,
      osmConnection.connection.access_secret,
      function (err, res) {
        if (err) {
          reject(new Error(JSON.stringify(err)));
        } else {
          try {
            resolve(xmlJs.jsonify(res));
          } catch (e) {
            reject(e);
          }
        }
      });
  });
};

var generateModifyTasks = function (osmConnection, osmType, osmId, feature, changeType, options) {
  // All changes can contain a node, but only relations can contain a way
  var changeTypes = {
    'way': ['node'],
    'relation': ['node', 'way']
  }[osmType] || [];
  var changes = [];

  // Go out to the server and get the info for the element, then convert it from XML to JSON
  return getUrlXmlAsJson(osmConnection, osmType, osmId).then(function (result) {
    // TODO: Look into what a modify / delete instruction looks like
    // TODO: This is where the matching to closest point code will go
    var members = (result && result.osm) || {};

    // Go through the change types that we may need to update, and replace the with the members from before
    changeTypes.forEach(function (geometryType) {
      tools.arrayify(members[geometryType]).forEach(function (element) {
        changes.push({
          'type': 'Feature',
          'geometry': {
            'type': geometryType === 'way' ? 'LineString' : 'Point',
            'coordinates': [] // TODO: this is a great spot to modify the coords!
          },
          'osmId': element.id,
          'changeType': 'delete', // TODO: This could also be modify if we fixed this up more
          'properties': keyValueToObj(element.tag)
        });
      });
    });

    var taskTypes = {
      'create': [],
      'modify': [],
      'delete': []
    };
    changes.forEach(function (change) {
      taskTypes[change.changeType].push(change);
    });

    var newTasks = [];
    // Split the create, modify, and removes into their own tasks
    Object.keys(taskTypes).forEach(function (type) {
      if (taskTypes[type].length > 0) {
        newTasks.push([taskTypes[type], type]);
      }
    });

    // Add the original task (TODO: the feature may change if we start modifying it a little!)
    newTasks.push([
      [feature], changeType
    ]);

    return newTasks;
  });
};

module.exports = function (data, type, osmConnection, options) {
  // go through the new data and get a list of ways and relations that need to be pulled from the server
  var features = data.features || [];
  var osmIdField = options.osmIdField;
  var osmRequests = [];

  // Go through the features and convert them into requests
  features.forEach(function (feature) {
    // Make sure its a geojson feature and it has the osmIdField
    if (feature.type === 'Feature' && feature[osmIdField] !== undefined) {
      var osmType = geojsonTypeToOsmType[feature.geometry && feature.geometry.type];
      osmRequests.push({
        'osmId': feature[osmIdField],
        'feature': feature,
        'osmType': osmType
      });
    }
  });

  // Iterate through all of those requests
  return tools.iterateTasks(osmRequests.map(function (request) {
    return {
      'name': 'Getting Element: ' + request.osmType + ': ' + request.osmId,
      'task': generateModifyTasks,
      'params': [osmConnection, request.osmType, request.osmId, request.feature, type, options]
    };
  })).then(function (modifiedTasks) {
    // This just takes all the tasks out of the nested arrayed
    var combinedTasks = {
      'create': [],
      'modify': [],
      'delete': []
    };
    tools.arrayify(modifiedTasks).forEach(function (taskGroup) {
      tools.arrayify(taskGroup).forEach(function (task) {
        if (task[0] && task[1]) {
          combinedTasks[task[1]].push(task[0]);
        }
      });
    });
    return Object.keys(combinedTasks).map(function (key) {
      return [wrapFeatures(combinedTasks[key]), key, osmConnection, options];
    });
  });
};
