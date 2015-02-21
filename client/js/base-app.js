var Vue = require('vue');

var app = new Vue({
  el: 'body',
  data: {
    currentView: '',
    currentUser: null,
    currentContext: null
  }
});

module.exports = app;
