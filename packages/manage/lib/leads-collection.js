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
const Lead = require('./lead');
const fetch = require('node-fetch');

class LeadsCollection {
  constructor(sdk, pid) {
    Object.assign(this, {
      _sdk: sdk,
      pid
    });
  }

  /**
   * GetLead: Get a lead by ID
   * @param {String} lid globally unique lead id
   * @returns {Promise<Lead[]>}
   */
  async doc(lid) {
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
   * CreateLead: Creates a new lead
   * @param {object} email
   * @returns {Promise.<Lead>}
   * @throws {Error}
   */
  async add(data) {
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

  orderBy(orderBy, orderDirection) {
    return new LeadsQuery(orderBy, orderDirection, undefined, undefined);
  }

  /**
   * Get all leads
   * @returns {Promise.<Lead[]>}
   */
  async get() {
    try {
      let res = await fetch(`${this._sdk.config.capture.endpoint}/projects/${this.pid}/leads`, {
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
}

module.exports = LeadsCollection;
