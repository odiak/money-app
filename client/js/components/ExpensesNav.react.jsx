let React = require('react');
let {Link} = require('react-router');

let strftime = require('../strftime');

function dateToParams(date) {
  return {year: date.getFullYear(), month: date.getMonth() + 1};
}

let ExpensesNav = React.createClass({
  propTypes: {
    year: React.PropTypes.number.isRequired,
    month: React.PropTypes.number.isRequired,
  },

  render() {
    let {year, month} = this.props;

    let thisMonth = new Date(year, month - 1, 1);
    let nextMonth = new Date(year, month    , 1);
    let prevMonth = new Date(year, month - 2, 1);

    return (
      <div className="month-nav">
        <div className="prev-month">
          <Link to="expenses" params={dateToParams(prevMonth)}>
            &laquo; {strftime(prevMonth, '%b %Y')}
          </Link>
        </div>
        <div className="current-month">
          {strftime(thisMonth, '%b %Y')}
        </div>
        <div className="next-month">
          <Link to="expenses" params={dateToParams(nextMonth)}>
            {strftime(nextMonth, '%b %Y')} &raquo;
          </Link>
        </div>
      </div>
    );
  },

});

module.exports = ExpensesNav;
