var request = require('superagent');
var page = require('page');
var _ = require('../util');
var h = require('../html');

var template =
  h('.new-expense',
    h('form.form.form-horizontal', {vOn: 'submit: createExpense($event)'},
      h('.form-group',
        h('.control-label.col-2', 'date'),
        h('.col-10',
          h('input.form-control', {type: 'date', vModel: 'expense.date'}))),

      h('.form-group',
        h('.control-label.col-2', 'category'),
        h('.col-10',
          h('select.form-control', {vModel: 'expense.categoryId',
              vOn: 'change: categorySelected()'},
            h('option', {value: ''}, '-- select category'),
            h('option', {vRepeat: 'categories', vText: 'name',
                vAttr: 'value: id'}),
            h('option', {value: 'new'}, '+ create new category')))),

      h('.form-group',
        h('.control-label.col-2', 'amount'),
        h('.col-10',
          h('input.form-control', {type: 'number', vModel: 'expense.amount',
              min: 0}))),

      h('.form-group',
        h('.control-label.col-2', 'subject'),
        h('.col-10',
          h('input.form-control', {type: 'text', vModel: 'expense.subject'}))),

      h('.form-group',
        h('.col-10.col-offset-2',
          h('button.btn', {type: 'submit'}, 'Add')))));

module.exports = {
  template: template,

  data: function () {
    return {
      categories: [],
      expense: {
        date: '',
        categoryId: '',
        amount: '',
        subject: ''
      },
      creating: false
    };
  },

  methods: {
    today: function () {
      var date = new Date,
          y = date.getFullYear(),
          m = date.getMonth() + 1,
          d = date.getDate();
      if (m < 10) m = '0' + m;
      if (d < 10) d = '0' + d;
      return [y, m, d].join('-');
    },

    loadCategories: function () {
      var that = this;
      request.get('/api/categories', function (res) {
        if (!res.ok) return;
        that.categories = res.body.categories;
      });
    },

    resetExpense: function () {
      var x = this.expense;
      x.date = this.today();
      x.categoryId = '';
      x.amount = '';
      x.subject = '';
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
          page.redirect('/');
        } else {
          alert(res.body.error || 'error!');
        }
        that.creating = false;
      });
    },

    categorySelected: function () {
      if (this.expense.categoryId === 'new') {
        this.expense.categoryId = '';
        this.createNewCategory();
      }
    },

    createNewCategory: function () {
      var name = prompt('Category name:', '');
      if (!name) return;
      var that = this;
      request.post('/api/categories', {name: name}, function (res) {
        if (res.ok) that.addCategory(res.body);
      });
    },

    addCategory: function (category) {
      var i, categories = this.categories;
      for (i = 0; i < categories.length; i++) {
        if (category.name < categories[i].name) break;
      }
      categories.splice(i, 0, category);
    }
  },

  created: function () {
    this.loadCategories();
    this.resetExpense();
  }
};
