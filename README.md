# Ethereum Smart Contract for the WAXP ERC20 tokens

An `ERC20` standard token with burn capability. Built on the [OpenZeppelin](https://openzeppelin.org/) framework.

Specifically, this contract is upgradeable, relying on the upgradeable official fork of openzeppelin. See: https://github.com/OpenZeppelin/openzeppelin-contracts-ethereum-package#using-via-the-openzeppelin-cli

Only contract owner can burn token.

### Deployments

Production token address: 

Rinkeby token address: *0x0de41b96376f7AaFf671BE23c7881c695a0d161D

### Setup

Be sure to have node >= 10.x

```
$ node --version
v10.16.3
```

Install dev dependencies:

```
$ npm install
```

### Test

```
$ npm run test
```

### Test coverage

```
$ npm run coverage

----------------|----------|----------|----------|----------|----------------|
File            |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
----------------|----------|----------|----------|----------|----------------|
 contracts/     |      100 |       50 |      100 |      100 |                |
  WAXPERC20.sol |      100 |       50 |      100 |      100 |                |
----------------|----------|----------|----------|----------|----------------|
All files       |      100 |       50 |      100 |      100 |                |
----------------|----------|----------|----------|----------|----------------|
```

### Upgrade

You will have to transfer ownership back to a 12-word mnemonic (`npx mnemonics`) controlled address rather than a ledger device as the support for it with deployments is poor. Use the `PROJECT_ID=<infura web3 provider project id> MNEMONIC="<12 word mnemonic> npm run change-owner` command to do so and change fields appropriately in the scripts/owner file to hit the correct new ownership addresses. Realize the proxyAdmin accounts within the owner.js file are correct for rinkeby and mainnent. Once the proxyAdmin wonership is trnasferred to a mnemonic controlled address, use it to upgrade the contract via `PROJECT_ID=<infura web3 provider project id> MNEMONIC="<12 word mnemonic> npm run upgrade`. After the upgrade is complete, return control back to the ledger using the change onwner command. You will have to edit the scripts/owner.js appropriately to do so.

### Deploy and Info About Upgradeable Contracts

See:
* https://docs.openzeppelin.com/learn/connecting-to-public-test-networks
* https://docs.openzeppelin.com/learn/preparing-for-mainnet


Note: see this GH thread to better understand the ownership vs admin roles in the upgradable contracts pattern https://github.com/OpenZeppelin/openzeppelin-sdk/issues/968#issuecomment-501899483

#### Upgrades contracts summary
* The ProxyAdmin is a contract which is by default the admin (i.e., the one that can upgrade Proxy instances or change a Proxy instance admin) of your created instances.
* The Proxy is a contract that delegates calls to a logic contract, probably the one you developed. The proxy address is the one you provide to your users.
* The Owner in this context it is the account you have used to create a proxy (i.e., the one specified with the --from flag or a default account), who is the owner of the ProxyAdmin (using openzeppelin-solidity Ownable contract), but not the admin of the Proxy (because, as said before, the default admin of the Proxy will be the ProxyAdmin.
* This mean that when you use the zos set-admin command, you will be changing the admin of a Proxy, from the ProxyAdmin to any other account you provide. This is really dangerous and you should basically never do this. No idea why this is a useful command. Whereas changing the owner of the proxyadmin contract is useful because that user controls upgrades so you would want to secure that with an offline account

### Truffle deploy and upgrade

#### Migrate from OpenZeppelin CLI to truffle

Reference: https://docs.openzeppelin.com/upgrades-plugins/1.x/migrate-from-cli

#### Deploy new upgradeable contract

- create deployment script `migrations/1_deploy.js`

```javascript
const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const WAXPERC20UpgradeSafe = artifacts.require('WAXPERC20UpgradeSafe');

module.exports = async function (deployer) {
  const instance = await deployProxy(WAXPERC20UpgradeSafe, [process.env.ESCROW_ADDRESS], { deployer });
  console.log('Deployed', instance.address);
};
```

- run truffle migration:

```bash
MNEMONIC="YOUR MNEMONIC" PROJECT_ID="YOUR PROJECT ID" npx truffle migrate --network rinkeby
```

#### Upgrade contract

- create upgrade script `migrations/2_upgrade.js`

```javascript
const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');
const OZ_SDK_EXPORT = require("../openzeppelin-cli-export.json");

const WAXPERC20UpgradeSafe = artifacts.require('WAXPERC20UpgradeSafe');

module.exports = async function (deployer) {
  const [ WAXPERC20 ] = OZ_SDK_EXPORT.networks[deployer.network].proxies["waxp-erc20/WAXPERC20UpgradeSafe"];
  const instance = await upgradeProxy(WAXPERC20.address, WAXPERC20UpgradeSafe, { deployer });
  console.log("Upgraded", instance.address);
};
```

- run truffle migration:

```bash
MNEMONIC="YOUR MNEMONIC" PROJECT_ID="YOUR PROJECT ID" npx truffle migrate --network rinkeby
```

#### Interact with contract

```bash
MNEMONIC="YOUR MNEMONIC" PROJECT_ID="YOUR PROJECT ID" npx truffle console --network rinkeby
truffle(rinkeby)> let instance = await WAXPERC20UpgradeSafe.deployed()
truffle(rinkeby)> (await instance.totalSupply()).toString()
'386482894311326596'
truffle(rinkeby)> await instance.transfer("0x26e7ef2d05793c6d47c678f1f4b246856236f089", "400000000");
truffle(rinkeby)> (await instance.balanceOf("0x26e7ef2d05793c6d47c678f1f4b246856236f089")).toString()
'400000000'
```