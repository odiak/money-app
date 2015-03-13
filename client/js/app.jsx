require('./csrf-protection');

var React = require('react');
var Router = require('react-router');
var {Route, DefaultRoute} = Router;

var MoneyApp = require('./components/MoneyApp.react');
var Login    = require('./components/Login.react');
var Register = require('./components/Register.react');
var Expenses = require('./components/Expenses.react');

var routes = (
  <Route name="app" path="/" handler={MoneyApp}>
    <Route name="login" handler={Login}/>
    <Route name="register" handler={Register}/>
    <Route name="expenses" handler={Expenses}/>
    <DefaultRoute handler={Expenses}/>
  </Route>
);

var body = document.body;
Router.run(routes, Router.HistoryLocation, function (Handler) {
  React.render(<Handler/>, body);
});
