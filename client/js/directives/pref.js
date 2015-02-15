var _ = require('vue').util;
var page = require('page');

function isEventWithKey (e) {
  var btn = e.which || e.button || 0;
  return btn > 1 || e.ctrlKey || e.altKey || e.shiftKey || e.metaKey;
}

module.exports = {
  isLiteral: true,

  bind: function () {
    var pref = this.expression;
    var el = this.el;
    el.href = pref;

    this.handler = function (e) {
      if (isEventWithKey(e) || el.target) return;
      e.preventDefault();
      page.redirect(pref);
    };
    _.on(this.el, 'click', this.handler);
  },

  unbind: function () {
    _.off(this.el, 'click', this.handler);
  }
};
