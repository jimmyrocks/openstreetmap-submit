var Promise = require('bluebird');
var superagent = require('superagent');
var OAuth = require('oauth').OAuth;

// Oauthify superagent
require('superagent-oauth')(superagent);

var initialize = function (source) {
  return new Promise(function (resolve, reject) {
    var oauth = new OAuth(
      'http://' + source.connection.address + 'oauth/request_token',
      'http://' + source.connection.address + 'oauth/access_token',
      source.connection.consumer_key,
      source.connection.consumer_secret,
      '1.0',
      null,
      'HMAC-SHA1');
    // Get User Details /0.6/user/details
    superagent.get(source.connection.address + '0.6/user/details.json')
      .sign(oauth, source.connection.access_key, source.connection.access_secret)
      .end(function (err, res) {
        if (!err && res.status === 200) {
          resolve({
            oauth: oauth,
            user: res.body,
            connection: source.connection
          });
        } else {
          reject(new Error(err));
        }
      });
  });
};

module.exports = initialize;
