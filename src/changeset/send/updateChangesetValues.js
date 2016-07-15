module.exports = function (jsonChangeset, previousMasterResult) {
  var newJsonChangeset = {};

  var matchToRecord = function (elementType, element) {
    var matches = previousMasterResult.filter(function (result) {
      return result.osmType === elementType && result.oldId === element.id;
    });
    return matches[0];
  };

  Object.keys(jsonChangeset).forEach(function (elementType) {
    newJsonChangeset[elementType] = jsonChangeset[elementType].map(function (element) {
      // Update the element's id (this usually won't happen)
      var matchedRecord; // = matchToRecord(elementType, element);
      // element.id = matchedRecord ? matchedRecord.osmId : element.id;

      // Update the nodes
      if (element.nd) {
        element.nd = element.nd.map(function (nd) {
          var ndElement = {
            'id': nd.ref.toString()
          };
          matchedRecord = matchToRecord('node', ndElement);
          nd.ref = matchedRecord ? matchedRecord.osmId : nd.ref;
          return nd;
        });
      }

      // Update the members
      if (element.member) {
        element.member = element.member.map(function (member) {
          var memberElement = {
            'id': member.ref.toString()
          };
          matchedRecord = matchToRecord(member.type, memberElement);
          member.ref = matchedRecord ? matchedRecord.osmId : member.ref;
          return member;
        });
      }

      return element;
    });
  });

  return newJsonChangeset;
};
