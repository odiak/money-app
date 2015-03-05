var strftime = require('../strftime');

module.exports = function (value, format) {
  if (!(value instanceof Date)) value = new Date(value);

  var format = this[format];
  if (!format) return '';

  return strftime(value, format);
};
