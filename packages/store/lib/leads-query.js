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
const Query = require('./query');
const QuerySnapshot = require('./query-snapshot');
const LeadQueryDocumentSnapshot = require('./lead-query-document-snapshot');
const LeadDocumentReference = require('./lead-document-reference');
const fetch = require('node-fetch');

class LeadsQuery extends Query {
  constructor(store, parent, orderBy, orderDirection, startAfter, limit) {
    super(store, parent);
    Object.assign(this, {
      _orderBy: orderBy,
      _orderDirection: orderDirection,
      _startAfter: startAfter,
      _limit: limit
    });
  }

  limit(limit) {
    if (typeof limit !== 'number') {
      let e = TypeError('.limit(limit: number) method expects a positive integer value.');
      e.code = 'query/limit-type-error';
      throw e;
    }

    return new LeadsQuery(this.store, this.parent, this._orderBy, this._orderDirection,
      this._startAfter, limit);
  }

  orderBy(orderBy, orderDirection) {
    return new LeadsQuery(this.store, this.parent, orderBy, orderDirection,
      this._startAfter, this._limit);
  }

  startAfter(startAfter) {
    return new LeadsQuery(this.store, this.parent, this._orderBy, this._orderDirection,
      startAfter, this._limit);
  }

  async get() {
    let opts = {};
    if (this._limit) {
      opts.limit = this._limit;
    }

    if (this._startAfter) {
      opts.startAfter = this._startAfter;
    }

    if (this._orderBy) {
      opts.orderBy = this._orderBy;
    }

    if (this._orderDirection) {
      opts.orderDirection = this._orderDirection;
    }

    try {
      if (Object.keys(opts).length) {
        var q = '?' + querystring.stringify(opts);
      } else {
        var q = '';
      }

      let endpoint = `${this.store.config.capture.endpoint}`;
      let uri = `${endpoint}/projects/${this.parent.parent.pid}/leads${q}`;
      let headers = {
        'Content-Type': 'application/json'
      };
      Object.assign(headers, this.store.getAuthHeader());

      let res = await fetch(uri, {
        headers,
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
        let lid = data.system.lid;
        leads.push(new LeadQueryDocumentSnapshot(
          lid,
          new LeadDocumentReference(this.store, lid, this.parent),
          data
        ));
      };

      return new QuerySnapshot(leads, this);
    } catch (err) {
      let e = new Error(err.response.data.message)
      e.code = err.response.data.status;
      throw e;
    }
  }
}

module.exports = LeadsQuery;
