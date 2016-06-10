// Creates a result of the changeset so we can determine what is stored in OpenStreetMap
var xmlJs = require('xmljs_trans_js');
var keyValueToObj = require('./keyValueToObj');
var tools = require('jm-tools');

module.exports = function (postResultXml, changesetXml, options) {
  var postResultJS = xmlJs.jsonify(postResultXml);
  var changesetJS = xmlJs.jsonify(changesetXml);
  console.log(postResultJS);

  var result = [];
  var types = ['node', 'way', 'relation'];
  var actions = ['create', 'modify', 'delete'];
  var refList = {};
  types.forEach(function (type) {
    var typeResults = postResultJS && postResultJS.diffResult && postResultJS.diffResult[type];
    typeResults = Array.isArray(typeResults) ? typeResults : [];
    refList[type] = typeResults;
    typeResults.forEach(function (element) {
      actions.forEach(function (action) {
        var osmChangeAction = changesetJS && changesetJS.osmChange && changesetJS.osmChange[action] && changesetJS.osmChange[action][type];
        osmChangeAction = Array.isArray(osmChangeAction) ? osmChangeAction : [];
        osmChangeAction.filter(function (change) {
          return change.id === element.old_id;
        }).forEach(function (matchedChange) {
          var tags = keyValueToObj(matchedChange.tag);
          var wayNodes = matchedChange.nd ? matchedChange.nd.map(function (nd) {
            for (var index = 0; index < refList.node.length; index++) {
              if (refList.node[index].old_id === nd.ref) {
                return refList.node[index].new_id;
              }
            }
            return nd.ref;
          }) : undefined;
          result.push({
            'osmId': element.new_id,
            'osmVersion': element.new_version,
            'osmType': type,
            'nodeLon': matchedChange.lon,
            'nodeLat': matchedChange.lat,
            'wayNodes': JSON.stringify(wayNodes),
            'action': action,
            'sourceId': matchedChange[options.foreignKeyField],
            'tagsHash': tools.md5(JSON.stringify(tags))
          });
        });
      });
    });
  });
  return result;
};
