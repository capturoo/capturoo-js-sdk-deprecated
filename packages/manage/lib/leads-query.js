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
const QuerySnapshot = require('./query-snapshot');
const LeadQueryDocumentSnapshot = require('./lead-query-document-snapshot');
const fetch = require('node-fetch');

class LeadsQuery {
  constructor(manage, orderBy, orderDirection, startAfter, limit) {
    Object.assign(this, {
      manage,
      _orderBy: orderBy,
      _orderDirection: orderDirection,
      _startAfter: startAfter,
      _limit: limit
    });
  }

  limit(limit) {
    return new LeadsQuery(this.manage, this._orderBy, this._orderDirection,
      this._startAfter, limit);
  }

  orderBy(orderBy, orderDirection) {
    return new LeadsQuery(this.manage, orderBy, orderDirection,
      this._startAfter, this._limit);
  }

  startAfter(startAfter) {
    return new LeadsQuery(this.manage, this._orderBy, this._orderDirection,
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
      opt.orderBy = this._orderBy;
    }

    if (this._orderDirection) {
      opt.orderDirection = this._orderDirection;
    }

    try {
      if (opts.length) {
        var q = '?' + querystring.stringify(opts);
      } else {
        var q = '';
      }

      let endpoint = `${this.manage.config.capturo.endpoint}`;
      let res = await fetch(`${endpoint}/projects/${this.pid}/leads${q}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': this.manage.idTokenResult.token
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
        let lid = data.system.leadId;
        leads.push(new LeadQueryDocumentSnapshot(lid, this, data));
      }
      return new QuerySnapshot(leads);
    } catch (err) {
      let e = new Error(err.response.data.message)
      e.code = err.response.data.status;
      throw e;
    }
  }
}

module.exports = LeadsQuery;
