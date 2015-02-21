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
        h('td.amount', {vText: 'amount'}),
        h('td',
          h('a', {href: '/expenses/{{id}}/edit'}, 'edit'),
          ' &middot; ',
          h('a', {href: '#', vOn: 'click: deleteExpense($data)'}, 'delete')))));


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
    },

    deleteExpense: function (expense) {
      if (!confirm('Are you sure to delete this expense?')) return;
      var i = this.expenses.indexOf(expense);
      var that = this;
      if (i === -1) return;

      this.expenses.splice(i, 1);
      request.del('/api/expenses/' + expense.id, function (res) {
        if (!res) {
          that.expenses.splice(i, 0, expense);
          alert('Failed to delete');
        }
      });
    }
  },

  created: function () {
    this.loadExpenses();
  }
};
