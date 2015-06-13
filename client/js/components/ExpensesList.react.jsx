let React = require('react');

let ExpenseGroup = require('./ExpenseGroup.react');

let ExpensesList = React.createClass({
  render() {
    let groupedExpenses = [], group;
    this.props.expenses.forEach((expense) => {
      if (!group || expense.date !== group.date) {
        group = {
          date: expense.date,
          expenses: [expense],
        };
        groupedExpenses.push(group);
      } else {
        group.expenses.push(expense);
      }
    });

    let groups = groupedExpenses.map((group) => {
      return (
        <ExpenseGroup date={group.date} expenses={group.expenses}
          key={group.date}/>
      );
    });

    return <div>{groups}</div>;
  },
});

module.exports = ExpensesList;
