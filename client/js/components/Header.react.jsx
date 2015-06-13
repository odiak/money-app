var React = require('react');
var {Navigation, Link} = require('react-router');

let AuthService = require('../AuthService')

function getStateFromStore () {
  return {
    user: AuthService.getUser(),
  };
}

var Header = React.createClass({
  mixins: [Navigation],

  getInitialState: function () {
    return getStateFromStore();
  },

  componentDidMount: function () {
    AuthService.on('authStateChange', this._onUserChanged);
    if (!AuthService.isUserLoaded()) {
      AuthService.loadUser();
    }
  },

  render: function () {
    var items = false;
    var user = this.state.user;
    if (user && user.id) {
      items = [
        <li key="expenses"><Link to="app">expenses</Link></li>,
        <li key="logout"><a href="#" onClick={this._logOut}>logout</a></li>,
      ];
    } else {
      items = [
        <li key="login"><Link to="login">login</Link></li>,
        <li key="register"><Link to="register">register</Link></li>,
      ];
    }

    return (
      <div className="header">
        <h1>Money</h1>
        <ul className="nav">
          {items}
        </ul>
      </div>
    );
  },

  _onUserChanged: function () {
    this.setState(getStateFromStore());
  },

  _logOut() {
    if (!confirm('are you sure?')) return;
    AuthService.logout();
    this.context.router.transitionTo('/login');
  },
});

module.exports = Header;
