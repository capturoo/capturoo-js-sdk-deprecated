const firebase = require('@firebase/app').default;
require('@firebase/auth');
const fetch = require('node-fetch');

class Auth {
  /**
   * @param config firebase web client config from Firebase control panel
   * @param {string} config.firebase.apiKey
   * @param {string} config.firebase.authDomain
   * @param {string} config.firebase.projectId
   * @param {string} config.firebase.messagingSenderId
   * @param {object} config.fetch
   * @param {config} config
   */
  constructor(config) {
    if (!firebase.apps.length) {
      firebase.initializeApp(config.firebase);
    }
    this.config = config || {};
    this.idTokenResult = undefined;
  }

  /**
   * Signup a new user
   * @typedef user
   * @property {string} uid
   * @property {string} email
   * @property {string} displayName
   * @property {string} created
   * @param {string} email
   * @param {string} password
   * @param {string} displayName
   * @returns {Promise.<userCredential>} user details object
   */
  async signUpUser(email, password, displayName) {
    try {
      // Google Firebase docs for this are incorrect
      // https://firebase.google.com/docs/reference/js/firebase.User
      let userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      let user = userCredential.user;
      await user.updateProfile({
        displayName
      });
      await user.sendEmailVerification();
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        created: user.metadata.creationTime
      };
    } catch (err) {
      throw err;
    }
  }

  /**
   * Signs in a user
   * @param {string} email
   * @param {string} password
   * @returns {Promise.<firebase.auth.UserCredential>}
   * @see https://firebase.google.com/docs/reference/node/firebase.auth#.UserCredential
   */
  async signInWithEmailAndPassword(email, password) {
    let userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    this.idTokenResult = await userCredential.user.getIdTokenResult();
    return userCredential;
  }

  async getToken() {
    return this.idTokenResult;
  }

  /**
   * Signs out a user
   * @returns {Promise.<undefined>}
   */
  async signOut() {
    return await firebase.auth().signOut();
  }

  /**
   * Watch for changes to the auth
   * @param cb {function} callback function to call when the auth state changes
   */
  onAuthStateChanged(cb) {
    firebase.auth().onAuthStateChanged(cb);
  }

  authCurrentUser() {
    return firebase.auth().currentUser;
  }

  /**
   * Sends reset password email to a user
   * @returns {Promise.<undefined>}
   */
  async sendPasswordResetEmail(email, continueUrl) {
    try {
      await firebase.auth().sendPasswordResetEmail(email, { url: continueUrl });
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Auth;
