require('./csrf-protection');

var React = require('react');
var Router = require('react-router');
var {Route, DefaultRoute} = Router;

var MoneyApp     = require('./components/MoneyApp.react');
var Login        = require('./components/Login.react');
var Register     = require('./components/Register.react');
var AuthRequired = require('./components/AuthRequired.react');
var Expenses     = require('./components/Expenses.react');

var routes = (
  <Route name="app" path="/" handler={MoneyApp}>
    <Route name="login" handler={Login}/>
    <Route name="register" handler={Register}/>

    <Route handler={AuthRequired}>
      <Route name="expenses" path="expenses/:year-:month" handler={Expenses}/>
      <DefaultRoute handler={Expenses}/>
    </Route>
  </Route>
);

var targetElement = document.getElementById('main');
Router.run(routes, Router.HistoryLocation, function (Handler) {
  React.render(<Handler/>, targetElement);
});
