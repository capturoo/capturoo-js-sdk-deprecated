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
const ProjectsCollection = require('./projects-collection');
const fetch = require('node-fetch');

class Account {
  /**
   * @typedef {object} AccountInfo
   * @property {string} AccountInfo.accountId
   * @property {string} AccountInfo.email
   * @property {string} AccountInfo.privateApiKey
   * @property {Date} AccountInfo.created
   * @property {Date} AccountInfo.lastModified
   * @param {DashboardSDK} sdk
   * @param {AccountInfo} accountInfo
   */
  constructor(sdk, accountInfo) {
    Object.assign(this, {
      _sdk: sdk,
      aid: accountInfo.accountId,
      email: accountInfo.email,
      privateApiKey: accountInfo.privateApiKey,
      created: new Date(accountInfo.created),
      lastModified: new Date(accountInfo.lastModified)
    });
  }

  /**
   * Fetch all projects associated to this account
   * @returns {ProjectsCollection} collection of projects
   */
  projects() {
    return new ProjectsCollection(this._sdk);
  }
}

module.exports = Account;
