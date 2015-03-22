var request = require('superagent');

var MoneyAppDispatcher = require('../dispatcher/MoneyAppDispatcher');
var {ActionTypes} = require('../constants/MoneyAppConstants');

module.exports = {
  loadUser: function () {
    request.get('/api/user', function (res) {
      if (res.ok) {
        MoneyAppDispatcher.dispatch({
          type: ActionTypes.RECEIVE_USER,
          user: res.body,
        });
      }
      else {
        MoneyAppDispatcher.dispatch({
          type: ActionTypes.RECEIVE_USER,
          user: null,
        });
      }
    });
  },

  login: function (userName, password) {
  },

  register: function (userName, password) {
  },

  logout: function () {
  }
};
