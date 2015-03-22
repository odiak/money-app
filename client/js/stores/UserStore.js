var assign = require('object-assign');
var EventEmitter = require('events');

var MoneyAppDispatcher = require('../dispatcher/MoneyAppDispatcher');
var {ActionTypes} = require('../constants/MoneyAppConstants');

var CHANGE_EVENT = 'change';

var user = null;

var UserStore = assign({}, EventEmitter.prototype, {

  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  get: function () {
    return user;
  },

});

UserStore.dispatchToken = MoneyAppDispatcher.register(function (action) {
  switch (action.type) {

    case ActionTypes.RECEIVE_USER:
      user = action.user || {};
      UserStore.emitChange();
      break;

    default:
  }
});

module.exports = UserStore;
