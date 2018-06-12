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
const ProjectQueryDocumentSnapshot = require('./project-query-document-snapshot');
const ProjectDocumentReference = require('./project-document-reference');
const fetch = require('node-fetch');

class ProjectsCollectionReference {
  constructor(manage, parent) {
    Object.assign(this, {
      manage,
      parent
    });
  }

  doc(pid) {
    return new ProjectDocumentReference(this.manage, pid, this);
  }

  /**
   * @returns {Promise<Project[]>}
   */
  async get() {
    try {
      let res = await fetch(`${this.manage.config.capture.endpoint}/projects`, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': this.manage.idTokenResult.token
        },
        mode: 'cors'
      });

      let projects = [];
      for (const data of await res.json()) {
        let pid = data.projectId;
        projects.push(new ProjectQueryDocumentSnapshot(pid, this, data));
      };
      return new QuerySnapshot(projects);
    } catch (err) {
      throw err;
    }
  }

  /**
   * CreateProject: Create a new project
   * @param {String} pid project ID unqiue with this account
   * @param {String} projectName project name
   * @throws rethrows any underlying firebase.store exceptions
   * @returns {Promise.<Project>}
   * @see https://firebase.google.com/docs/reference/js/firebase.firestore.Timestamp
   */
  async add(pid, projectName) {
    try {
      let res = await fetch(`${this.manage.config.capture.endpoint}/projects`, {
        body: JSON.stringify({
          projectId: pid,
          projectName
        }),
        method: 'POST',
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

      return new ProjectDocumentReference(this.manage, pid, await res.json());
    } catch (err) {
      throw err;
    }
  }
}

module.exports = ProjectsCollectionReference;