/**
 * Copyright 2018 Capturoo
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const AccountsCollectionReference = require('./accounts-collection-reference');

class Store {
  /**
   * @param {object} config.store
   * @param {config} config
   */
  constructor(config) {
    Object.assign(this, {
      config: config || {},
      idTokenResult: undefined,
      privateApiKey: undefined,
      authMode: undefined
    });
  }

  setToken(token) {
    this.idTokenResult = token;
    this.authMode = 'token';
  }

  setPrivateApiKey(key) {
    this.privateApiKey = key;
    this.authMode = 'private-api-key';
  }

  getAuthHeader() {
    if (this.authMode === 'token') {
      return {
        'x-access-token': this.idTokenResult.token
      };
    } else if (this.authMode === 'private-api-key') {
      return {
        'x-api-key': this.privateApiKey
      };
    }
    let e = Error('You must call setToken(token) or setPrivateApiKey(key) first before calling API methods.');
    e.code = 'store/auth-no-token-or-key-set';
    throw e;
  }

  /**
   * GetAccounts: Get accounts
   * accounts() returns capturoo.store.AccountsCollectionReference
   * Gets an AccountsCollectionReference instance that refers to the
   * accounts collection.
   * @returns {capturoo.store.AccountsCollectionReference}
   */
  accounts() {
    return new AccountsCollectionReference(this);
  }
}

module.exports = Store;
