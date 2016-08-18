var combineChangesetResults = require('./combineChangesetResults');
var modifyMemberTasks = require('./modifyMemberTasks');
var sendChangeset = require('./sendChangeset');
var tools = require('jm-tools');

module.exports = function (data, type, osmConnection, options) {
  if (type === 'create') {
    return sendChangeset(data, type, osmConnection, options);
  } else {
    // The delete and modify tasks may also require deleting or modifying existing nodes / ways
    return modifyMemberTasks(data, type, osmConnection, options).then(function (tasks) {
      // console.log(JSON.stringify(tasks, null, 2));
      // throw new Error('stop');
      return tools.iterateTasksLight(tasks.map(function (task, i) {
        return {
          'name': 'changeset part ' + i,
          'task': sendChangeset,
          'params': task
        };
      })).then(function (results) {
        return combineChangesetResults(results);
      });
    });
  }
};
