var request = require('superagent');
var page = require('page');

var _ = require('../util');
var h = require('../html');
var strftime = require('../strftime');

var app = require('../base-app');

var template =
  h('.main',
    h('h2', 'Expenses'),
    h('.month-nav',
      h('.prev-month',
        h('a', {href: '/expenses/{{formatForParam(previousMonth)}}'},
          '&laquo; {{strftime(previousMonth, "%b %Y")}}')),
      h('.current-month',
        '{{strftime(currentMonth, "%b %Y")}}'),
      h('.next-month',
        h('a', {href: '/expenses/{{formatForParam(nextMonth)}}'},
          '{{strftime(nextMonth, "%b %Y")}} &raquo;'))),
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
          h('a', {href: '#', vOn: 'click: deleteExpense($data, $event)'},
            'delete')))));


module.exports = {
  template: template,

  data: function () {
    return {
      expenses: [],

      currentMonth: null,
      previousMonth: null,
      nextMonth: null
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
      var url = '/api/expenses/' + this.formatForParam(this.currentMonth);
      request.get(url, function (res) {
        if (!res.ok) return;
        that.expenses = res.body.expenses;
      });
    },

    deleteExpense: function (expense, e) {
      e.preventDefault();

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
    },

    setDateFromParams: function () {
      var params = app.currentContext.params, now, year, month;
      if (params.year && params.month) {
        year = parseInt(params.year, 10);
        month = parseInt(params.month, 10) - 1;
      } else {
        now = new Date;
        year = now.getFullYear();
        month = now.getMonth();
      }

      this.currentMonth = new Date(year, month, 1);
      this.previousMonth = month === 0
        ? new Date(year - 1, 11, 1)
        : new Date(year, month - 1, 1);
      this.nextMonth = month === 11
        ? new Date(year + 1, 0, 1)
        : new Date(year, month + 1, 1);
    },

    strftime: strftime,

    formatForParam: function (date) {
      return strftime(date, '%Y-%m');
    }
  },

  created: function () {
    this.setDateFromParams();
    this.loadExpenses();
  }
};
