var chunkArray = require('./chunkArray');
var copy = require('./copy');
var generateTasks = require('./generateTasks');
var geojsonToOsm = require('geojsonToOsm');
var osmJsonToArray = require('./osmJsonToArray');
var tools = require('jm-tools');

module.exports = function (data, type, osmConnection, options) {
  var newOptions = copy(options) || {};
  newOptions.changeType = type;
  newOptions.changesetElements = newOptions.changesetElements || 1000;
  newOptions.returnJson = true;

  var tasks = [{
    'name': 'getOsmJson',
    'description': 'Gets the geojson in OSM format, but converted to JSON',
    'task': geojsonToOsm,
    'params': ['changeset', '-1', data, newOptions]
  }, {
    'name': 'convertedArray',
    'description': 'Convert the OSM JSON to an array for easy counting / splitting',
    'task': osmJsonToArray,
    'params': ['{{getOsmJson}}']
  }, {
    'name': 'chunkedArray',
    'description': 'Joins the countable array up into "bite sized" changesets',
    'task': chunkArray,
    'params': ['{{convertedArray}}', newOptions.changesetElements]
  }, {
    'name': 'taskList',
    'description': 'Create tasks for each part of that chunked array',
    'task': generateTasks,
    'params': ['{{chunkedArray}}', osmConnection, newOptions]
  }, {
    'name': 'completedTaskList',
    'description': 'Runs the task list',
    'task': function (tasks, name) {
      return tools.iterateTasksLight(tasks, name, false).then(function (results) {
        return results[tasks.length - 1];
      });
    },
    'params': ['{{taskList}}', 'splitChangesetTaskList']
  }];
  return tools.iterateTasksLight(tasks, 'sendChangeset', false);
};
