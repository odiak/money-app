var page = require('page');
var request = require('superagent');
var h = require('../html');

var app = require('../base-app');

var template =
  h('.register',
    h('h2', 'Register'),
    h('form', {vOn: 'submit: submit($event)'},
      h('p.error', {vIf: 'invalid', vText: 'error'}),
      h('.form-group',
        h('label', {for: 'username'}, 'Username:'),
        h('input', {type: 'text', name: 'username', vModel: 'username'})
       ),
      h('.form-group',
        h('label', {for: 'password'}, 'Password:'),
        h('input', {type: 'password', name: 'password', vModel: 'password'})
       ),
      h('button.btn', {type: 'submit'}, 'Register')
     )
   );

module.exports = {
  template: template,

  data: function () {
    return {
      username: '',
      password: '',
      error: ''
    };
  },

  methods: {
    submit: function (e) {
      e.preventDefault();

      var that = this;
      this.error = '';
      request
        .post('/api/user')
        .send({name: this.username, password: this.password})
        .end(function (error, res) {
          if (error) {
            that.error = 'Error';
          } else if (!res.ok) {
            that.error = res.body;
          } else {
            app.currentUser = res.body;
            page.redirect('/');
          }
        });
    }
  }
};
