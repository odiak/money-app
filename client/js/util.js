var _ = require('vue').util;

_.extend(exports, _);

exports.underscore = function (str) {
  return str
    .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2')
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .toLowerCase();
};

exports.underscoreKeys = function (obj) {
  var ret = {}, key;
  for (key in obj) {
    ret[exports.underscore(key)] = obj[key];
  }
  return ret;
};
