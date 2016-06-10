var breakUpGeojson = require('./breakUpGeojson');
var sendChangeset = require('./sendChangeset');
var compileResults = require('./changeset/compileResults');
var tools = require('jm-tools');

module.exports = function (connection, options) {
  options = options || {};
  options.limit = options.limit || 15;

  return function (create, modify, remove) {
    // Put the arguments into an obect
    var inputs = {
      'create': create,
      'modify': modify,
      'remove': remove
    };

    var tasks = [];

    Object.keys(inputs).forEach(function (key) {
      if (inputs[key]) {
        breakUpGeojson(inputs[key], options.limit).forEach(function (data) {
          if (data.features && data.features.length) {
            tasks.push({
              'type': key,
              'data': data
            });
          }
        });
      }
    });

    return tools.iterateTasks(tasks.map(function (task, i) {
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
