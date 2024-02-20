# Deploy 

```bash
MNEMONIC="XXXX" PROJECT_ID="XXXXXX" ESCROW_ADDRESS="0xDc63C389e72d9f803f5c8fDe241A11e66E8D6531" npx truffle deploy --network sepolia

Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.


Starting migrations...
======================
> Network name:    'sepolia'
> Network id:      11155111
> Block gas limit: 30000000 (0x1c9c380)


1_deploy.js
===========

   Deploying 'TransparentUpgradeableProxy'
   ---------------------------------------
   > transaction hash:    0x6db4a561cc6cc8d0de32949b017c81bc1af98bf8a853e4e0af08a8c5ca4e6cf8
   > Blocks: 2            Seconds: 22
   > contract address:    0x575E394D279d90D83A53E91Ae7A701e751ad1872
   > block number:        5324295
   > block timestamp:     1708393968
   > account:             0xDc63C389e72d9f803f5c8fDe241A11e66E8D6531
   > balance:             0.46312541645600044
   > gas used:            737770 (0xb41ea)
   > gas price:           2.500011815 gwei
   > value sent:          0 ETH
   > total cost:          0.00184443371675255 ETH

Deployed 0x575E394D279d90D83A53E91Ae7A701e751ad1872
   > Saving artifacts
   -------------------------------------
   > Total cost:     0.00184443371675255 ETH


2_upgrade.js
============
Upgraded 0xC2E533dB2059C7fb9b8c21b26dE24818aa42FF4d
   -------------------------------------
   > Total cost:                   0 ETH

Summary
=======
> Total deployments:   1
> Final cost:          0.00184443371675255 ETH
```