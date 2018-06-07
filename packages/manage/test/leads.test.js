'use strict';
const chai = require('chai');
const assert = chai.assert;
const DashboardSDK = require('../lib/DashboardSDK');
const config = require('../config');
const Project = require('../lib/Project');
const Lead = require('../lib/Lead');
const FIRESTORE_TIMEOUT_MS = 8000;

const leadsToBuild = [
  { email: 'andy@example.com', firstname: 'Andy', lastname: 'Andrews' },
  { email: 'bob@example.com', firstname: 'Bob', lastname: 'Bothersome' },
  { email: 'carl@example.com', firstname: 'Carl', lastname: 'Carrots' },
  { email: 'derek@example.com', firstname: 'Derek', lastname: 'Derby' },
  { email: 'earl@example.com', firstname: 'Earl', lastname: 'Ericson' },
  { email: 'freddy@example.com', firstname: 'Freddy', lastname: 'Frog' },
  { email: 'george@example.com', firstname: 'George', lastname: 'Georgia' },
  { email: 'harry@example.com', firstname: 'Harry', lastname: 'Happy' },
  { email: 'irk@example.com', firstname: 'Irk', lastname: 'Irkison' },
  { email: 'john@example.com', firstname: 'John', lastname: 'Johnson' }
];

const TEST_ACCOUNT_EMAIL = 'acme@foo.bar';

let sdk;
let account;
let project;
var leads = [];

describe('Leads', async () => {
  before(async () => {
    try {
      sdk = new DashboardSDK(config);
    } catch (err) {
      console.error(err);
    }
  });

  it('should create a new Acme Widget Inc account', async function() {
    this.timeout(FIRESTORE_TIMEOUT_MS);
    try {
      user = await sdk.signUpUser(TEST_ACCOUNT_EMAIL, 'testtest', 'Acme Widgets Inc');
      assert.hasAllKeys(user, [
        'uid',
        'email',
        'displayName',
        'created'
      ]);
      assert.strictEqual(user.uid, 'acme-uid');
      assert.strictEqual(user.displayName, 'Acme Widgets Inc');
    } catch (err) {
      throw err;
    }
  });

  it('should log in as user A', async function() {
    this.timeout(TIMEOUT_MS);
    try {
      let userCredential = await sdk.signInWithEmailAndPassword(TEST_ACCOUNT_EMAIL, 'testtest');
      user = userCredential.user;
      assert.isObject(user, 'user should be an object type');
      assert.strictEqual(user.emailVerified, false);
    } catch (err) {
      throw err;
    }
  });

  it('should wait for GCF to generate new account', function(done) {
    this.timeout(SUPER_LONG_TIMEOUT_MS);
    function keepChecking() {
      setTimeout(function() {
        sdk.getAccount(user.uid)
          .then(a => {
            if (a) {
              account = a;
              return done();
            }
            keepChecking();
          })
          .catch(err => {
            console.error(err);
          })
      }, 5000);
    }

    keepChecking();
  });

  // it('should create a new project for account Acme Widgets Inc', async function() {
  //   this.timeout(FIRESTORE_TIMEOUT_MS);
  //   try {
  //     project = await account.createProject('big-promo-project', 'Big Promo Project');

  //     assert.exists(project, 'project is neither `null` nor `undefined`');
  //     assert.instanceOf(project, Project, 'project is an instance of Project');
  //   } catch (err) {
  //     throw err;
  //   }
  // });

  // it('should create a series of new leads', function(done) {
  //   this.timeout(FIRESTORE_TIMEOUT_MS);

  //   let promises = [];
  //   leadsToBuild.map(async function(lead) {
  //     promises.push(project.createLead(lead.email, lead.firstname, lead.lastname));
  //   });

  //   Promise.all(promises)
  //     .then(function(values) {
  //       values.map(function(lead) {
  //         leads[lead.email] = lead;
  //         assert.exists(leads[lead.email], 'project is neither `null` nor `undefined`');
  //         assert.instanceOf(leads[lead.email], Lead, 'lead is an instance of Lead');
  //         assert.hasAllKeys(leads[lead.email], [
  //           'db',
  //           'leadId',
  //           'projectId',
  //           'email',
  //           'firstname',
  //           'lastname',
  //           'created'
  //         ]);
  //       });
  //       done();
  //     })
  //     .catch(err => {
  //       done(err);
  //     });
  // });

  // it('should fetch a specific lead', async function() {
  //   this.timeout(FIRESTORE_TIMEOUT_MS);
  //   try {
  //     let l = await project.getLead(leads['andy@example.com'].leadId);

  //     assert.hasAllKeys(l, [
  //       'db',
  //       'leadId',
  //       'projectId',
  //       'email',
  //       'firstname',
  //       'lastname',
  //       'created'
  //     ]);
  //   } catch (err) {
  //     throw err;
  //   }
  // });

  // it('should fetch all leads for given project', async function() {
  //   this.timeout(FIRESTORE_TIMEOUT_MS);
  //   try {
  //     let fetchedLeads = await project.getAllLeads();

  //     fetchedLeads.map(function(lead) {
  //       let createdLead = leads[lead.email];

  //       assert.strictEqual(lead.email, createdLead.email);
  //       assert.strictEqual(lead.firstname, createdLead.firstname);
  //       assert.strictEqual(lead.lastname, createdLead.lastname);
  //     });
  //   } catch (err) {
  //     throw err;
  //   }
  // });

  // it('should delete each of the leads in the set in turn', function(done) {
  //   this.timeout(FIRESTORE_TIMEOUT_MS);

  //   let promises = [];
  //   Object.values(leads).map(function(lead) {
  //     lead.delete();
  //   });
  //   Promise.all(promises)
  //     .then(values => {
  //       done();
  //     })
  //     .catch(err => {
  //       done(err);
  //     })
  // });
});
