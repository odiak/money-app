var Vue = require('vue');

[
].forEach(function (name) {
  Vue.directive(name, require('./' + name));
});
