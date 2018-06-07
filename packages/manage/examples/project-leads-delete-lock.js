(async () => {
  const config = require('../config');
  const DashboardSDK = require('../lib/DashboardSDK');
  const sdk = new DashboardSDK(config);

  try {
    let account = await sdk.getAccount('HvphkDr3iHf10yHq8vkdZI1Kqge2');
    let project = await account.createProject('test-project-12347', 'Test project');
    await project.leadsDeleteLock();
    console.log(project);
  } catch (err) {
    console.error(err);
  }
})();
