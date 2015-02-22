var Vue = require('vue');
var page = require('page');
var request = require('superagent');

// Vue.config.debug = true;

Vue.component('main',         require('./components/main'));
Vue.component('new-expense',  require('./components/new-expense'));
Vue.component('edit-expense', require('./components/edit-expense'));
Vue.component('expense-form', require('./components/expense-form'));
Vue.component('login',        require('./components/login'));
Vue.component('register',     require('./components/register'));
Vue.component('not-found',    require('./components/not-found'));

var app = require('./base-app');

function setView (name, loginRequired) {
  if (loginRequired == null) loginRequired = true;

  return function(ctx) {
    app.currentContext = ctx;

    if (app.currentView !== name) {
      app.currentView = name;
    } else {
      app.currentView = '';
      Vue.nextTick(function () {
        app.currentView = name;
      });
    }

    if (loginRequired && !app.currentUser) {
      loadUser();
    }
  };
}

function loadUser () {
  request.get('/api/user', function(res) {
    if (res.ok) {
      app.currentUser = res.body;
    } else {
      page.redirect('/login');
    }
  });
}

page('/',                         setView('main'));
page('/expenses/:year-:month',    setView('main'));
page('/expenses/new',             setView('new-expense'));
page('/expenses/:expenseId/edit', setView('edit-expense'));
page('/login',                    setView('login', false));
page('/register',                 setView('register', false));
page('*',                         setView('not-found'));
page();
