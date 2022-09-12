# Deploy 

```
waxp-erc20$ MNEMONIC="XXXX" PROJECT_ID="XXXXXX" ESCROW_ADDRESS="0xDc63C389e72d9f803f5c8fDe241A11e66E8D6531" npx truffle deploy --network goerli

Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.


Starting migrations...
======================
> Network name:    'goerli'
> Network id:      5
> Block gas limit: 30000000 (0x1c9c380)


1_deploy.js
===========

   Deploying 'WAXPERC20UpgradeSafe'
   --------------------------------
   > transaction hash:    0xd8bcefbe5c566c7f26dabdae85d9fa4ac84d9f9abf21bb5cce22c234d0e15e79
   > Blocks: 1            Seconds: 17
   > contract address:    0x4dFCb3E0c9b69720836F95DB9C40bf299Defe5BB
   > block number:        7578238
   > block timestamp:     1662987204
   > account:             0xDc63C389e72d9f803f5c8fDe241A11e66E8D6531
   > balance:             9.714238904855107762
   > gas used:            2333250 (0x239a42)
   > gas price:           2.500000059 gwei
   > value sent:          0 ETH
   > total cost:          0.00583312513766175 ETH


   Deploying 'ProxyAdmin'
   ----------------------
   > transaction hash:    0x2e977e0eb2939a8ae3bce39b1e5061c505c2e2252a49a06cafdc5a0d68b1dc1a
   > Blocks: 1            Seconds: 25
   > contract address:    0x66d8A3100C3C338B319332f0fd8D155B90AAf6ac
   > block number:        7578239
   > block timestamp:     1662987228
   > account:             0xDc63C389e72d9f803f5c8fDe241A11e66E8D6531
   > balance:             9.713028854824614502
   > gas used:            484020 (0x762b4)
   > gas price:           2.500000063 gwei
   > value sent:          0 ETH
   > total cost:          0.00121005003049326 ETH


   Deploying 'TransparentUpgradeableProxy'
   ---------------------------------------
   > transaction hash:    0xd7729dc7a5e6bde484f7438bb7cf211e35ca08f1bf61053279186c9e986e1c5e
   > Blocks: 2            Seconds: 17
   > contract address:    0x8EC63D0803994bA4038A8D8ceDEA16E7280E62B9
   > block number:        7578241
   > block timestamp:     1662987264
   > account:             0xDc63C389e72d9f803f5c8fDe241A11e66E8D6531
   > balance:             9.71118506976708841
   > gas used:            737514 (0xb40ea)
   > gas price:           2.500000078 gwei
   > value sent:          0 ETH
   > total cost:          0.001843785057526092 ETH

Deployed 0x8EC63D0803994bA4038A8D8ceDEA16E7280E62B9
   > Saving artifacts
   -------------------------------------
   > Total cost:     0.008886960225681102 ETH


2_upgrade.js
============
Upgraded 0x8EC63D0803994bA4038A8D8ceDEA16E7280E62B9
   -------------------------------------
   > Total cost:                   0 ETH

Summary
=======
> Total deployments:   3
> Final cost:          0.008886960225681102 ETH
```