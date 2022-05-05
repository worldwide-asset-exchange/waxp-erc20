# Deployment Details

```
aaron@raven:~/dev/projects/wax/waxp-erc20$ npx oz deploy
Nothing to compile, all contracts are up to date.
? Choose the kind of deployment upgradeable
? Pick a network mainnet
? Pick a contract to deploy WAXPERC20UpgradeSafe
All implementations are up to date
? Call a function to initialize the instance after creating it? Yes
? Select which function * initialize(escrow: address)
? escrow: address: 0x6dcc725d2cb337ed5da8ae183870f3f02dd6c707
✓ Setting everything up to create contract instances
✓ Instance created at 0x2FdFd5FC7a0Fa6E08DE45262341Ca1C6AED65Eb8
To upgrade this instance run 'oz upgrade'
0x2FdFd5FC7a0Fa6E08DE45262341Ca1C6AED65Eb8

```

Deployment proxy address is: `0x2FdFd5FC7a0Fa6E08DE45262341Ca1C6AED65Eb8`
Initial escrow `0x6dcc725d2cb337ed5da8ae183870f3f02dd6c707`
```