// Opens a changeset, returns the changeset number
var Promise = require('bluebird');
var changesetJson = require('./template');
var xmlJs = require('xmljs_trans_js');

module.exports = function (user) {
  return new Promise(function (resolve, reject) {
    var changesetXml = xmlJs.xmlify(changesetJson);
    user.oauth.put(user.connection.address + '0.6/changeset/create',
      user.connection.access_key,
      user.connection.access_secret,
      changesetXml, function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
  });
};
