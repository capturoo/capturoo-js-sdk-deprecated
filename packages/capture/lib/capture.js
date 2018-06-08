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
function Capture(options) {
  if (options.debug) {
    this.endpoint = 'https://api-staging.capturoo.com/leads';
  } else {
    this.endpoint = options.endpoint || 'https://api.capturoo.com/leads';
  }
  this.publicApiKey = options.publicApiKey;

  this.userAgent = window.navigator.userAgent || '';
  this.port = window.location.port;
  this.form = undefined;
  this.button = undefined;
  this.formPending = false;
}

Capture.prototype.version = '0.4.0';

Capture.prototype.setForm = function setForm(formId) {
  var self = this;
  this.form = document.querySelector('#' + formId);

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
};

Capture.prototype.send = function send(tracking, lead) {
  var self = this;

  var payload = {};
  Object.assign(payload, {
    system: {
      url: window.location.url,
      referrer: document.referrer,
      host: window.location.host,
      protocol: window.location.protocol,
      port: window.location.port,
      userAgent: this.userAgent
    },
    tracking,
    lead
  });

  fetch(this.endpoint, {
    body: JSON.stringify(payload),
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'User-Agent': this.userAgent,
      'Content-Type': 'application/json',
      'X-API-Key': this.publicApiKey
    },
    method: 'POST',
    mode: 'cors'
  })
    .then(function(response) {
      self.formPending = false;
      return response.json();
    })
    .then(function(myJson) {
      console.log(myJson);
    })
    .catch(function(err) {
      console.error(err);
    });
};

module.exports = Capture;
