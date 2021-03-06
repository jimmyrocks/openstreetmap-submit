var sendChangeset = require('./changeset/send');
var compileResults = require('./changeset/compileResults');
var tools = require('jm-tools');

var tryParse = function (input) {
  var returnValue = {};
  try {
    returnValue = (typeof input === 'string' ? JSON.parse(input) : input);
  } catch (e) {
    returnValue = input;
  }
  return returnValue;
};

module.exports = function (connection, options) {
  options = options || {};

  return function (create, modify, remove) {
    // Put the arguments into an obect
    var inputs = {
      'create': tryParse(create),
      'modify': tryParse(modify),
      'remove': tryParse(remove)
    };

    var tasks = [];

    Object.keys(inputs).forEach(function (key) {
      var data = inputs[key];
      if (data) {
        if (data.features && data.features.length) {
          tasks.push({
            'type': key,
            'data': data
          });
        }
      }
    });

    return tools.iterateTasksLight(tasks.map(function (task, i) {
      return {
        'name': 'Changeset ' + i,
        'description': 'Creating a changeset for this subset of geojson',
        'task': sendChangeset,
        'params': [task.data, task.type, connection, options]
      };
    })).then(function (results) {
      return compileResults(results);
    });
  };
};
