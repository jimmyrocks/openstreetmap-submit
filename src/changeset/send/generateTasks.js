var updateChangesetValues = require('./updateChangesetValues');
var commitChangeset = require('./commitChangeset');
var createMasterResult = require('./createMasterResult');

module.exports = function (chunkedArray, osmConnection, options) {
  var tasks = [];
  chunkedArray.forEach(function (changesetChunk, i) {
    if (i > 0) {
      tasks.push({
        'name': 'updatedChangesetValues',
        'description': 'If values within the changeset are assigned new ids, this will update them',
        'task': updateChangesetValues,
        'params': [changesetChunk, '{{compiledChangesetResults' + (i - 1) + '}}']
      });
    }
    tasks.push({
      'name': 'changeset' + i,
      'description': 'commits changeset to database',
      'task': commitChangeset,
      'params': [changesetChunk, osmConnection, options]
    });
    tasks.push({
      'name': 'compiledChangesetResults' + i,
      'description': 'combines the results from the most recent changeset with the previous ones that ran',
      'task': createMasterResult,
      'params': ['{{changeset' + i + '.createResult}}', (i > 0 ? ('{{compiledChangesetResults' + (i - 1) + '}}') : null), 'Completed Changeset: ' + (i + 1) + ' / ' + (chunkedArray.length)]
    });
  });
  return tasks;
};
