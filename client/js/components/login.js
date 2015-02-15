var page = require('page');
var request = require('superagent');
var h = require('../html');

var app = require('../base-app');

var template =
  h('.login',
    h('h2', 'Login'),
    h('form', {vOn: 'submit: submit($event)'},
      h('p.error', {vIf: 'invalid'}, 'Invalid username or password.'),
      h('.form-group',
        h('label', {for: 'username'}, 'Username:'),
        h('input', {type: 'text', name: 'username', vModel: 'username'})),
      h('.form-group',
        h('label', {for: 'password'}, 'Password:'),
        h('input', {type: 'password', name: 'password', vModel: 'password'})),
      h('button.btn', {type: 'submit'}, 'login')));

module.exports = {
  template: template,

  data: function () {
    return {
      username: '',
      password: '',
      invalid: false,
    };
  },

  methods: {
    submit: function (ev) {
      ev.preventDefault();

      var that = this;
      this.invalid = false;
      request
        .post('/api/user/auth')
        .send({name: this.username, password: this.password})
        .end(function (error, res) {
          if (!error && res.ok) {
            app.currentUser = res.body;
            page.redirect('/');
          } else {
            that.invalid = true;
          }
        });
    }
  }
};
