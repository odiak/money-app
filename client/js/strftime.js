var locales = {
  en: {
    dayNames: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ],
    abbrDayNames: [
      'Sun',
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat'
    ],
    monthNames: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    abbrMonthNames: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ]
  }
};

function pad (s, n, c) {
  s = '' + s;
  c || (c = '0');
  while (s.length < n) s = c + s;
  return s;
}

var formats = {
  a: function (d, locale) { return locale.abbrDayNames[d.getDay()]; },
  A: function (d, locale) { return locale.dayNames[d.getDay()]; },
  w: function (d) { return d.getDay(); },
  d: function (d) { return pad(d.getDate(), 2); },
  b: function (d, locale) { return locale.abbrMonthNames[d.getMonth()]; },
  B: function (d, locale) { return locale.monthNames[d.getMonth()]; },
  m: function (d) { return pad(d.getMonth() + 1, 2); },
  y: function (d) { return pad(d.getFullYear() % 100, 2); },
  Y: function (d) { return pad(d.getFullYear(), 2); },
  H: function (d) { return pad(d.getHours(), 2); },
  I: function (d) { return pad(d.getHours() % 12); },
  p: function (d) { return d.getHours() < 12 ? 'AM' : 'PM'; },
  M: function (d) { return pad(d.getMinutes(), 2); },
  S: function (d) { return pad(d.getSeconds(), 2); },
  '%': function () { return '%'; }
};

function strftime (date, format, localeName) {
  var locale = locales[localeName || strftime.defaultLocale];

  return format.replace(/%./g, function (str) {
    var f = formats[str[1]];
    return f ? f(date, locale) : str;
  });
}
strftime.locales = locales;
strftime.defaultLocale = 'en';

module.exports = strftime;
