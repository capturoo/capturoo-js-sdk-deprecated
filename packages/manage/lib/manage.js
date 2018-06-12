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

class Manage {
  /**
   * @param {object} config.manage
   * @param {config} config
   */
  constructor(config) {
    this.config = config || {};
    this.idTokenResult = undefined;
  }

  setToken(token) {
    this.idTokenResult = token;
  }

  /**
   * GetAccounts: Get accounts
   * accounts() returns capturoo.manage.AccountsCollectionReference
   * Gets an AccountsCollectionReference instance that refers to the
   * accounts collection.
   * @returns {capturoo.manage.AccountsCollectionReference}
   */
  accounts() {
    return new AccountsCollectionReference(this);
  }
}

module.exports = Manage;
