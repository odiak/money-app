let EventEmitter = require('events');
let assign = require('object-assign');
let request = require('superagent');

let isUserLoaded = false;
let currentUser = null;

let loadingUser = false;

let AuthService = assign({}, EventEmitter.prototype, {

  isUserLoaded() {
    return isUserLoaded;
  },

  getUser() {
    return currentUser;
  },

  loadUser() {
    if (loadingUser) return;
    loadingUser = true;

    request
      .get('/api/user')
      .end((err, res) => {
        loadingUser = false;
        isUserLoaded = true;
        if (!err && res.ok) {
          currentUser = res.body;
          this.emit('load');
        } else {
          this.emit('load:failed');
        }
        this.emit('authStateChange');
      });
  },

  login(userName, password) {
    request
      .post('/api/user/auth')
      .send({name: userName, password})
      .end((err, res) => {
        if (!err && res.ok) {
          currentUser = res.body;
          isUserLoaded = true;
          this.emit('login');
        } else {
          this.emit('login:failed');
        }
        this.emit('authStateChange');
      });
  },

  register() {
    request
      .post('/api/user')
      .send({name: userName, password})
      .end((err, res) => {
        if (!err && res.ok) {
          currentUser = res.body;
          isUserLoaded = true;
          this.emit('register');
        } else {
          this.emit('register:failed');
        }
        this.emit('authStateChange');
      });
  },

  logout() {
    request
      .put('/api/user/logout')
      .end((err, res) => {
        if (!err && res.ok) {
          currentUser = null;
          isUserLoaded = false;
          this.emit('logout');
        } else {
          this.emit('logout:failed')
        }
        this.emit('authStateChange');
      });
  },

});

module.exports = AuthService;
