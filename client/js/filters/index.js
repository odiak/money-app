var Vue = require('vue');

['strftime', 'number']
.forEach(function (name) {
  Vue.filter(name, require('./' + name));
});
