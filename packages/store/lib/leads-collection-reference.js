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
const LeadsQuery = require('./leads-query');
const LeadDocumentReference = require('./lead-document-reference');
const QuerySnapshot = require('./query-snapshot');
const LeadQueryDocumentSnapshot = require('./lead-query-document-snapshot');
const fetch = require('node-fetch');

class LeadsCollectionReference {
  constructor(store, parent) {
    Object.assign(this, {
      store,
      parent
    });
  }

  /**
   *
   */
  doc(lid) {
    return new LeadDocumentReference(this.store, lid, this);
  }

  /**
   * CreateLead: Creates a new lead
   * Adds a new document to this collection with the specified data,
   * assigning it a document ID automatically.
   * @param {object} email
   * @returns {Promise.<Lead>}
   * @throws {Error}
   */
  async add(data) {
    let headers = {
      'Content-Type': 'application/json'
    };
    Object.assign(headers, this.store.getAuthHeader());

    try {
      let res = await fetch(`${this.store.config.capture.endpoint}/leads`, {
        body: JSON.stringify({
          system: {},
          tracking: {},
          lead: data
        }),
        method: 'POST',
        headers,
        mode: 'cors'
      });

      if (res.status >= 400) {
        let data = await res.json();
        let e = Error(data.message)
        e.code = data.status;
        throw e;
      }

      return new LeadDocumentReference(this.store, this.pid, await res.json());
    } catch (err) {
      let e = new Error(err.response.data.message)
      e.code = err.response.data.status;
      throw e;
    }
  }

  orderBy(orderBy, orderDirection) {
    return new LeadsQuery(
      this.store,
      this,
      orderBy,
      orderDirection,
      undefined,
      undefined
    );
  }

  /**
   * Get all leads
   * @returns {Promise.<capturoo.store.QuerySnapshot]>}
   */
  async get() {
    try {
      let query = new LeadsQuery(
        this.store,
        this,
        undefined,
        undefined,
        undefined,
        undefined
      );
      return await query.get();
    } catch (err) {
      throw err;
    }
  }
}

module.exports = LeadsCollectionReference;
