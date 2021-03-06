var Vue = require('vue');
var page = require('page');
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
      app.loadUser();
    }
  };
}

page('/',                         setView('main'));
page('/expenses/:year-:month',    setView('main'));
page('/expenses/new',             setView('new-expense'));
page('/expenses/:expenseId/edit', setView('edit-expense'));
page('/login',                    setView('login', false));
page('/register',                 setView('register', false));
page('*',                         setView('not-found'));
page();
