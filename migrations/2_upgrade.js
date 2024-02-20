const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');
const { networkNames } = require('@openzeppelin/upgrades-core/dist/provider')

const WAXPERC20UpgradeSafe = artifacts.require('WAXPERC20UpgradeSafe');

module.exports = async function (deployer) {
  const chainId = deployer.network_id;
  const fileName = networkNames[chainId] ?? `unknown-${chainId}`;
  const contractInfo = require(`../.openzeppelin/${fileName}.json`);
  if (deployer.network == "test" || deployer.network == "development" || deployer.network == "soliditycoverage" ) return;
  const existing = await WAXPERC20UpgradeSafe.at(contractInfo.proxies[0].address);
  const instance = await upgradeProxy(existing.address, WAXPERC20UpgradeSafe, { deployer });
  console.log("Upgraded", instance.address);
};