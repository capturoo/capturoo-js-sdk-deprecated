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
const LeadDocumentSnapshot = require('./lead-document-snapshot');
const fetch = require('node-fetch');

class LeadDocumentReference {
  constructor(manage, lid, parent) {
    Object.assign(this, {
      manage,
      lid,
      parent
    });
  }

  /**
   * GetLead: Get a lead by ID
   * get() returns Promise containing non-null
   * capturoo.manage.LeadDocumentSnapshot
   * Reads the document referred to by this LeadDocumentReference.
   * @returns {Promise<LeadDocumentSnapshot>}
   */
  async get() {
    let headers = {
      'Content-Type': 'application/json'
    };
    Object.assign(headers, this.manage.getAuthHeader());

    try {
      let endpoint = `${this.manage.config.capture.endpoint}`;
      let uri = `${endpoint}/projects/${this.parent.parent.pid}/leads/${this.lid}`;
      let res = await fetch(uri, {
        headers,
        mode: 'cors'
      });

      if (res.status === 404) {
        console.log(res.status);
        return new LeadDocumentSnapshot(this.lid, this, false, undefined);
      }

      if (res.status >= 400) {
        let data = await res.json();
        let e = Error(data.message)
        e.code = data.status;
        throw e;
      }

      let data = await res.json();
      return new LeadDocumentSnapshot(this.lid, this, true, data);
    } catch (err) {
      let e = new Error(err.response.data.message)
      e.code = err.response.data.status;
      throw e;
    }
  }

  /**
   * DeleteLead: Delete this lead
   * @returns {Promise.<undefined>}
   */
  async delete() {
    let headers = {
      'Content-Type': 'application/json'
    };
    Object.assign(headers, this.manage.getAuthHeader());

    try {
      let endpoint = `${this.manage.config.capture.endpoint}`;
      let uri = `${endpoint}/projects/${this.parent.pid}/leads/${this.lid}`;
      let res = await fetch(uri, {
        method: 'DELETE',
        headers,
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

module.exports = LeadDocumentReference;
