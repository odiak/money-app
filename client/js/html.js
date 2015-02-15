var slice = Array.prototype.slice;
var push = Array.prototype.push;

var inlineTags = [
  'input',
  'br',
];

var entities = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;'
};
var rEntity = /[&<>"]/g;

function escapeEntities (str) {
  return str.replace(rEntity, function (c) {
    return entities[c] || c;
  });
}

function normalizeAttribute (str) {
  return str
    .replace(/[^A-Z][A-Z]/g, function (s) {
      return s[0] + '-' + s[1].toLowerCase();
    });
}

function attributesToString (attrs) {
  var h = '', key, val;
  if (!attrs) return '';
  for (key in attrs) {
    val = attrs[key];
    h += ' ';
    key = normalizeAttribute(key);
    if (val === true) {
      h += key;
    } else {
      h += key + '="' + escapeEntities(val.toString()) + '"';
    }
  }
  return h;
}

function isInlineTag (tag) {
  return inlineTags.indexOf(tag) !== -1;
}

function openTag (tag, attrs) {
  return '<' + tag + attributesToString(attrs) + '>';
}

function closeTag (tag) {
  return '</' + tag + '>';
}

function contentsToString (contents) {
  return contents.filter(function (c) {
    return c != null;
  }).join('');
}

var rId = /#[-\w]+/g;
var rClass = /\.[-\w]+/g;

function parseTag (tag, attrs) {
  return tag
    .replace(rId, function (s) {
      attrs.id || (attrs.id = s.slice(1));
      return '';
    })
    .replace(rClass, function (s) {
      attrs.class = ((attrs.class || '') + ' ' + s.slice(1)).trim();
      return '';
    }) || 'div';
}

// html(tag, attrs, [content...])
// html(tag, [content...])
//
// example:
//
// html('form.form-horizontal', {action: 'login'},
//   html('.form-group',
//     html('label', 'Username'),
//     html('input', {type: 'text', name: 'username'})
//   ),
//   html('.form-group',
//     html('label', 'Password'),
//     html('input', {type: 'password', name: 'password'})
//   ),
//   html('button', {type: 'submit'}, 'Login')
// )
//
// output:
//
// <div class="form-horizontal">
//   <div class="form-group">
//     <label>Username</label>
//     <input type="text" name="username">
//   </div>
//   <div class="form-group">
//     <label>Password</label>
//     <input type="text" name="password">
//   </div>
// </div>
//
function html(tag, attrs, content) {
  var h = '', key, val, contents = [];
  if (typeof attrs === 'string') {
    contents.push(attrs, content);
    content = attrs;
    attrs = {};
  } else {
    attrs || (attrs = {});
    contents.push(content);
  }
  if (arguments.length > 3) push.apply(contents, slice.call(arguments, 3));
  tag = parseTag(tag, attrs);
  h += openTag(tag, attrs);
  if (!isInlineTag(tag)) {
    h += contentsToString(contents);
    h += closeTag(tag);
  }
  return h;
}

module.exports = html;
