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
const AccountDocumentReference = require('./account-document-reference');
const fetch = require('node-fetch');

class AccountsCollectionReference {
  constructor(manage) {
    Object.assign(this, {
      manage,
      parent: null
    });
  }

  /**
   * Gets an AccountDocumentReference for a document within the account.
   * @returns {capturoo.manage.AccountDocumentReference}
   */
  doc(aid) {
    return new AccountDocumentReference(this.manage, aid, this);
  }

  /**
   * GetAccount: Get all accounts
   * @typedef account
   * @returns {Promise.<AccountDocumentReference[]>}
   */
  async get() {
  }
}

module.exports = AccountsCollectionReference;
