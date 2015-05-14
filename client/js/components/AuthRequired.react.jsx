let React = require('react');
let {RouteHandler, Navigation} = require('react-router');

let UserStore = require('../stores/UserStore');
let UserActionCreators = require('../actions/UserActionCreators');

var AuthRequired = React.createClass({
  statics: {
    willTransitionTo (transition, params, query, callback) {
      if (UserStore.isLoaded()) {
        if (!UserStore.get()) {
          transition.redirect('/login');
        }
        callback();
      } else {
        UserActionCreators.loadUser();
        UserStore.once('change', () => {
          if (!UserStore.get()) {
            transition.redirect('/login');
          }
          callback();
        });
      }
    },
  },

  render () {
    return <RouteHandler/>;
  },
});

module.exports = AuthRequired;
