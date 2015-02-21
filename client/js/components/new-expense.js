var request = require('superagent');
var page = require('page');
var _ = require('../util');
var h = require('../html');

var template =
  h('.new-expense',
    h('h2', 'New expense'),
    h('div', {vComponent: 'expense-form'}));

module.exports = {
  template: template
};
