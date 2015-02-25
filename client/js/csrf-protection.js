var request = require('superagent');
var Request = request.Request;

var cookie = require('./cookie');

var origEnd = Request.prototype.end;

Request.prototype.end = function (fn) {
  this.set('X-CSRF-TOKEN', cookie.get('CSRF-TOKEN'));
  return origEnd.call(this, fn);
};
