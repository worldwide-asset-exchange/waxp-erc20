const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const WAXPERC20UpgradeSafe = artifacts.require('WAXPERC20UpgradeSafe');

module.exports = async function (deployer) {
  const contractInfo = require(`../.openzeppelin/${deployer.network}.json`);
  if (deployer.network == "test" || deployer.network == "development" || deployer.network == "soliditycoverage" ) return;
  const existing = await WAXPERC20UpgradeSafe.at(contractInfo.proxies[0].address);
  const instance = await upgradeProxy(existing.address, WAXPERC20UpgradeSafe, { deployer });
  console.log("Upgraded", instance.address);
};