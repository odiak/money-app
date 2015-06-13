let React = require('react');

let strftime = require('../strftime');

let ExpenseGroup = React.createClass({

  render() {
    let rows = this.props.expenses.map((ex) => {
      let category = (ex.category
        ? <div className="category">{ex.category.name}</div>
        : null);

      return (
        <tr key={ex.id}>
          <td className="description">
            {category}
            <div className="subject">{ex.subject}</div>
          </td>
          <td className="amount">{ex.amount}</td>
          <td className="buttons">
            <a href="#">edit</a>
            &nbsp;&middot;&nbsp;
            <a href="#">delete</a>
          </td>
        </tr>
      );
    })

    return (
      <div className="expense-group">
        <div className="date">
          {strftime(new Date(this.props.date), '%d %b %Y')}
        </div>
        <table className="expenses">
          {rows}
        </table>
      </div>
    );
  },
});

module.exports = ExpenseGroup;
