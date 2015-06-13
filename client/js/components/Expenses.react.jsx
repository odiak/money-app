var React = require('react');

let assign = require('object-assign');
let {Link, Navigation} = require('react-router');
let request = require('superagent');

let strftime = require('../strftime');

let ExpensesNav = require('./ExpensesNav.react');
let TotalExpense = require('./TotalExpense.react')
let ExpensesList = require('./ExpensesList.react');

function safeParseInt(str) {
  return str != null ? parseInt(str) : null;
}

var Expenses = React.createClass({
  mixins: [Navigation],

  getInitialState() {
    return {
      expenses: [],
      loaded: false,
      loading: false,
      year: null,
      month: null,
    };
  },

  componentDidMount() {
  },

  render: function () {
    let now = new Date, params = this.props.params;
    console.log(params);
    let year = (params.year != null
        ? +params.year
        : now.getFullYear());
    let month = (params.month != null
        ? +params.month
        : now.getMonth());

    if (this.state.year !== year || this.state.month !== month) {
      request
        .get(`/api/expenses/${year}-${month}`)
        .end((err, res) => {
          if (err || !res.ok) return;
          this.setState({
            year,
            month,
            expenses: res.body.expenses,
          });
        });
    }

    return (
      <div className="main">
        <h2>Expenses</h2>
        <ExpensesNav year={year} month={month}/>
        <TotalExpense expenses={this.state.expenses}/>
        <ExpensesList expenses={this.state.expenses}/>
      </div>
    );
  },
});

module.exports = Expenses;
