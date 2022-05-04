const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const assert = require('assert');

function requireEnvVar(envVar, error) {
  assert(process.env[envVar] !== undefined, error);
  return process.env[envVar];
}

// Logging
function log() {
  console.log.apply(this, arguments)
}

const mainnet = 'mainnet';
const rinkeby = 'rinkeby';

function getHDWallet(mnemonic, projectId, network) {
  return new HDWalletProvider(mnemonic, `https://${network}.infura.io/v3/${projectId}`);
}

async function main(provider, amount, to) {
  try {
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    const amountToSend = web3.utils.toWei(amount, "ether"); //convert to wei value
    console.log('sending', accounts[0], amountToSend)
    let send = await web3.eth.sendTransaction({from: accounts[0], to, value:amountToSend, gas: 500000, gasPrice: 128e9 });
    console.log(send);
  }
  catch(e) {
    console.log(e);
  }
}


function getMnemonic() {
  return requireEnvVar('MNEMONIC', 'HD Wallet mnemonic for deployment');
}

function getSettings() {
  const network = mainnet;
  const projectId = requireEnvVar('PROJECT_ID', 'Infura project id');
  const provider = getHDWallet(getMnemonic(), projectId, network);

  return provider;
}

const provider = getSettings();

// Running
if (require.main === module) {
  main(provider, '3', '0xa7B4e8d6bAD83Bb04660171eE154c6E50c62Bf50');
}