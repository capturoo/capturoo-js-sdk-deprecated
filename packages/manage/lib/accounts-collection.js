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
const Account = require('./account');
const fetch = require('node-fetch');

class AccountsCollection {
  constructor(sdk, accountInfo) {
    Object.assign(this, {
      _sdk: sdk
    });
  }

  async doc() {
    try {
      if (!this._sdk.idTokenResult) {
        throw Error('auth/not-signed-in');
      }
      let res = await fetch(`${this._sdk.config.capture.endpoint}/account`, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': this._sdk.idTokenResult.token
        },
        mode: 'cors'
      });

      if (res.status >= 400) {
        let data = await res.json();
        let e = Error(data.message)
        e.code = data.status;
        throw e;
      }
      return new Account(this._sdk, await res.json());
    } catch (err) {
      throw err;
    }
  }

  /**
   * GetAccount: Get the account by aio or current user if logged in
   * @typedef account
   * @returns {Promise.<Account>}
   */
  async get() {
  }
}

module.exports = AccountsCollection;
