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
const ProjectsQuery = require('./projects-query');
const ProjectDocumentReference = require('./project-document-reference');
const fetch = require('node-fetch');

class ProjectsCollectionReference {
  constructor(store, parent) {
    Object.assign(this, {
      store,
      parent
    });
  }

  doc(pid) {
    return new ProjectDocumentReference(this.store, pid, this);
  }

  /**
   * @returns {Promise<Project[]>}
   */
  async get() {
    try {
      let query = new ProjectsQuery(this.store, this);
      return await query.get();
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
   * @returns {Promise.<ProjectDocumentReference>}
   * @see
   * https://firebase.google.com/docs/reference/js/firebase.firestore.Timestamp
   */
  async add(projectData) {
    try {
      const docRef = this.doc(projectData.pid);
      await docRef.set(projectData);
      return docRef;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = ProjectsCollectionReference;
