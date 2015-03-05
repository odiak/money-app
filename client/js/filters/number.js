var rNum = /^(-?)(\d+)(\.\d+(?:e[-+]\d+)?)?$/

module.exports = function (number, size) {
  if (typeof number !== 'number') number = parseFloat(number);

  if (!isFinite(number)) return '';

  if (!size || size < 0) size = 0;
  else size |= 0;

  var m = rNum.exec(number.toFixed(size));
  var sign = m[1], fixed = m[2], fraction = m[3];

  var res = '';

  if (sign) res += sign;

  var i = 0, len = fixed.length, arr = [];
  if ((i = len % 3) !== 0) {
    arr.push(fixed.slice(0, i));
  }
  for (; i < len; i += 3) {
    arr.push(fixed.slice(i, i + 3));
  }
  res += arr.join(',');

  if (fraction) res += fraction;

  return res;
};
