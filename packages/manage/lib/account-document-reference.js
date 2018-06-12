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
const ProjectsCollectionReference = require('./projects-collection-reference');
const AccountDocumentSnapshot = require('./account-document-snapshot');
const fetch = require('node-fetch');

class AccountDocumentReference {
  /**
   * @param {capturoo.manage.Manage} manage
   */
  constructor(manage, aid, parent) {
    Object.assign(this, {
      manage,
      aid,
      parent
    });
  }

  /**
   * get() returns Promise containing non-null
   * capturoo.manage.AccountDocumentSnapshot
   * @returns {Promise.<AccountDocumentSnapshot>}
   */
  async get() {
    let headers = {
      'Content-Type': 'application/json'
    };
    Object.assign(headers, this.manage.getAuthHeader());
    try {
      let endpoint = `${this.manage.config.capture.endpoint}`;
      let res = await fetch(`${endpoint}/account`, {
        headers,
        mode: 'cors'
      });

      if (res.status === 404) {
        return new AccountDocumentSnapshot(this.aid, this, false, undefined);
      }

      if (res.status >= 400) {
        let data = await res.json();
        let e = Error(data.message)
        e.code = data.status;
        throw e;
      }
      return new AccountDocumentSnapshot(this.aid, this, true, await res.json());
    } catch (err) {
      throw err;
    }
  }

  /**
   * Gets a ProjectsCollectionReference instance that refers to the projects
   * collection.
   * @returns {capturoo.manage.ProjectsCollectionReference} collection of
   *   projects.
   */
  projects() {
    return new ProjectsCollectionReference(this.manage, this);
  }
}

module.exports = AccountDocumentReference;
