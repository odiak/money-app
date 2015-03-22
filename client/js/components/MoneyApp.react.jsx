var React = require('react');
var Router = require('react-router');
var {RouteHandler, Link} = Router;

var Header = require('./Header.react');
var UserStore = require('../stores/UserStore');
var UserActionCreators = require('../actions/UserActionCreators');

function getStateFromStore () {
  return {
    user: UserStore.get(),
  };
}

var MoneyApp = React.createClass({
  getInitialState: function () {
    return getStateFromStore();
  },

  componentDidMount: function () {
    UserActionCreators.loadUser();
    UserStore.addChangeListener(this._onUserLoaded);
  },

  render: function () {
    if (!this.state.user) return false;

    return (
      <div className="container">
        <Header/>
        <RouteHandler/>
      </div>
    );
  },

  _onUserLoaded: function () {
    this.setState(getStateFromStore());
  }
});

module.exports = MoneyApp;
