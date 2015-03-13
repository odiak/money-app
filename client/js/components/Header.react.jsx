var React = require('react');
var {Link} = require('react-router');

var Header = React.createClass({
  render: function () {
    return (
      <div className="header">
        <h1>Money</h1>
        <ul className="nav">
          <li><Link to="app">home</Link></li>
          <li><Link to="login">login</Link></li>
          <li><Link to="register">register</Link></li>
        </ul>
      </div>
    );
  }
});

module.exports = Header;
