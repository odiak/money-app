var Vue = require('vue');
var request = require('superagent');
var page = require('page');

var app = new Vue({
  el: 'body',
  data: {
    currentView: '',
    currentUser: null,
    currentContext: null
  },

  methods: {
    loadUser: function () {
      var that = this;

      request.get('/api/user', function(res) {
        if (res.ok) {
          that.currentUser = res.body;
        } else {
          page.show('/login');
        }
      });
    }
  }
});

module.exports = app;
