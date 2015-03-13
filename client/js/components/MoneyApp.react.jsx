var React = require('react');
var Router = require('react-router');
var {RouteHandler, Link} = Router;

var Header = require('./Header.react');

var MoneyApp = React.createClass({
  render: function () {
    return (
      <div className="container">
        <Header/>
        <RouteHandler/>
      </div>
    );
  }
});

module.exports = MoneyApp;
