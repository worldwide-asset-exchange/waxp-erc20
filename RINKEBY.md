# Deployment Details
```
MNEMONIC="XXX" PROJECT_ID="YYY" ESCROW_ADDRESS="0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1" npx truffle migrate --network rinkeby

Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.


Starting migrations...
======================
> Network name:    'rinkeby'
> Network id:      4
> Block gas limit: 29970705 (0x1c95111)


1_deploy.js
===========

   Replacing 'WAXPERC20UpgradeSafe'
   --------------------------------
   > transaction hash:    0x49e7a093c1baa3b3a40bb3eca219f74be4d2df73b1bb3a9ed630dc0e042d5ef1
   > Blocks: 1            Seconds: 13
   > contract address:    0xe9097D48F8274624a632fdeD88f331E827409f57
   > block number:        11091423
   > block timestamp:     1658831504
   > account:             0xDc63C389e72d9f803f5c8fDe241A11e66E8D6531
   > balance:             1.256948509944787823
   > gas used:            2333250 (0x239a42)
   > gas price:           10 gwei
   > value sent:          0 ETH
   > total cost:          0.0233325 ETH


   Deploying 'ProxyAdmin'
   ----------------------
   > transaction hash:    0x9daaf5be0083af504ba4b38b8897b35d2021023c843e56b7d4b956d580f829cd
   > Blocks: 2            Seconds: 21
   > contract address:    0x3405230aF50E80D6D5FE24A00A31a4AcE49EAB1a
   > block number:        11091425
   > block timestamp:     1658831534
   > account:             0xDc63C389e72d9f803f5c8fDe241A11e66E8D6531
   > balance:             1.252108309944787823
   > gas used:            484020 (0x762b4)
   > gas price:           10 gwei
   > value sent:          0 ETH
   > total cost:          0.0048402 ETH


   Deploying 'TransparentUpgradeableProxy'
   ---------------------------------------
   > transaction hash:    0x0889fbd0cde1237d315f0bd1317c4e672889d709c53fc2ea661db0c1ea093c79
   > Blocks: 2            Seconds: 21
   > contract address:    0xF87721a07c94bC8C66a20De09ed78Fe1084fc1fd
   > block number:        11091427
   > block timestamp:     1658831564
   > account:             0xDc63C389e72d9f803f5c8fDe241A11e66E8D6531
   > balance:             1.244733169944787823
   > gas used:            737514 (0xb40ea)
   > gas price:           10 gwei
   > value sent:          0 ETH
   > total cost:          0.00737514 ETH

Deployed 0xF87721a07c94bC8C66a20De09ed78Fe1084fc1fd
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.03554784 ETH


2_upgrade.js
============
Upgraded 0xF87721a07c94bC8C66a20De09ed78Fe1084fc1fd
   -------------------------------------
   > Total cost:                   0 ETH

Summary
=======
> Total deployments:   3
> Final cost:          0.03554784 ETH
```