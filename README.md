# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

## Quick start

Configure your `.env` file (see `.env.sample`) and run the following commands:

```shell
npm i
npm run test
```

Expected result:

```shell
❯ npm run test

> schedule-smart-contract@1.0.0 test
> npx hardhat test

Compiled 1 Solidity file successfully (evm target: paris).


  Lock
    Deployment
      ✔ Should set the right unlockTime (16234ms)
      ✔ Should check owner is deployer (170ms)
      ✔ Should check balance is locked (202ms)
    Withdrawals
      Validations
        ✔ Should revert with the right error if called too soon (353ms)
    Schedule Transaction
      ✔ Should schedule contract execution for the future (1769ms)


  5 passing (19s)
```

## Usage

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```
