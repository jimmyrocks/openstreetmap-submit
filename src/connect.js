var Promise = require('bluebird');
var superagent = require('superagent');
var OAuth = require('oauth').OAuth;

// Oauthify superagent
require('superagent-oauth')(superagent);

var initialize = function (connection) {
  return new Promise(function (resolve, reject) {
    var oauth = new OAuth(
      'http://' + connection.address + 'oauth/request_token',
      'http://' + connection.address + 'oauth/access_token',
      connection.consumer_key,
      connection.consumer_secret,
      '1.0',
      null,
      'HMAC-SHA1');
    // Get User Details /0.6/user/details
    superagent.get(connection.address + '0.6/user/details.json')
      .sign(oauth, connection.access_key, connection.access_secret)
      .end(function (err, res) {
        if (!err && res.status === 200) {
          resolve({
            oauth: oauth,
            user: res.body,
            connection: connection
          });
        } else {
          reject(new Error(err));
        }
      });
  });
};

module.exports = initialize;
