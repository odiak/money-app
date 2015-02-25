var excapeKeyRegexp = /[\-\.\+\*]/g;

function escapeKey (key) {
  return escape(key).replace(excapeKeyRegexp, '\\$&');
}

var preKey = '(?:^|.*;\\s*)';
var postKey = '\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*';

function get (key) {
  if (!key) return null;

  var regexp = new RegExp(preKey + escapeKey(key) + postKey);
  var result = regexp.exec(document.cookie);
  if (!result) return null;
  return unescape(result[1]);
}

module.exports = {
  get: get
};
