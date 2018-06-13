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
    let headers = {
      'Content-Type': 'application/json'
    };
    Object.assign(headers, this.manage.getAuthHeader());

    try {
      let res = await fetch(`${this.manage.config.capture.endpoint}/projects`, {
        headers,
        mode: 'cors'
      });

      let projects = [];
      for (const data of await res.json()) {
        let pid = data.pid;
        projects.push(new ProjectQueryDocumentSnapshot(pid, this, data));
      };
      return new QuerySnapshot(projects);
    } catch (err) {
      throw err;
    }
  }

  /**
   * CreateProject: Create a new project
   * @typedef {object} NewProjectData
   * @property {string} NewProjectData.pid project ID
   * @property {string} NewProjectData.projectName title of the project
   * @param {NewProjectData} projectData project data of new project
   * @throws rethrows any underlying firebase.store exceptions
   * @returns {Promise.<Project>}
   * @see https://firebase.google.com/docs/reference/js/firebase.firestore.Timestamp
   */
  async add(projectData) {
    let headers = {
      'Content-Type': 'application/json'
    };
    Object.assign(headers, this.manage.getAuthHeader());

    try {
      let res = await fetch(`${this.manage.config.capture.endpoint}/projects`, {
        body: JSON.stringify({
          pid: projectData.pid,
          projectName: projectData.projectName
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

      return new ProjectDocumentReference(this.manage, projectData.pid, await res.json());
    } catch (err) {
      throw err;
    }
  }
}

module.exports = ProjectsCollectionReference;
