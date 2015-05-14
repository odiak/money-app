var React = require('react/addons');

var Router = require('react-router');
var {Navigation} = Router;

var UserActionCreators = require('../actions/UserActionCreators');
var UserStore = require('../stores/UserStore');

var Login = React.createClass({
  mixins: [
    React.addons.LinkedStateMixin,
    Navigation,
  ],

  getInitialState (props) {
    return {
      error: '',
      username: '',
      password: '',
    };
  },

  componentDidMount () {
    UserStore.addChangeListener(this._handleUserChange);
  },

  componentWillUnmount () {
    UserStore.removeChangeListener(this._handleUserChange);
  },

  render () {
    return (
      <div className="login">
        <h2>Login</h2>

        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Username: </label>
            <input type="text" valueLink={this.linkState('username')} />
          </div>
          <div className="form-group">
            <label>Password: </label>
            <input type="password" valueLink={this.linkState('password')} />
          </div>

          <button type="submit" className="btn">login</button>
        </form>
      </div>
    );
  },

  handleSubmit (e) {
    e.preventDefault();
    UserActionCreators.login(this.state.username, this.state.password);
  },

  _handleUserChange () {
    if (UserStore.get()) {
      this.context.router.transitionTo('/');
    }
  },
});

module.exports = Login;
