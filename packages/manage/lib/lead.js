const firebase = require('@firebase/app').default;
const fetch = require('node-fetch');

class Lead {
  /**
   * @typedef {object} LeadData
   * @property {string} LeadData.projectId
   * @property {string} LeadData.name
   * @param {DashboardSDK} sdk
   * @param {LeadData} data
   */
  constructor(sdk, data) {
    Object.assign(this, {
      _sdk: sdk,
      data
    });
  }

  /**
   * DeleteLead: Delete this lead
   * @returns {Promise.<undefined>}
   */
  async delete() {
    try {
      let res = await fetch(`${this._sdk.config.capture.endpoint}/projects/${this.projectId}/leads/${this.leadId}`, {
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
    } catch (err) {
      let e = new Error(err.response.data.message)
      e.code = err.response.data.status;
      throw e;
    }
  }
}

module.exports = Lead;
