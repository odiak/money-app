var Vue = require('vue');

var app = new Vue({
  el: 'body',
  data: {
    currentView: '',
    currentUser: null
  }
});

module.exports = app;
