var request = require('superagent');

var MoneyAppDispatcher = require('../dispatcher/MoneyAppDispatcher');
var {ActionTypes} = require('../constants/MoneyAppConstants');

module.exports = {
  loadUser () {
    console.log('loading');
    request.get('/api/user', (res) => {
      if (res.ok) {
        MoneyAppDispatcher.dispatch({
          type: ActionTypes.RECEIVE_USER,
          user: res.body,
        });
      } else {
        MoneyAppDispatcher.dispatch({
          type: ActionTypes.RECEIVE_USER,
          user: null,
        });
      }
    });
  },

  login (userName, password) {
    request
      .post('/api/user/auth')
      .send({name: userName, password})
      .end((res) => {
        if (res.ok) {
          MoneyAppDispatcher.dispatch({
            type: ActionTypes.RECEIVE_USER,
            user: res.body,
          });
        } else {
          MoneyAppDispatcher.dispatch({
            type: ActionTypes.RECEIVE_USER,
            user: null,
          });
        }
      });
  },

  register (userName, password) {
  },

  logout () {
  }
};
