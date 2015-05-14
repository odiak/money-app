var React = require('react');
var {Link} = require('react-router');

var UserStore = require('../stores/UserStore');

function getStateFromStore () {
  return {
    user: UserStore.get(),
  };
}

var Header = React.createClass({
  getInitialState: function () {
    return getStateFromStore();
  },

  componentDidMount: function () {
    UserStore.addChangeListener(this._onUserChanged);
  },

  render: function () {
    var items = false;
    var user = this.state.user;
    if (user && user.id) {
      items = [
        <li key="home"><Link to="app">home</Link></li>,
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
  }
});

module.exports = Header;
