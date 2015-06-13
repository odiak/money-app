let React = require('react');
let {RouteHandler, Navigation} = require('react-router');

let AuthService = require('../AuthService');

var AuthRequired = React.createClass({
  statics: {
    willTransitionTo (transition, params, query, callback) {
      if (AuthService.isUserLoaded()) {
        if (!AuthService.getUser()) {
          transition.redirect('/login');
        }
        callback();
      } else {
        AuthService.loadUser();
        AuthService.once('authStateChange', () => {
          if (!AuthService.getUser()) {
            transition.redirect('/login');
          }
          callback();
        });
      }
    },
  },

  mixins: [Navigation],

  getInitialState () {
    return {
      loggedIn: false,
    };
  },

  componentDidMount () {
    if (AuthService.isUserLoaded() && AuthService.getUser()) {
      this.setState({loggedIn: true});
      return;
    }

    AuthService.loadUser();
    AuthService.on('load', this._onLoadUser);
    AuthService.on('load:failed', this._onFailedToLoadUser);
  },

  componentWillUnmount () {
    AuthService.removeListener('load', this._onLoadUser);
    AuthService.removeListener('load:failed', this._onFailToLoadUser);
  },

  render () {
    if (this.state.loggedIn) {
      return <RouteHandler/>;
    } else {
      return null;
    }
  },

  _onLoadUser () {
    this.setState({loggedIn: true});
  },

  _onFailToLoadUser () {
    this.context.router.transitionTo('/login');
  },
});

module.exports = AuthRequired;
