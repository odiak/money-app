require('./csrf-protection');

var React = require('react');
var MoneyApp = require('./components/MoneyApp.react');

React.render(<MoneyApp/>, document.body);
