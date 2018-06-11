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
const querystring = require('querystring');
const LeadsCollection = require('./leads-collection');
const fetch = require('node-fetch');

class Project {
  /**
   * @typedef {object} ProjectInfo
   * @property {string} ProjectInfo.projectId
   * @property {string} ProjectInfo.name
   * @param {Manage} sdk
   * @param {string} aid
   * @param {ProjectInfo} projectInfo
   */
  constructor(sdk, aid, projectInfo) {
    Object.assign(this, {
      _sdk: sdk,
      aid,
      pid: projectInfo.projectId,
      name: projectInfo.name,
      publicApiKey: projectInfo.publicApiKey,
      leadsCount: projectInfo.leadsCount,
      created: new Date(projectInfo.created),
      lastModified: new Date(projectInfo.lastModified)
    });
  }

  /**
   * @returns {LeadsCollection}
   */
  leads() {
    return new LeadsCollection(this._sdk, this.pid);
  }

  /**
   * Deletes the project
   * @returns {Promise.<undefined>}
   * @throws exception if the project contains leads
   */
  async delete() {
    try {
      let res = await fetch(`${this._sdk.config.fetch.endpoint}/projects/${this.pid}`, {
        method: 'DELETE',
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
    } catch (err) {
      let e = new Error(err.response.data.message)
      e.code = err.response.data.status;
      throw e;
    }
  }
}

module.exports = Project;
