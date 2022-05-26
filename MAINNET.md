# Deployment Details

```
aaron@raven:~/dev/projects/wax/waxp-erc20$ npx truffle migrate --network mainnet

Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.


Starting migrations...
======================
> Network name:    'mainnet'
> Network id:      1
> Block gas limit: 30000000 (0x1c9c380)


1_deploy.js
===========

   Replacing 'WAXPERC20UpgradeSafe'
   --------------------------------
   > transaction hash:    0x96a09ad606c93a87ab33f2fad941b7a25f580f10f9249480c867f89f53a76cc4
   > Blocks: 5            Seconds: 56
   > contract address:    0x5e31FB91e92Fc6E2edA0b9d1Fa8648B126f3B184
   > block number:        14844612
   > block timestamp:     1653520481
   > account:             0x4baaf565B911B9f1b7f25AEc6c6eE5B3F15f98d1
   > balance:             0.711714271
   > gas used:            2015770 (0x1ec21a)
   > gas price:           42 gwei
   > value sent:          0 ETH
   > total cost:          0.08466234 ETH


   Deploying 'ProxyAdmin'
   ----------------------
   > transaction hash:    0x0ecd0b38719b2da347e77683ec7beba2d6e5136871c9679bd2e6324e9e9d9f8f
   > Blocks: 2            Seconds: 4
   > contract address:    0x0040658a3A35cDf69aD1d61d8821513Df9c4E991
   > block number:        14844615
   > block timestamp:     1653520494
   > account:             0x4baaf565B911B9f1b7f25AEc6c6eE5B3F15f98d1
   > balance:             0.691385431
   > gas used:            484020 (0x762b4)
   > gas price:           42 gwei
   > value sent:          0 ETH
   > total cost:          0.02032884 ETH


   Deploying 'TransparentUpgradeableProxy'
   ---------------------------------------
   > transaction hash:    0xe4f41f91bdb08112b0bf45e6ebc769e75a7c4af33cdf1d74d716a68ea02d67be
   > Blocks: 0            Seconds: 44
   > contract address:    0x2A79324c19Ef2B89Ea98b23BC669B7E7c9f8A517
   > block number:        14844616
   > block timestamp:     1653520498
   > account:             0x4baaf565B911B9f1b7f25AEc6c6eE5B3F15f98d1
   > balance:             0.660409423
   > gas used:            737524 (0xb40f4)
   > gas price:           42 gwei
   > value sent:          0 ETH
   > total cost:          0.030976008 ETH

Deployed 0x2A79324c19Ef2B89Ea98b23BC669B7E7c9f8A517
   > Saving artifacts
   -------------------------------------
   > Total cost:         0.135967188 ETH


2_upgrade.js
============
   -------------------------------------
   > Total cost:                   0 ETH

Summary
=======
> Total deployments:   3
> Final cost:          0.135967188 ETH
```

Deployment proxy address is: `0x2A79324c19Ef2B89Ea98b23BC669B7E7c9f8A517`
Initial escrow `0x6dcc725d2cb337ed5da8ae183870f3f02dd6c707`

---

Verification

```
aaron@raven:~/dev/projects/wax/waxp-erc20$ npx truffle run verify WAXPERC20UpgradeSafe --network mainnet
Verifying WAXPERC20UpgradeSafe
Verifying proxy implementation at 0x5e31fb91e92fc6e2eda0b9d1fa8648b126f3b184
Pass - Verified: https://etherscan.io/address/0x2A79324c19Ef2B89Ea98b23BC669B7E7c9f8A517#code
Successfully verified 1 contract(s).
```