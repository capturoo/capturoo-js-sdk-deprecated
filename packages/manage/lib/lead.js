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

class Lead {
  /**
   * @typedef {object} LeadData
   * @property {string} LeadData.projectId
   * @property {string} LeadData.name
   * @param {Manage} sdk
   * @param {string} pid project ID
   * @param {LeadData} data
   */
  constructor(sdk, pid, data) {
    Object.assign(this, {
      _sdk: sdk,
      pid,
      lead: data
    });

    if (data && data.system && data.system.leadId) {
      this.lid = data.system.leadId;
    }
  }

  /**
   * Retrieves all fields in the lead as an Object
   */
  data() {
    return this.lead;
  }

  /**
   * DeleteLead: Delete this lead
   * @returns {Promise.<undefined>}
   */
  async delete() {
    try {
      let res = await fetch(`${this._sdk.config.capture.endpoint}/projects/${this.pid}/leads/${this.lid}`, {
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
      console.error(err);
      let e = new Error(err.response.data.message)
      e.code = err.response.data.status;
      throw e;
    }
  }
}

module.exports = Lead;
