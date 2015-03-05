var Vue = require('vue');

[
  'hammer'
].forEach(function (name) {
  Vue.directive(name, require('./' + name));
});
