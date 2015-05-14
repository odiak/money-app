var React = require('react');
var Router = require('react-router');
var {RouteHandler} = Router;

var Header = require('./Header.react');

var MoneyApp = React.createClass({
  render () {
    return (
      <div className="container">
        <Header/>
        <RouteHandler/>
      </div>
    );
  },
});

module.exports = MoneyApp;
