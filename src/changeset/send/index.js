var chunkArray = require('./chunkArray');
var copy = require('./copy');
var generateReport = require('./generateReport');
var generateTasks = require('./generateTasks');
var geojsonToOsm = require('geojsonToOsm');
var modifyMemberTasks = require('./modifyMemberTasks');
var osmJsonToArray = require('./osmJsonToArray');
var tools = require('jm-tools');

var sendChangeset = function (data, type, osmConnection, options) {
  var newOptions = copy(options);
  newOptions.changeType = type;
  newOptions.changesetElements = options.changesetElements || 1000;
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
    'task': tools.iterateTasks,
    'params': ['{{taskList}}', 'splitChangesetTaskList']
  }, {
    'name': 'generatedReport',
    'description': 'Generates a report of what changes were made',
    'task': generateReport,
    'params': ['{{completedTaskList}}']
  }];
  return tools.iterateTasks(tasks, 'sendChangeset');
};

module.exports = function (data, type, osmConnection, options) {
  if (type === 'create') {
    return sendChangeset(data, type, osmConnection, options);
  } else {
    // The delete and modify tasks may also require deleting or modifying existing nodes / ways
    return modifyMemberTasks(data, type, osmConnection, options).then(function (tasks) {
      return tools.iterateTasks(tasks.map(function (task, i) {
        return {
          'name': 'changeset part ' + i,
          'task': sendChangeset,
          'params': task
        };
      }));
    });
  }
};
