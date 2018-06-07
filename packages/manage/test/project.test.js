'use strict';
const chai = require('chai');
const assert = chai.assert;
const generate = require('firebase-auto-ids');
const Project = require('../lib/Project');

var mockModel;
var generator;
var project;

describe('Project class', () => {
  // before(async () => {
  //   try {
  //     mockModel = new MockModel();
  //     generator = new generate.Generator();
  //   } catch (err) {
  //     console.error(err);
  //   }
  // });

  // it('should create a new project instance', () => {
  //   let data = {
  //     name: 'A test project name'
  //   };
  //   project = new Project(mockModel, generator.generate(Date.now() + '5'), data);

  //   console.log(project);
  //   //console.log(project);
  // });

  // it('should update the details of an existing project instance', async () => {
  //   project.name = 'New project name';
  //   let result = await project.update();
  //   //console.log(result);
  // });
});
