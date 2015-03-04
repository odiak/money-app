var request = require('superagent');
var page = require('page');

var _ = require('../util');
var h = require('../html');
var strftime = require('../strftime');

var app = require('../base-app');

var template = h.fromArray(
  ['.main',
    ['h2', 'Expenses'],
    ['.month-nav',
      ['.prev-month',
        ['a', {href: '/expenses/{{formatForParam(previousMonth)}}'},
          '&laquo; {{strftime(previousMonth, "%b %Y")}}'],
      ],
      ['.current-month',
        '{{strftime(currentMonth, "%b %Y")}}'],
      ['.next-month',
        ['a', {href: '/expenses/{{formatForParam(nextMonth)}}'},
          '{{strftime(nextMonth, "%b %Y")}} &raquo;'],
      ],
    ],
    ['.total', 'Total: {{total}}'],
    ['.expense-group', {vRepeat: 'groupedExpenses'},
      ['p', '{{date}}'],
      ['table.expenses',
        ['tr', {vRepeat: 'expenses'},
          ['td.category', {vText: 'category && category.name'}],
          ['td.subject', {vText: 'subject'}],
          ['td.amount', {vText: 'amount'}],
          ['td',
            ['a', {href: '/expenses/{{id}}/edit'}, 'edit'],
            ' &middot; ',
            ['a', {href: '#', vOn: 'click: deleteExpense($data, $event)'},
              'delete']
          ],
        ],
      ],
    ],
  ]
);


module.exports = {
  template: template,

  data: function () {
    return {
      expenses: [],
      groupedExpenses: [],

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
    groupExpensesByDate: function (expenses) {
      var groupedExpenses = [], group = null;
      expenses.forEach(function (expense) {
        if (expense.date !== (group && group.date)) {
          group = {
            date: expense.date,
            expenses: [expense]
          };
          groupedExpenses.push(group);
        } else {
          group.expenses.push(expense);
        }
      });

      return groupedExpenses;
    },

    loadExpenses: function () {
      var that = this;
      var url = '/api/expenses/' + this.formatForParam(this.currentMonth);
      request.get(url, function (res) {
        if (!res.ok) return;
        that.expenses = res.body.expenses;
        that.groupedExpenses = that.groupExpensesByDate(that.expenses);
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
