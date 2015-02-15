var request = require('superagent');
var page = require('page');
var _ = require('../util');
var h = require('../html');

var template =
  h('.main',
    h('h2', 'Expenses'),
    h('form.expense-form', {vOn: 'submit: createExpense($event)'},
      h('input.date', {type: 'date', vModel: 'expense.date'}),
      h('select.category', {vModel: 'expense.categoryId',
          vOn: 'change: categorySelected()'},
        h('option', {value: ''}, '-- select category'),
        h('option', {vRepeat: 'categories', vText: 'name', vAttr: 'value: id'}),
        h('option', {value: '-1'}, '+ create new category')),
      h('input.amount', {type: 'number', vModel: 'expense.amount', min: 0}),
      h('input.subject', {type: 'text', vModel: 'expense.subject'}),
      h('button', {type: 'submit'}, 'Add')),
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
      expenses: [],
      expense: null,
      creating: false,
      categories: []
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

    loadCategories: function () {
      var that = this;
      request.get('/api/categories', function (res) {
        if (!res.ok) return;
        that.categories = res.body.categories;
      });
    },

    initializeExpense: function () {
      var d = new Date;
      var dts = d.toISOString(), i = dts.indexOf('T');
      var ds = dts.slice(0, i);
      this.expense = {
        date: ds,
        subject: '',
        categoryId: '',
        amount: 0,
      };
    },

    addExpense: function (expense) {
      var index = this.expenses.length;
      this.expenses.some(function (e, i) {
        if (e.date < expense.date) {
          index = i;
          return true;
        }
      });
      this.expenses.splice(index, 0, expense);
    },

    createExpense: function (e) {
      var that = this;
      e.preventDefault();
      if (this.creating) return;
      this.creating = true;

      var expense = _.underscoreKeys(this.expense);
      expense.category_id = expense.category_id || null;

      request.post('/api/expenses', expense, function (res) {
        if (res.ok) {
          that.addExpense(res.body);
          that.initializeExpense();
        } else {
          alert(res.body.error || 'error!');
        }
        that.creating = false;
      });
    },

    categorySelected: function () {
      var categoryId = parseInt(this.expense.categoryId);
      if (isNaN(categoryId)) {
        this.expense.categoryId = '';
      } else if (categoryId == -1) {
        this.expense.categoryId = '';
        this.createNewCategory();
      }
    },

    createNewCategory: function () {
      var name = prompt('Category name:', '');
      if (!name) return;
      var that = this;
      request.post('/api/categories', {name: name}, function (res) {
        if (res.ok) {
          that.addCategory(res.body);
        }
      });
    },

    addCategory: function (category) {
      var index = this.categories.length;
    }
  },

  created: function () {
    this.loadExpenses();
    this.loadCategories();
    this.initializeExpense();
  }
};
