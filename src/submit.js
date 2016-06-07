var breakUpGeojson = require('./breakUpGeojson');
var compileResults = require('./changeset/compileResults');
var sendChangeset = require('./sendChangeset');
var tools = require('jm-tools');

module.exports = function (connection, options) {
  return function (create, modify, remove) {
    options = options || {};
    options.limit = options.limit || 15;

    var tasks = [];
    breakUpGeojson(create, options.limit).forEach(function (data) {
      tasks.push({
        'type': 'create',
        'data': data
      });
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


