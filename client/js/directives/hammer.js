var Hammer = require('hammerjs');

Hammer.defaults.cssProps.touchSelect = 'inherit';
Hammer.defaults.cssProps.userDrag = 'inherit';
Hammer.defaults.cssProps.userSelect = 'inherit';

module.exports = {
  acceptStatement: true,

  bind: function () {
    this.hm = new Hammer(this.el);
  },

  update: function (handler) {
    this.reset();
    var vm = this.vm;
    this.handler = function (e) {
      vm.$event = e;
      var res = handler(e);
      vm.$event = null;
      return res;
    };
    this.hm.on(this.arg, this.handler);
  },

  reset: function () {
    if (this.handler) {
      this.hm.off(this.arg, this.handler);
    }
  },

  unbind: function () {
    this.hm.off(this.arg, this.handler);
  }
};
