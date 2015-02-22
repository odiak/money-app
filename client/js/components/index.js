var Vue = require('vue');

var names = [
  'main',
  'new-expense',
  'edit-expense',
  'expense-form',
  'login',
  'register',
  'not-found',
];

names.forEach(function (name) {
  Vue.component(name, require('./' + name));
});
