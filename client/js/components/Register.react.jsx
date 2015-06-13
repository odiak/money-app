var React = require('react/addons');

var Router = require('react-router');
var {Navigation} = Router;

let AuthService = require('../AuthService');

var Register = React.createClass({
  mixins: [
    React.addons.LinkedStateMixin,
    Navigation,
  ],

  getInitialState () {
    return {
      error: '',
      username: '',
      password: '',
    };
  },

  componentDidMount () {
    AuthService.on('authStateChange', this._handleUserChange);
  },

  componentWillUnmount () {
    AuthService.removeListener('authStateChange', this._handleUserChange);
  },

  render () {
    return (
      <div className="register">
        <h2>Register</h2>

        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Username: </label>
            <input type="text" valueLink={this.linkState('username')} />
          </div>
          <div className="form-group">
            <label>Password: </label>
            <input type="password" valueLink={this.linkState('password')} />
          </div>

          <button type="submit" className="btn">register</button>
        </form>
      </div>
    );
  },

  handleSubmit (e) {
    e.preventDefault();
    UserActionCreators.register(this.state.username, this.state.password);
  },

  _handleUserChange () {
    if (AuthService.getUser()) {
      this.context.router.transitionTo('/');
    }
  },
});

module.exports = Register;
