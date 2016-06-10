var closeChangeset = require('./changeset/close');
var createResult = require('./changeset/createResult');
var geojsonToOsm = require('geojsonToOsm');
var modifyMemberTasks = require('./modifyMemberTasks');
var openChangeset = require('./changeset/open');
var postChangeset = require('./changeset/post');
var tools = require('jm-tools');

var sendChangeset = function (data, type, osmConnection, options) {
  options.changeType = type;
  var taskList = [{
    'name': 'open changeset',
    'description': 'open a changeset on the OSM server',
    'task': openChangeset,
    'params': [osmConnection]
  }, {
    'name': 'convert to xml',
    'description': 'Then we can convert that geojson to XML for the places server',
    'task': geojsonToOsm,
    'params': ['changeset', '{{open changeset}}', data, options]
  }, {
    'name': 'post data to openstreetmap',
    'description': 'Then we can run that on the places server',
    'task': postChangeset,
    'params': [osmConnection, '{{open changeset}}', '{{convert to xml}}']
  }, {
    'name': 'close changeset',
    'description': 'Closing the changeset adds it to places',
    'task': closeChangeset,
    'params': [osmConnection, '{{open changeset}}']
  }, {
    'name': 'create result',
    'description': 'Gathers the result data and reports the OSM id for a primary key',
    'task': createResult,
    'params': ['{{post data to openstreetmap}}', '{{convert to xml}}', options]
  }];
  return tools.iterateTasks(taskList);
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
    }).then(function (results) {
      // TODO This probably will need some cleanup
      return results;
    });
  }
};
