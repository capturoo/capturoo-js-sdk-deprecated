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
const fetch = require('node-fetch');

class AccountDocumentSnapshot {
  /**
   * @typedef {object} AccountData
   * @property {string} AccountData.aid
   * @property {string} AccountData.email
   * @property {string} AccountData.privateApiKey
   * @property {Date} AccountData.created
   * @property {Date} AccountData.lastModified
   * @param {DashboardSDK} sdk
   * @param {capturoo.manage.AccountDocumentReference} non-null
   *   The AccountDocumentReference for the document included in the
   *   DocumentSnapshot.
   * @param {AccountData} accountData
   */
  constructor(aid, ref, exists, accountData) {
    Object.assign(this, {
      aid,
      ref,
      exists
    });

    if (exists && accountData) {
      this.account = {
        aid: accountData.aid,
        email: accountData.email,
        privateApiKey: accountData.privateApiKey,
        created: new Date(accountData.created),
        lastModified: new Date(accountData.lastModified)
      };
    } else {
      this.account = undefined;
    }
  }

  data() {
    return this.account;
  }
}

module.exports = AccountDocumentSnapshot;
