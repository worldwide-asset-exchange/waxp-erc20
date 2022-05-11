const HDWalletProvider = require('@truffle/hdwallet-provider');
const assert = require('assert');

function requireEnvVar(envVar, description) {
  assert(process.env[envVar] !== undefined, `Env var ${envVar} must be present${description ? ' - ' + description : ''}`);
  return process.env[envVar];
}

module.exports = {
  networks: {
    development: {
      protocol: 'http',
      host: process.env['ETHEREUM_HOST'] || 'localhost',
      port: 8545,
      gas: 5000000,
      gasPrice: 5e9,
      network_id: '*',
    },
    rinkeby: {
      provider: () => {
        require('dotenv').config({path: '.env.rinkeby'});
        const projectId = requireEnvVar('PROJECT_ID', 'Infura project id');
        const mnemonic = requireEnvVar('MNEMONIC', 'HD Wallet mnemonic for deployment');
        return new HDWalletProvider(
          mnemonic, `https://rinkeby.infura.io/v3/${projectId}`
        )
      },
      network_id: 4,
      gasPrice: 10e9,
      skipDryRun: true
    },
    ropsten: {
      provider: () => {
        require('dotenv').config({path: '.env.ropsten'});
        const projectId = requireEnvVar('PROJECT_ID', 'Infura project id');
        const mnemonic = requireEnvVar('MNEMONIC', 'HD Wallet mnemonic for deployment');
        return new HDWalletProvider(
          mnemonic, `https://ropsten.infura.io/v3/${projectId}`
        )
      },
      network_id: 3,
      gasPrice: 10e9,
      skipDryRun: true
    },
    mainnet: {
      provider: () => {
        require('dotenv').config({path: '.env.mainnet'});
        const projectId = requireEnvVar('PROJECT_ID', 'Infura project id');
        const mnemonic = requireEnvVar('MNEMONIC', 'HD Wallet mnemonic for deployment');
        return new HDWalletProvider(
          mnemonic, `https://mainnet.infura.io/v3/${projectId}`
        )
      },
      network_id: 1,
      gasPrice: 42e9,
      skipDryRun: true
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  compilers: {
    solc: {
      version: "0.6.12",
      docker: false,
      settings: {
       optimizer: {
         enabled: false,
         runs: 200
       },
      },
    },
  },
};
