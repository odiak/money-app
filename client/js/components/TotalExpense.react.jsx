let React = require('react');

let TotalExpense = React.createClass({
  render() {
    let total = this.props.expenses.reduce((a, b) => a + b.amount, 0);

    return <div className="total">Total: {total}</div>;
  },
});

module.exports = TotalExpense;
