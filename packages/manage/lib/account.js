const firebase = require('@firebase/app');
const Project = require('./project');
const fetch = require('node-fetch');

class Account {
  /**
   * @typedef {object} AccountInfo
   * @property {string} AccountInfo.accountId
   * @property {string} AccountInfo.email
   * @property {string} AccountInfo.privateApiKey
   * @property {Date} AccountInfo.created
   * @property {Date} AccountInfo.lastModified
   * @param {DashboardSDK} sdk
   * @param {AccountInfo} accountInfo
   */
  constructor(sdk, accountInfo) {
    Object.assign(this, {
      _sdk: sdk,
      accountId: accountInfo.accountId,
      email: accountInfo.email,
      privateApiKey: accountInfo.privateApiKey,
      created: new Date(accountInfo.created),
      lastModified: new Date(accountInfo.lastModified)
    });
  }

  /**
   * CreateProject: Create a new project
   * @param {String} projectId globally unique project ID
   * @param {String} projectName project name
   * @throws rethrows any underlying firebase.store exceptions
   * @returns {Promise.<Project>}
   * @see https://firebase.google.com/docs/reference/js/firebase.firestore.Timestamp
   */
  async createProject(projectId, projectName) {
    try {
      let res = await fetch(`${this._sdk.config.fetch.endpoint}/projects`, {
        body: JSON.stringify({
          projectId,
          projectName
        }),
        method: 'POST',
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

      return new Project(this._sdk, await res.json());
     } catch (err) {
      throw err;
    }
  }

  /**
   * GetProject: Get a project by project ID
   * @param {String} projectId the Project's unique identifier
   * @returns {Promise.<Project|null>}
   */
  async project(projectId) {
    try {
      let res = await fetch(`${this._sdk.config.fetch.endpoint}/projects/${projectId}`, {
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

      let project = await res.json();
      return project;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Fetch all projects associated to this account
   * @returns {Promise.<Project[]>} of Project objects
   * @throws rethrows firebase.firestore exceptions
   */
  async projects() {
    try {
      let res = await fetch(`${this._sdk.config.fetch.endpoint}/projects`, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': this._sdk.idTokenResult.token
        },
        mode: 'cors'
      });

      let projectsJson = await res.json();
      let projects = [];
      for (const item of projectsJson) {
        projects.push(new Project(this._sdk, item));
      };
      return projects;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Account;
