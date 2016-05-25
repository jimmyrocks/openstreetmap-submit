var connect = require('./src/connect.js');
var submit = require('./src/submit.js');
var geojsonToOsm = require('geojsonToOsm');


module.exports = function(connectionInformation) {
  return connect(connectionInformation).then(function(connection){
    return new submit(connection);
  });
}
