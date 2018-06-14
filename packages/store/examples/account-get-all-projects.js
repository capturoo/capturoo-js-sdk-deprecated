(async () => {
  const config = require('../config');
  const DashboardSDK = require('../lib/DashboardSDK');
  const sdk = new DashboardSDK(config);

  try {
    let account = await sdk.getAccount('HNNRTYd1H9eVNmGRLUbOtTHlEkc2');
    let projects = await account.getAllProjects();
    console.log(projects);
  } catch (err) {
    console.error(err);
  }
})();
