const firebase = require('@firebase/app').default;
const fetch = require('node-fetch');
const Account = require('./account');

class Manage {
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

  setToken(token) {
    this.idTokenResult = token;
  }

  /**
   * GetAccount: Get the account for the currently logged in user
   * @typedef account
   * @returns {Promise.<Account>}
   */
  async account() {
    try {
      if (!this.idTokenResult) {
        throw Error('auth/not-signed-in');
      }
      let res = await fetch(`${this.config.capture.endpoint}/account`, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': this.idTokenResult.token
        },
        mode: 'cors'
      });

      if (res.status >= 400) {
        let data = await res.json();
        let e = Error(data.message)
        e.code = data.status;
        throw e;
      }
      return new Account(this, await res.json());
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Manage;
