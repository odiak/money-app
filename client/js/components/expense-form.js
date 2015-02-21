var request = require('superagent');
var page = require('page');

var h = require('../html');
var _ = require('../util');

var template = 
  h('form.form.form-horizontal', {vOn: 'submit: submitted($event)'},
    h('.form-group',
      h('.control-label.col-2', 'date'),
      h('.col-10',
        h('input.form-control', {type: 'date', vModel: 'expense.date'}))),

    h('.form-group',
      h('.control-label.col-2', 'category'),
      h('.col-10',
        h('select.form-control', {vModel: 'expense.categoryId',
            vOn: 'change: categorySelected()',
            options: 'categoryOptions'}))),

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
        h('button.btn', {type: 'submit', vIf: 'isNew'}, 'Create'),
        h('button.btn', {type: 'submit', vIf: '!isNew'}, 'Update'))));


function todayStr () {
  var date = new Date,
      y = date.getFullYear(),
      m = date.getMonth() + 1,
      d = date.getDate();
  if (m < 10) m = '0' + m;
  if (d < 10) d = '0' + d;
  return [y, m, d].join('-');
}

module.exports = {
  template: template,

  data: function () {
    return {
      expense: {
        date: todayStr(),
        categoryId: '',
        amount: '',
        subject: ''
      },
      categories: []
    };
  },

  created: function () {
    this.loadCategories();
  },

  computed: {
    isNew: function () {
      return typeof this.expense.id === 'undefined';
    },
    categoryOptions: function () {
      var options = this.categories.map(function (cat) {
        return {
          text: cat.name,
          value: cat.id
        };
      });
      options.unshift({text: '-- select category --', value: ''});
      options.push({text: '+ create new category', value: 'new'});
      return options;
    }
  },

  methods: {
    loadCategories: function () {
      var that = this;
      request.get('/api/categories', function (res) {
        if (!res.ok) return;
        that.categories = res.body.categories;
      });
    },

    submitted: function (e) {
      var that = this;
      e.preventDefault();
      if (this.saving) return;
      this.saving = true;

      var expense = _.underscoreKeys(this.expense);
      expense.category_id = expense.category_id || null;

      var callback = function (res) {
        if (res.ok) {
          page.redirect('/');
        } else {
          alert(res.body.error || 'error!');
        }
        that.saving = false;
      };

      if (this.isNew) {
        request.post('/api/expenses', expense, callback);
      } else {
        request.put('/api/expenses/' + this.expense.id, expense, callback);
      }
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
      this.expense.categoryId = category.id;
    }
  }
};
