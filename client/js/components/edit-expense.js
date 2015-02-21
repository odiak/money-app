var request = require('superagent');

var h = require('../html');
var _ = require('../util');
var app = require('../base-app');

var template =
  h('.edit-expense',
    h('h2', 'Edit expense'),
    h('div', {vComponent: 'expense-form', vWith: 'expense: expense',
        vIf: 'expense'}));

module.exports = {
  template: template,

  data: function () {
    return {
      expense: null
    };
  },

  created: function () {
    this.loadExpense();
  },

  methods: {
    loadExpense: function () {
      if (!app.currentContext) return;
      var that = this;
      var expenseId = app.currentContext.params.expenseId;
      request.get('/api/expenses/' + expenseId, function (res) {
        if (!res.ok) return;
        var expense = res.body;
        expense.categoryId = expense.category && expense.category.id;
        that.expense = expense;
      });
    }
  }
};
