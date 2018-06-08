'use strict';
const capturoo = require('@capturoo/app');
require('@capturoo/auth');
require('@capturoo/manage');

const chai = require('chai');
const assert = chai.assert;
const config = require('../config');
const Project = require('@capturoo/manage').Project;
const Lead = require('@capturoo/manage').Lead;
const TIMEOUT_MS = 1000 * 10;
const SUPER_LONG_TIMEOUT_MS = 1000 * 30;

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

const TEST_ACCOUNT_EMAIL = 'acme+5@foo.bar';

let auth;
let manage;
let user;
let account;
let project;
var leads = [];

describe('Leads', async () => {
  before(async () => {
    try {
      capturoo.initApp(config);
      auth = capturoo.auth(config);
      manage = capturoo.manage(config);
    } catch (err) {
      console.error(err);
    }
  });

  it('should create a new Acme Widget Inc account', async function() {
    this.timeout(TIMEOUT_MS);
    try {
      user = await auth.signUpUser(TEST_ACCOUNT_EMAIL, 'testtest', 'Acme Widgets Inc');
      assert.hasAllKeys(user, [
        'uid',
        'email',
        'displayName',
        'created'
      ]);
      assert.strictEqual(user.displayName, 'Acme Widgets Inc');
    } catch (err) {
      throw err;
    }
  });

  it('should log in as user A', async function() {
    this.timeout(TIMEOUT_MS);
    try {
      let userCredential = await auth.signInWithEmailAndPassword(TEST_ACCOUNT_EMAIL, 'testtest');
      user = userCredential.user;
      manage.setToken(await auth.getToken());
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
        manage.account(user.uid)
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

  it('should create a new project for account Acme Widgets Inc', async function() {
    this.timeout(TIMEOUT_MS);
    try {
      project = await account.createProject('big-promo-project', 'Big Promo Project');

      assert.exists(project, 'project is neither `null` nor `undefined`');
      assert.instanceOf(project, Project, 'project is an instance of Project');
    } catch (err) {
      throw err;
    }
  });

  // it('should create a series of new leads', function(done) {
  //   this.timeout(TIMEOUT_MS);

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
  //   this.timeout(TIMEOUT_MS);
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
  //   this.timeout(TIMEOUT_MS);
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
  //   this.timeout(TIMEOUT_MS);

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
