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
const Project = require('./project');
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
   * CreateProject: Create a new project
   * @param {String} projectId globally unique project ID
   * @param {String} projectName project name
   * @throws rethrows any underlying firebase.store exceptions
   * @returns {Promise.<Project>}
   * @see https://firebase.google.com/docs/reference/js/firebase.firestore.Timestamp
   */
  async createProject(projectId, projectName) {
    try {
      let res = await fetch(`${this._sdk.config.capture.endpoint}/projects`, {
        body: JSON.stringify({
          projectId,
          projectName
        }),
        method: 'POST',
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

      return new Project(this._sdk, this.aid, await res.json());
    } catch (err) {
      throw err;
    }
  }

  /**
   * GetProject: Get a project by project ID
   * @param {String} projectId the Project's unique identifier
   * @returns {Promise.<Project|null>}
   */
  async project(projectId) {
    try {
      let res = await fetch(`${this._sdk.config.capture.endpoint}/projects/${projectId}`, {
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

      let project = await res.json();
      return project;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Fetch all projects associated to this account
   * @returns {Promise.<Project[]>} of Project objects
   * @throws rethrows firebase.firestore exceptions
   */
  async projects() {
    try {
      let res = await fetch(`${this._sdk.config.capture.endpoint}/projects`, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': this._sdk.idTokenResult.token
        },
        mode: 'cors'
      });

      let projects = [];
      for (const data of await res.json()) {
        projects.push(new Project(this._sdk, this.aid, data));
      };
      return projects;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Account;
