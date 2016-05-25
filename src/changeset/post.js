module.exports = function (user, changesetNumber, changesetXml) {
  return new Promise(function (resolve, reject) {
    user.oauth.post(
      user.connection.address + '0.6/changeset/' + changesetNumber + '/upload',
      user.connection.access_key,
      user.connection.access_secret,
      changesetXml,
      function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
  });
};
