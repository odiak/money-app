var Vue = require('vue');
var page = require('page');
var request = require('superagent');

// Vue.config.debug = true;

Vue.directive('pref', require('./directives/pref'));

Vue.component('main',     require('./components/main'));
Vue.component('login',    require('./components/login'));
Vue.component('register', require('./components/register'));

var app = require('./base-app');

function setView (name) {
  return function(ctx, next) {
    console.log(name);
    app.currentView = name;
    next();
  };
}

function loadUser (ctx, next) {
  if (!app.currentUser) {
    request.get('/api/user', function(res) {
      if (res.ok) {
        app.currentUser = res.body;
      } else {
        page.redirect('/login');
      }
    });
  }
  next();
}

page('/',         setView('main'), loadUser);
page('/login',    setView('login'));
page('/register', setView('register'));
page();
