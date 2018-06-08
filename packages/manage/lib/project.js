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
const Lead = require('./lead');
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
   * CreateLead: Creates a new lead
   * @param {object} email
   * @returns {Promise.<Lead>}
   * @throws {Error}
   */
  async createLead(data) {
    try {
      let res = await fetch(`${this._sdk.config.capture.endpoint}/leads`, {
        body: JSON.stringify({
          system: {},
          tracking: {},
          lead: data
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

      return new Lead(this._sdk, this.pid, await res.json());
    } catch (err) {
      let e = new Error(err.response.data.message)
      e.code = err.response.data.status;
      throw e;
    }
  }

  /**
   * GetLead: Get a lead by ID
   * @param {String} lid globally unique lead id
   * @returns {Promise.<Lead>} undefined indicates the lead cannot be found
   */
  async lead(lid) {
    try {
      let res = await fetch(`${this._sdk.config.capture.endpoint}/projects/${this.pid}/leads/${lid}`, {
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

      let data = await res.json();
      return new Lead(this._sdk, this.pid, data);
    } catch (err) {
      let e = new Error(err.response.data.message)
      e.code = err.response.data.status;
      throw e;
    }
  }

  /**
   * Query leads
   * User type definition
   * @param {boolean} [options.force] force deletion if project contains leads
   * @param {number} [options.limit]
   * @param {string} [options.startAfter]
   * @param {string} [options.orderBy]
   * @param {string} [options.orderDirection]
   * @returns {Promise.<Lead[]>}
   */
  async queryLeads(options = {}) {
    let opts = {};
    if ('limit' in options) {
      opts.limit = options.limit;
    }

    if ('startAfter' in options) {
      opts.startAfter = options.startAfter;
    }

    if ('orderBy' in options) {
      opt.orderBy = options.orderBy;
    }

    if ('orderDirection' in options) {
      opt.orderDirection = options.orderDirection;
    }

    try {
      let res = await fetch(`${this._sdk.config.capture.endpoint}/projects/${this.pid}/leads${querystring.stringify(opts)}`, {
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

      let leads = [];
      for (const data of await res.json()) {
        leads.push(new Lead(this._sdk, this.pid, data));
      }
      return leads;
    } catch (err) {
      let e = new Error(err.response.data.message)
      e.code = err.response.data.status;
      throw e;
    }
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
