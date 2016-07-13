module.exports = function (results) {
  // The results from multiple changesets are in a big array, let's combine these into one result for easy parsing
  var result = [];
  results.forEach(function (subRes) {
    subRes.forEach(function (subsubRes) {
      if (typeof subsubRes === 'object' && subsubRes !== null && Object.keys(subsubRes).length > 0) {
        result.push(subsubRes);
      }
    });
  });
  return result;
};
