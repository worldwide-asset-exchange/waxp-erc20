const regeneratorRuntime = require('regenerator-runtime');
const LedgerWalletProvider = require('truffle-ledger-provider');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { setupLoader } = require('@openzeppelin/contract-loader');
const proxyAbi = JSON.parse(require('./proxyAdminAbi.json').result);
const assert = require('assert');

function requireEnvVar(envVar, error) {
  assert(process.env[envVar] !== undefined, error);
  return process.env[envVar];
}

// Logging
function log() {
  console.log.apply(this, arguments)
}

const networks = {
  rinkeby: 4,
  mainnet: 1
};

const mainnet = 'mainnet';
const rinkeby = 'rinkeby';

function getHDWallet(mnemonic, projectId, network) {
  return new HDWalletProvider(mnemonic, `https://${network}.infura.io/v3/${projectId}`);
}

function getLedgerWallet(accountOffset, projectId, network) {
  const networkId = networks[network];
  assert(!isNaN(networkId), `Invalid network ${network}`);
  assert(!isNaN(accountOffset), `Invalid accountOffset ${accountOffset}`);
  const ledgerOptions = {
    networkId,
    path: `44'/60'/${accountOffset}'/0/0`, // path: "44'/60'/7'/0/0" ledger derivation path for eth account 8 (I had to copy this from the advanced logs ledgerlive) (0xc77b79A3859D19f640de049d8E38eF573Bd9654f)
    // path: "44'/60'/8'/0/0", // ledger derivation path for eth account 9 (I had to copy this from the advanced logs ledgerlive) (0x32C8A6fba0CBb59FC9C612C862b9026e9C9Ec9D0)
    askConfirm: true,
    accountsLength: 1,
    accountsOffset: 0
  };
  return new LedgerWalletProvider(ledgerOptions, `https://${network}.infura.io/v3/${projectId}`, true);
}

async function main(provider, proxyAbi, proxyAdminAddress, newOwner) {
  const loader = setupLoader({ provider }).web3;
  const proxyAdmin = await loader.fromABI(proxyAbi, null, proxyAdminAddress);
  let currentOwner = await proxyAdmin.methods.owner().call();
  console.log(`Current owner is ${currentOwner}`);
  const res = await proxyAdmin.methods.transferOwnership(newOwner).send({ from: currentOwner, gas: 500000, gasPrice: 128e9 });
  currentOwner = await proxyAdmin.methods.owner().call();
  console.log(`Current owner is ${currentOwner}`);
}


function getMnemonic() {
  return requireEnvVar('MNEMONIC', 'HD Wallet mnemonic for deployment');
}

function getSettings(useMainnet, hdWalletToLedger) {
  let provider, proxyAdminAddress, newOwner;

  if(useMainnet) {
    const network = mainnet;
    const projectId = requireEnvVar('PROJECT_ID', 'Infura project id');
    proxyAdminAddress = '0xbFe922C94bCE67bdb0CECb9a7eB80133edD27AE8';
    if(hdWalletToLedger) {
      newOwner = '0xa7B4e8d6bAD83Bb04660171eE154c6E50c62Bf50';  // ledger top address
      provider = getHDWallet(getMnemonic(), projectId, network);
    } else {
      const accountOffset = 0;
      newOwner = '0xBD5d6b9029C5bBeE703C9277C6c6eA4dB9bd2EB4';  // hd wallet top address
      provider = getLedgerWallet(accountOffset, projectId, network);
    }
  } else {
    const network = rinkeby;
    require('dotenv').config({path: '.env.rinkeby'});
    const projectId = requireEnvVar('PROJECT_ID', 'Infura project id');
    proxyAdminAddress = '0x319EeC7bdAd9EbAC65DAd006aCBE39d5b9832ef6';
    if(hdWalletToLedger) {
      newOwner = '0x4f277c4aD936d4460D0644f08d1E968704d93625';
      provider = getHDWallet(getMnemonic(), projectId, network);
    } else {
      const accountOffset = 7;
      newOwner = '0x4f277c4aD936d4460D0644f08d1E968704d93625';
      provider = getLedgerWallet(accountOffset, projectId, network);
    }
  }

  return {provider, proxyAdminAddress, newOwner}
}

const [useMainnet, hdWalletToLedger] = [false, true];
// const [useMainnet, hdWalletToLedger] = [false, false];
// const [useMainnet, hdWalletToLedger] = [true, true];
// const [useMainnet, hdWalletToLedger] = [true, false];
const {provider, proxyAdminAddress, newOwner} = getSettings(useMainnet, hdWalletToLedger);

// Running
if (require.main === module) {
  main(provider, proxyAbi, proxyAdminAddress, newOwner);
}