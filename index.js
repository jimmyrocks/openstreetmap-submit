var connect = require('./src/connect.js');
var submit = require('./src/submit.js');


module.exports = function(connectionInformation, options) {
  return connect(connectionInformation).then(function(connection){
    return new submit(connection, options);
  });
}
