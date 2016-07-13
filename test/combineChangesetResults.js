var combineChangesetResults = require('../src/changeset/send/combineChangesetResults');
var testData = require('./combineChangesetResults.json');

var testRes = [
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10]
];

var correctRes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

module.exports = [{
  'name': 'test',
  'task': combineChangesetResults,
  'params': [testRes],
  'operator': 'deepEqual',
  'expected': correctRes
},{
  'name': 'test2',
  'task': combineChangesetResults,
  'params': [testData],
  'operator': 'jstype',
  'expected': 'array'
}];
