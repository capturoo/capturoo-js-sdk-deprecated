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
const fetch = require('node-fetch');

class Capture {
  constructor(captureConfig) {
    if (captureConfig.options && captureConfig.options.debug) {
      this.endpoint = 'https://api-staging.capturoo.com';
    } else {
      this.endpoint = captureConfig.endpoint
        || 'https://api.capturoo.com';
    }
    this.publicApiKey = captureConfig.publicApiKey;

    this.location = {}
    this.navigator = {};
    this.document = {};

    if (typeof window !== 'undefined' && window) {
      this.location.url = (window.location && window.location.url)
        ? window.location.url : '';
      this.location.host = (window.location && window.location.host)
        ? window.location.host : '';
      this.location.protocol = (window.location && window.location.protocol)
        ? window.location.protocol : '',
      this.navigator.userAgent = (window.navigator && window.navigator.userAgent)
        ? window.navigator.userAgent : '';
      this.location.port = (window.location && window.location.port)
        ? window.location.port : '';
    } else {
      this.userAgent = '';
    }

    if (typeof document !== 'undefined' && document) {
      this.document.referrer = document.referrer;
    }

    this.form = undefined;
    this.button = undefined;
    this.formPending = false;
  }

  static get version() { return '0.5.0'; }

  setPublicApiKey(publicApiKey) {
    this.publicApiKey = publicApiKey;
  }

  setForm(formId) {
    var self = this;
    this.form = window.document.querySelector('#' + formId);

    this.form.addEventListener('submit', function(e) {
      e.preventDefault();
      if (self.formPending) {
        return false;
      }
      self.formPending = true;

      var formData = new FormData(self.form);
      lead = {};
      formData.forEach(function (value, key) {
        lead[key] = value;
      });

      self.send({
        utmSource: 'test-source',
        utmMedium: 'test-medium',
        utmTerm: 'test-term',
        utmContent: 'test-content',
        utmCampaign: 'test-campaign'
      }, lead);

      return false;
    });
  }

  /**
   * CreateLead: creates a new lead with optional tracking data
   * @typedef {object} Lead
   * @property {object} Lead.system
   * @property {string} Lead.system.leadId
   * @param {object} lead
   * @param {object} tracking
   * @returns {Promise.<Lead>}
   */
  async createLead(lead, tracking = {}) {
    var self = this;

    var payload = {};
    Object.assign(payload, {
      system: {
        url: this.location.url,
        referrer: this.document.referrer,
        host: this.location.host,
        protocol: this.location.protocol,
        port: this.location.port,
        userAgent: this.navigator.userAgent
      },
      tracking,
      lead
    });

    try {
      let response = await fetch(`${this.endpoint}/leads`, {
        body: JSON.stringify(payload),
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'User-Agent': this.navigator.userAgent,
          'Content-Type': 'application/json',
          'X-API-Key': this.publicApiKey
        },
        method: 'POST',
        mode: 'cors'
      });

      self.formPending = false;
      return response.json();
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = Capture;
