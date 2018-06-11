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
class ProjectsCollection {
  constructor(sdk, accountInfo) {
    Object.assign(this, {
      _sdk: sdk
    });
  }

  /**
   * GetProject: Get a project by project ID
   * @param {String} pid project ID unqiue for this account
   * @returns {Promise.<Project|null>}
   */
  async doc(pid) {
    try {
      let res = await fetch(`${this._sdk.config.capture.endpoint}/projects/${pid}`, {
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
   * @returns {Promise<Project[]>}
   */
  async get() {
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

  /**
   * CreateProject: Create a new project
   * @param {String} pid project ID unqiue with this account
   * @param {String} projectName project name
   * @throws rethrows any underlying firebase.store exceptions
   * @returns {Promise.<Project>}
   * @see https://firebase.google.com/docs/reference/js/firebase.firestore.Timestamp
   */
  async add(pid, projectName) {
    try {
      let res = await fetch(`${this._sdk.config.capture.endpoint}/projects`, {
        body: JSON.stringify({
          projectId: pid,
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
}

module.exports = ProjectsCollection;
