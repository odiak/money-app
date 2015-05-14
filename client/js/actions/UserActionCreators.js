var request = require('superagent');

var MoneyAppDispatcher = require('../dispatcher/MoneyAppDispatcher');
var {ActionTypes} = require('../constants/MoneyAppConstants');

module.exports = {
  loadUser () {
    console.log('loading');
    request
      .get('/api/user')
      .end((err, res) => {
        if (!err && res.ok) {
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
      .end((err, res) => {
        if (!err && res.ok) {
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
    request
      .post('/api/user')
      .send({name: userName, password})
      .end((err, res) => {
        if (!err && res.ok) {
          MoneyAppDispatcher.dispatch({
            type: ActionTypes.RECEIVE_USER,
            user: res.body,
          });
        } else {
          MoneyAppDispatcher.dispatch({
            type: ActionTypes.RECEIVE_USER,
            user: res.body,
          });
        }
      });
  },

  logout () {
  }
};
