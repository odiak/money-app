var assign = require('object-assign');
var EventEmitter = require('events');

var MoneyAppDispatcher = require('../dispatcher/MoneyAppDispatcher');
var {ActionTypes} = require('../constants/MoneyAppConstants');

var CHANGE_EVENT = 'change';
var LOAD_EVENT = 'load';
var LOGOUT_EVENT = 'logout';

var currentUserLoaded = false;
var currentUser = null;

var UserStore = assign({}, EventEmitter.prototype, {

  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  emitLoad() {
    this.emit(LOAD_EVENT, currentUser);
  },

  emitLogOut() {
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  get: function () {
    return currentUser;
  },

  isLoaded () {
    return currentUserLoaded;
  },

  isLoggedIn () {
  },

});

UserStore.dispatchToken = MoneyAppDispatcher.register(function (action) {
  switch (action.type) {

    case ActionTypes.RECEIVE_USER:
      currentUser = action.user;
      currentUserLoaded = true;
      UserStore.emitChange();
      break;

    default:
  }
});

module.exports = UserStore;
