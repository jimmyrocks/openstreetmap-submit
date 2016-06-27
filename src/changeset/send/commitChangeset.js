var closeChangeset = require('../close');
var createResult = require('../createResult');
var geojsonToOsm = require('geojsonToOsm');
var openChangeset = require('../open');
var postChangeset = require('../post');
var tools = require('jm-tools');
var updateChangesetId = require('./updateChangesetId');

module.exports = function (changesetJson, osmConnection, options) {
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
    'name': 'createResult',
    'description': 'Gathers the result data and reports the OSM id for a primary key',
    'task': createResult,
    'params': ['{{post data to openstreetmap}}', '{{xmlChangeset}}', options]
  }];
  return tools.iterateTasks(taskList);
};
