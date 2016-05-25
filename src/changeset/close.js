var Promise = require('bluebird');

module.exports = function (user, changeset) {
  return new Promise(function (resolve, reject) {
    // Superagent oauth doens't seem to work well with puts
    user.oauth.put(
      user.connection.address + '0.6/changeset/' + changeset + '/close',
      user.connection.access_key,
      user.connection.access_secret,
      '',
      function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
  });
};
