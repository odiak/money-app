var request = require('superagent');
var page = require('page');
var _ = require('../util');
var h = require('../html');

var template =
  h('.main',
    h('h2', 'Expenses'),
    h('.total', 'Total: {{total}}'),
    h('table.expenses',
      h('tr',
        h('th', 'date'),
        h('th', 'category'),
        h('th', 'subject'),
        h('th', 'amount')),
      h('tr', {vRepeat: 'expenses'},
        h('td.date', {vText: 'date'}),
        h('td.category', {vText: 'category && category.name'}),
        h('td.subject', {vText: 'subject'}),
        h('td.amount', {vText: 'amount'}))));


module.exports = {
  template: template,

  data: function () {
    return {
      expenses: []
    };
  },

  computed: {
    total: function () {
      return this.expenses.reduce(function (total, expense) {
        if (!expense.amount) return total;
        return total + expense.amount;
      }, 0);
    }
  },

  methods: {
    loadExpenses: function () {
      var that = this;
      request.get('/api/expenses', function (res) {
        if (!res.ok) return;
        that.expenses = res.body.expenses;
      });
    }
  },

  created: function () {
    this.loadExpenses();
  }
};
