(async () => {
  const config = require('../config');
  const DashboardSDK = require('../lib/DashboardSDK');
  const sdk = new DashboardSDK(config);

  try {
    let account = await sdk.getAccount('HNNRTYd1H9eVNmGRLUbOtTHlEkc2');
    let project = await account.getProject('test-project-12345');
    console.log(project);
  } catch (err) {
    console.error(err);
  }
})();
