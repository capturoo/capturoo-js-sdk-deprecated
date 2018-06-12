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
const ProjectDocumentSnapshot = require('./project-document-snapshot');
const LeadsCollectionReference = require('./leads-collection-reference');
const fetch = require('node-fetch');

class ProjectDocumentReference {
  /**
   * @param {capturoo.manage.Manage} manage
   */
  constructor(manage, pid, parent) {
    Object.assign(this, {
      manage,
      pid,
      parent
    });
  }

  /**
   * @returns {LeadsCollectionReference}
   */
  leads() {
    return new LeadsCollectionReference(this.manage, this);
  }

  /**
   * GetProject: Get a project by project ID
   * get() returns Promise containing non-null
   * capturoo.manage.ProjectDocumentSnapshot
   * Reads the document referred to by this ProjectDocumentReference.
   * @returns {Promise.<Project|null>}
   */
  async get() {
    let endpoint = `${this.manage.config.capture.endpoint}`;
    try {
      let res = await fetch(`${endpoint}/projects/${this.pid}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': this.manage.idTokenResult.token
        },
        mode: 'cors'
      });

      if (res.status === 404) {
        return new ProjectDocumentSnapshot(this.pid, this, false, undefined);
      }

      if (res.status >= 400) {
        let data = await res.json();
        let e = Error(data.message)
        e.code = data.status;
        throw e;
      }

      let project = await res.json();
      return new ProjectDocumentSnapshot(this.pid, this, true, project);
    } catch (err) {
      throw err;
    }
  }

  /**
   * Deletes the project
   * @returns {Promise.<undefined>}
   * @throws exception if the project contains leads
   */
  async delete() {
    try {
      let endpoint = `${this.manage.config.fetch.endpoint}`;
      let res = await fetch(`${endpoint}/projects/${this.pid}`, {
        method: 'DELETE',
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
    } catch (err) {
      let e = new Error(err.response.data.message)
      e.code = err.response.data.status;
      throw e;
    }
  }
}

module.exports = ProjectDocumentReference;
