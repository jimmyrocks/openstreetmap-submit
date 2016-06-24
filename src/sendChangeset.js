var Promise = require('bluebird');
var closeChangeset = require('./changeset/close');
var createResult = require('./changeset/createResult');
var geojsonToOsm = require('geojsonToOsm');
var modifyMemberTasks = require('./modifyMemberTasks');
var openChangeset = require('./changeset/open');
var postChangeset = require('./changeset/post');
var tools = require('jm-tools');

var sendChangeset = function (data, type, osmConnection, options) {
  options.changeType = type;
  options.returnJson = true;
  options.changesetElements = options.changesetElements || 1;

  return new Promise(function (resolve, reject) {

    // Go through the changes and make a countable array out of it
    var changeArray = [];
    var largeChangeset = geojsonToOsm('changeset', '-1', data, options);
    ['node', 'way', 'relation'].forEach(function (elementType) {
      if (largeChangeset[elementType] && Array.isArray(largeChangeset[elementType])) {
        largeChangeset[elementType].forEach(function (change) {
          changeArray.push({
            'type': elementType,
            'data': change
          });
        });
      }
    });

    // Join that countable array up into "bite sized" changesets
    var jsonChangesets = [];
    for (var i = 0; i < changeArray.length; i += options.changesetElements) {
      var tempObj = {};
      for (var j = 0; j < options.changesetElements && (j < (changeArray.length - i)); j++) {
        var element = changeArray[i + j];
        tempObj[element.type] = tempObj[element.type] || [];
        tempObj[element.type].push(element.data);
      }
      jsonChangesets.push(JSON.parse(JSON.stringify(tempObj)));
    }

    // Create a task list of changesets to run
    var tasks = [];
    jsonChangesets.forEach(function (jsonChangeset, i) {
      if (i > 0) {
        tasks.push({
          'name': 'updatedChangesetValues',
          'description': 'If values within the changeset are assigned new ids, this will update them',
          'task': updateChangesetValues,
          'params': [jsonChangeset, '{{compiledChangesetResults' + (i - 1) + '}}']
        });
      }
      tasks.push({
        'name': 'changeset' + i,
        'description': 'commits changeset to database',
        'task': commitChangeset,
        'params': [jsonChangeset, osmConnection, options]
      });
      tasks.push({
        'name': 'compiledChangesetResults' + i,
        'description': 'combines the results from the most recent changeset with the previous ones that ran',
        'task': createMasterResult,
        'params': [jsonChangeset, '{{changeset' + i + '}}', (i > 0 ? ('{{compiledChangesetResults' + (i - 1) + '}}') : null)]
      });
    });

    tools.iterateTasks(tasks);
  });
};

var updateChangesetId = function (jsonChangeset, changesetId) {
  var newJsonChangeset = {};
  Object.keys(jsonChangeset).forEach(function (elementType) {
    var elements = JSON.parse(JSON.stringify(jsonChangeset[elementType]));
    newJsonChangeset[elementType] = elements.map(function (element) {
      element.changeset = changesetId;
      return element;
    });
  });
  return newJsonChangeset;
};

var updateChangesetValues = function (jsonChangeset, previousMasterResult) {
  console.log(previousMasterResult);
  process.exit(0);
};

var createMasterResult = function (jsonChangeset, thisResult, previousMasterResult) {};

var commitChangeset = function (changesetJson, osmConnection, options) {
  var taskList = [{
    'name': 'openChangeset',
    'description': 'open a changeset on the OSM server',
    'task': openChangeset,
    'params': [osmConnection]
  }, {
    'name': 'completeChangeset',
    'description': 'Updates the changeset id to match our changeset',
    'task': updateChangesetId,
    'params': [changesetJson, '{{openChangeset}}']
  }, {
    'name': 'xmlChangeset',
    'description': 'Converts the JSON changeset to XML',
    'task': geojsonToOsm.js2xml,
    'params': ['changeset', '{{completeChangeset}}', options]
  }, {
    'name': 'post data to openstreetmap',
    'description': 'Then we can run that on the places server',
    'task': postChangeset,
    'params': [osmConnection, '{{openChangeset}}', '{{xmlChangeset}}']
  }, {
    'name': 'closeChangeset',
    'description': 'Closing the changeset adds it to places',
    'task': closeChangeset,
    'params': [osmConnection, '{{openChangeset}}']
  }, {
    'name': 'create result',
    'description': 'Gathers the result data and reports the OSM id for a primary key',
    'task': createResult,
    'params': ['{{post data to openstreetmap}}', '{{xmlChangeset}}', options]
  }];
  return tools.iterateTasks(taskList);
};

var sendChangesetOld = function (data, type, osmConnection, options) {
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
