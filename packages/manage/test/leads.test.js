'use strict';
const capturoo = require('@capturoo/app');
require('@capturoo/auth');
require('@capturoo/capture');
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

const TEST_ACCOUNT_EMAIL = 'acme+143@foo.bar';

let user;
let account;
let project;
var leads = [];

describe('Leads', async () => {
  before(async () => {
    try {
      capturoo.initApp(config);
    } catch (err) {
      console.error(err);
    }
  });

  it('should create a new Acme Widget Inc account', async function() {
    this.timeout(TIMEOUT_MS);
    try {
      user = await capturoo.auth()
        .signUpUser(TEST_ACCOUNT_EMAIL, 'testtest', 'Acme Widgets Inc');
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
      let userCredential = await capturoo.auth()
        .signInWithEmailAndPassword(TEST_ACCOUNT_EMAIL, 'testtest');
      user = userCredential.user;
      capturoo.manage().setToken(await capturoo.auth().getToken());
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
        capturoo.manage().account(user.uid)
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

  it('should create a series of new leads', function(done) {
    this.timeout(TIMEOUT_MS);

    let base64encoded = Buffer.from(
      `${account.aid}:${project.publicApiKey}`).toString('base64');
    capturoo.capture().setPublicApiKey(base64encoded);

    let promises = [];
    for (const lead of leadsToBuild) {
      let l = capturoo.capture().createLead(lead, {});
      promises.push(l);
    }

    Promise.all(promises)
      .then(function(values) {
        values.map(function(item) {
          leads[item.lead.email] = item;
          assert.exists(leads[item.lead.email], 'project is neither `null` nor `undefined`');

          assert.hasAllDeepKeys(leads[item.lead.email], {
            system: {
              leadNum: true,
              ip: true,
              created: true,
              leadId: true
            },
            lead: {
              email: true,
              lastname: true,
              firstname: true
            },
            tracking: {}
          });
        });
        done();
      })
      .catch(err => {
        console.error(err);
        done(err);
      });
  });

  it('should fetch a specific lead', async function() {
    this.timeout(TIMEOUT_MS);
    try {
      let lid = leads['andy@example.com'].system.leadId;
      let item = await project.lead(lid);

      assert.strictEqual(
        item.data().lead.email,
        leads['andy@example.com'].lead.email
      );
      assert.strictEqual(
        item.data().lead.firstname,
        leads['andy@example.com'].lead.firstname
      );
      assert.strictEqual(
        item.data().lead.lastname,
        leads['andy@example.com'].lead.lastname
      );
    } catch (err) {
      throw err;
    }
  });

  it('should fetch all leads for given project', async function() {
    this.timeout(TIMEOUT_MS);
    try {
      let resultLeads = await project.queryLeads();

      resultLeads.map(function(item) {
        let data = item.data();
        let email = data.lead.email;

        assert.strictEqual(
          data.lead.email,
          leads[email].lead.email
        );
        assert.strictEqual(
          data.lead.firstname,
          leads[email].lead.firstname
        );
        assert.strictEqual(
          data.lead.lastname,
          leads[email].lead.lastname
        );
      });
    } catch (err) {
      throw err;
    }
  });

  it('should delete each of the leads in the set in turn', async function() {
    this.timeout(TIMEOUT_MS);
    try {
      let resultLeads = await project.queryLeads();
      for (const lead of resultLeads) {
        await lead.delete();
      }
    } catch (err) {
      throw err;
    }
  });

  it('should delete user', async function() {
    this.timeout(TIMEOUT_MS);
    try {
      await user.delete();
    } catch (err) {
      throw err;
    }
  });
});
